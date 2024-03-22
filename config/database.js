import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db_str = process.env.STR_URL;

const Connect = mongoose.connect(db_str).then((err) => {
  if (!err) {
    console.log("connected to database successfully !");
  } else {
    console.log("error in Connect to database ");
  }
});

export default Connect;
