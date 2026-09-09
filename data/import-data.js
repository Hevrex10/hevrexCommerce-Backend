import mongoose from "mongoose";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import Product from "../model/productModel.js";
import User from "../model/userModel.js"
import  Review from '../model/reviewModel.js'
import dotenv from "dotenv";

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

dotenv.config({ path: "./config.env" });

//read jSON file

const products = JSON.parse(
  fs.readFileSync(path.join(__dirname, "reviews.json"), "utf-8"),
);

async function importData() {
  try {
    await Review.create(products);
     console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
}
async function deleteData() {
  try {
    await Review.deleteMany();
    console.log("Data succesfully Deleted");
  } catch (err) {
    console.log(err);
  }
  process.exit();
}

mongoose.connect(process.env.DATABASE).then(() => console.log("DB connected"));

if (process.argv.includes("--import")) {
  importData();
}
if (process.argv.includes("--delete")) {
  deleteData();
}
