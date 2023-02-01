const express = require("express");
const app = express();
import { users } from "./data";

app.listen(3000, () => {
  console.log("Backend server is running");
});
