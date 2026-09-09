import app from "./app.js";
import dotenv from "dotenv";
import mongoose from 'mongoose'


dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE).then(() => {
  console.log("DB connected");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.log('Database connection failed:', err.message);
})
