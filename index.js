import express from "express";
import Connect from "./config/database";

//middleware
app.use(express.json());
app.use(express.cors());

const app = express();
const port = process.env.PORT || 4000;

Connect();
app.listen(port, (err) => {
  if (!err) {
    console.log("server is good");
  } else {
    console.log("error in server");
  }
});
