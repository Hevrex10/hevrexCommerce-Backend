import User from "../model/userModel.js";
import AppError from "../utils/appError.js";

export async function getAllUser(req, res, next) {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users,
    },
  });
}

export async function getUser(req, res, next) {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
}

export async function updateMe(req, res, next) {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400,
      ),
    );
  }

  const filterBody = {
    name: req.body.name,
    email: req.body.email,
  };
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filterBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError("user not found", 4040));
  }
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
}

export function getMe(req, res, next) {
  req.params.id = req.user._id;
  next();
}

export async function deleteMe(req, res, next) {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  user.active = false;
  await user.save({ validateBeforeSave: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
}
