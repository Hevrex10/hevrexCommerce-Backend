import User from "../model/userModel.js";
import AppError from "../utils/appError.js";
import { sendEmail } from "../utils/email.js";
import generateToken from "../utils/tokenUtils.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function signup(req, res, next) {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = generateToken(newUser._id);
  newUser.password = undefined;

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
}

export async function login(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("incorrect email or password", 401));
  }

  const token = generateToken(user._id);
  res.cookie("jwt", token, {
    hhtpOnly: true,
    secure: false,
  });

  res.status(200).json({
    status: "success",
    token,
  });
}

export async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in Please log in to get access", 401),
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id).select("+active");

  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists", 404),
    );
  }
  if (!currentUser.active) {
    return next(new AppError("The account has been deactivated.", 401));
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password, Please log in again", 401),
    );
  }
  req.user = currentUser;
  next();
}

export function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }
    next();
  };
}

export async function forgotPassword(req, res, next) {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with email Address.", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetpassword/${resetToken}`;

  const message = `Forgot your password?

Submit a PATCH request with your new password and passwordConfirm to:

${resetURL}

If you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });
    res.status(200).json({
      status: "success",
      subject: "Token sent to the mail",
    });
  } catch (err) {
    console.log(err);
    ((user.passwordResetToken = undefined),
      /////
      (user.passwordResetExpires = undefined),
      /////////
      /////
      await user.save({ validateBeforeSave: false }));

    return next(
      new AppError(
        "There was an error sending the  email. Please try again later.",
        500,
      ),
    );
  }
}

export async function resetPassword(req, res, next) {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = generateToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
}

export async function updatePassword(req, res, next) {
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError("Your current password is incorrect", 401));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  const token = generateToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
}
