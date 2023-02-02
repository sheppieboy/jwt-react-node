const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const users = require("./data");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());

let refreshTokens = [];

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.SECRET_KEY,
    {
      expiresIn: "15s",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: "15m" }
  );
};

app.post("/api/refresh", (req, res) => {
  //take the refresh token from the user
  const refreshToken = req.body.token;

  //send error if there is no token or invalid token
  if (!refreshToken) {
    return res.status(401).json("you are not authenticated");
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json("RefreshToken is not valid");
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => {
      token !== refreshToken;
    });
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  //create new access token and send to user
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => {
    return u.username == username && u.password == password;
  });

  if (user) {
    //generate an access token
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);

    res.json({
      username: user.username,
      isAdmin: user.isAdmin,
      accessToken,
      refreshToken,
    });
  } else {
    res.status(400).json("username or password incorrect");
  }
});

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;
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

app.post("/api/logout", verify, (req, res) => {
  const refreshToken = req.body.token,
    refreshTokens = filter((token) => token !== refreshToken);
  res.status(200).json("you are logged out successfully");
});

app.delete("/api/users/:userId", verify, (req, res) => {
  if (req.user.id == req.params.userId || req.user.isAdmin) {
    res.status(200).json("user has been deleted");
  } else {
    res.status(403).json("you are not allowed to delete this user");
  }
});

app.listen(3000, () => {
  console.log("Backend server is running");
});
