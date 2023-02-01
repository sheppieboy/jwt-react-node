const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const users = require("./data");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => {
    return u.username == username && u.password == password;
  });

  if (user) {
    //generate an access token
    const accessToken = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY
    );
    res.json({
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken,
    });
  } else {
    res.status(400).json("username or password incorrect");
  }
});

const verify = (req, res, next) => {
  const authHeader = req.headers.Authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(401).json("Token is not valid");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("you are not authenticated");
  }
};

app.listen(3000, () => {
  console.log("Backend server is running");
});
