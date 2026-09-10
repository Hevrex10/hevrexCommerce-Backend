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
    product.stock -= item.quantity;
    await product.save();

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

export async function getOrder(req, res, next) {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("No order found with that ID", 404));
  }
  if (
    order.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new AppError("You are not allowed to view this order", 403));
  }

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
}

export async function updateOrderStatus(req, res, next) {
  const order = await Order.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });

  order.status = req.body.status;
  await order.save();
  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
}

export async function cancelOrder(req, res, next) {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  if (order.status !== "pending") {
    return next(new AppError("Only pending orders can be cancelled", 400));
  }

  order.status = "cancelled";

  await order.save();

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
}
