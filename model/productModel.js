import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A product must have a name"],
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "A product must have a price"],
      trim: true,
      min: 0,
    },
    image: {
      type: String,
      required: [true, "A product must have an image"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "A product must have a description"],
      trim: true,
    },
    category: {
      type: String,
    },
    colors: [String],
    sizes: [String],
    tags: [String],
    stock: {
      type: Number,
      required: [true, "A product must have stock"],
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

productSchema.pre(/^find/, function (next) {
  this.populate("reviews");
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
