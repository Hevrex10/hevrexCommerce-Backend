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

import Product from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";

export async function createProduct(req, res, next) {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "Please upload a product image",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "rexcommerce/products",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      uploadStream.end(req.file.buffer);
    });

    const product = await Product.create({
      name: req.body.name,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      category: req.body.category,
      description: req.body.description,

      colors: JSON.parse(req.body.colors || "[]"),
      sizes: JSON.parse(req.body.sizes || "[]"),
      tags: JSON.parse(req.body.tags || "[]"),

      image: result.secure_url,
    });

    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (err) {
    next(err);
  }
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
