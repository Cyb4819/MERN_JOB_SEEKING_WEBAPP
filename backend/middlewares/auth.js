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