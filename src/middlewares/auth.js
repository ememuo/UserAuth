const jwt = require("jsonwebtoken");
const pool = require("../utils/db");

require("dotenv").config();

const verifyToken = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Missing Token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token Verification failed: ", error.message);
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;
