import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  console.log('Request Cookies:', req.cookies);
  const token = req.cookies.token; // Get the token from the cookies
  console.log("Token:", token);
  if (!token) {
    return next(new ErrorHandler("User Not Authorized", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log('Decoded Token:', decoded);

  req.user = await User.findById(decoded.id);
  console.log('User:', req.user);

  next();
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 401));
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new ErrorHandler("Invalid password", 401));
  }
  const token = user.getJWTToken();
  res.status(200).json({
    success: true,
    token,
    user,
  });
});