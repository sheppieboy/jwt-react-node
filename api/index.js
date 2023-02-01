const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const users = require("./data");

app.use(express.json());

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => {
    return u.username == username && u.password == password;
  });

  if (user) {
    res.json(user);
  } else {
    res.status(400).json("username or password incorrect");
  }
});

app.listen(3000, () => {
  console.log("Backend server is running");
});
