import Product from "../model/productModel.js";
import APIFeatures from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";

export async function getAllProduct(req, res, next) {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();
  const products = await features.query;

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
}

export async function createProduct(req, res, next) {
  const product = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
}

export async function updateProduct(req, res, next) {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(
      new AppError(`No product found with the ID:${req.params.id}`, 404),
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
}

export async function getProduct(req, res, next) {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
}

export async function deleteProduct(req, res, next) {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(
      new AppError(`No tour found with the ID: ${req.params.id}`, 404),
    );
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
}

export async function getUserOrder(req, res, next) {
  const products = await Product.find({
    product: req.params.productId,
  });
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
}
