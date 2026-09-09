import Review from "../model/reviewModel.js";

export async function getAllReview(req, res, next) {
  const reviews = await Review.find();

  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
}

export async function getReview(req, res, next) {
  const review = await Review.findById(req.params.id)
    .populate("product")
    .populate("user");

  if (!review) {
    return next("No review found with that ID", 400);
  }

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
}
export async function createReview(req, res, next) {
  const review = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    product: req.params.productId,
    user: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      review,
    },
  });
}
export async function deleteReview(req, res, next) {
  // const reviews = Review.find();

  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
}
export async function updateReview(req, res, next) {
  // const reviews = Review.find();

  res.status(200).json({
    status: "success",
    data: {
      reviews,
    },
  });
}

export async function getProductReviews(req, res, next) {
  const reviews = await Review.find({
    product: req.params.productId,
  });
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
}

export async function getUserReview(req, res, next) {
  const reviews = await Review.find({
    product: req.params.userId,
  });

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
}
