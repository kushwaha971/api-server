const { createClient } = require("@clickhouse/client");
const { Kafka } = require("kafkajs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

const client = createClient({
  host: process.env.CLICK_HOUSE_HOST,
  database: process.env.CLICK_HOUSE_DB,
  username: process.env.CLICK_HOUSE_USER,
  password: process.env.CLICK_HOUSE_PASSWORD,
});
const kafkaPemPath = path.join(__dirname, "kafka.pem");
const kafka = new Kafka({
  clientId: `api-server`,
  brokers: ["kafka-19e4360-akash971.e.aivencloud.com:22295"],
  ssl: {
    ca: [fs.readFileSync(kafkaPemPath, "utf-8")],
  },
  sasl: {
    username: process.env.KAFKA_USER,
    password: process.env.KAFKA_PASSWORD,
    mechanism: "plain",
  },
});

const consumer = kafka.consumer({ groupId: "api-server-logs-consumer" });

async function initKafkaConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topics: ["container-logs"] });

  await consumer.run({
    autoCommit: false,
    eachBatch: async function ({
      batch,
      heartbeat,
      commitOffsetsIfNecessary,
      resolveOffset,
    }) {
      const messages = batch.messages;
      console.log(`Receive ${messages.length} messages`);
      for (const msg of messages) {
        const strignMessage = msg.value.toString();
        const { PROJECT_ID, DEPLOYMENT_ID, log } = JSON.parse(strignMessage);
        const { query_id } = await client.insert({
          table: "log_events",
          values: [
            {
              event_id: uuidv4(),
              deployment_id: DEPLOYMENT_ID,
              log: log,
            },
          ],
          format: "JSONEachRow",
        });
        console.log("Query Id", query_id);
        commitOffsetsIfNecessary(msg.offset);
        resolveOffset(msg.offset);
        await heartbeat();
      }
    },
  });
}

module.exports = { initKafkaConsumer, client };
