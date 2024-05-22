require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const indexRouter = require("./src/routes/api");
const { initKafkaConsumer } = require("./src/config/kafka");
const db = require("./src/models");
const cookieParser = require("cookie-parser");

const app = express();
const memoryStore = new session.MemoryStore();

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use(
  session({
    secret: "some secret",
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/api", indexRouter);
app.use(cors());
app.options("*", cors());

app.get("/", (req, res) => {
  return res.status(200).send({ msg: "Working" });
});

initKafkaConsumer();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
