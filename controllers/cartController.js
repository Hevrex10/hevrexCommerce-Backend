import Cart from "../model/cartModel.js";

export async function getCart(req, res, next) {
  const cart = await Cart.findOne({
    user: req.user._id,
  }).populate("items.product");

  if (!cart) {
    return res.status(200).json({
      status: "success",
      data: {
        cart: {
          items: [],
        },
      },
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
}

export async function addToCart(req, res, next) {
  const { product, quantity, size, color } = req.body;

  let cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [
        {
          product,
          quantity,
          size,
          color,
        },
      ],
    });
  } else {
    const existingItem = cart.items.find((item) => item.product === product);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product,
        quantity,
        size,
        color
      });
    }

    await cart.save();
  }

  await cart.populate("items.product");

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
}

export async function removeFromCart(req, res, next) {
  const { productId } = req.params;

  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  await cart.save();

  await cart.populate("items.product");

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
}

export async function clearCart(req, res, next) {
  const cart = await Cart.findOne({
    user: req.user._id,
  });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  cart.items = [];

  await cart.save();

  res.status(200).json({
    status: "success",
    data: {
      cart,
    },
  });
}
