import Order from "../model/orderModel.js";
import AppError from "../utils/appError.js";
import Product from "../model/productModel.js";

export async function getAllOrder(req, res, next) {
  const orders = await Order.find();

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
}

export async function getUserOrder(req, res, next) {
  const orders = await Order.find({
    user: req.user._id,
  });
  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders,
    },
  });
}

export async function createOrder(req, res, next) {
  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    return next(new AppError("An order must contain at least one item", 400));
  }

  const productIds = items.map((item) => item.product);

  const products = await Product.find({
    _id: { $in: productIds },
  });

  const orderItems = [];
  let totalPrice = 0;

  for (const item of items) {
    const product = products.find(
      (product) => product._id.toString() === item.product,
    );

    if (!product) {
      return next(new AppError(`Product not found: ${item.product}`, 404));
    }

    if (product.stock < item.quantity) {
      return next(new AppError(`Not enough stock for ${product.name}`, 400));
    }

    const itemTotal = product.price * item.quantity;
    totalPrice += itemTotal;

    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalPrice,
    shippingAddress,
  });

  res.status(201).json({
    status: "success",
    data: {
      order,
    },
  });
}
