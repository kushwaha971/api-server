const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  /**
   * Read the token from the Header
   */
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      success: false,
      message: "No token Provided",
    });
  }

  // If the Token was provided , we need to verify it
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorised",
      });
    }

    // I will try to read the UserID from the decoded token and store it in req object
    req.id = decoded.id;
    next();
  });
}

module.exports = { verifyToken };
