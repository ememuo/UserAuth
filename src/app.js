const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoute = require("./routes/authRoutes");
const apiRoute = require("./routes/apiRoutes");
const verifyToken = require("../src/middlewares/auth");

const app = express();

dotenv.config();
app.use(cors());
app.options("*", cors());

app.use(bodyParser.json({ limit: "50mb" })); // support json encoded bodies
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));
app.use(express.urlencoded({ extended: true }));

app.get("/userinfo", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

app.use("/auth", authRoute);
app.use("/api", apiRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
