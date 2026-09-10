import express from "express";
import productRouter from "./routes/productRoute.js";
import userRouter from "./routes/userRoute.js";
import errorController from "./controllers/errorController.js";
import reviewRouter from "./routes/reviewRoute.js";
import orderRouter from "./routes/orderRoute.js";
import cartRouter from "./routes/cartRoute.js";

const app = express();

app.use(express.json());

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/carts", cartRouter);

app.use(errorController);

export default app;
