const express = require("express");
const app = express();
const PORT = 3005;
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to format body into JSON
app.use(require("body-parser").json());

// Middleware for logging
app.use(require("morgan")("dev"));

app.use((req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  try {
    const { id } = jwt.verify(token, process.env.JWT);
    req.userId = id;
  } catch (error) {
    req.userId = null;
  }

  next();
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1> Choo Choo!");
});

app.use("/api", require("./api"));
app.use("/auth", require("./auth"));

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server is up and running and listening on port ${PORT}`);
  } else {
    console.log(`Something went wrong`);
  }
});
