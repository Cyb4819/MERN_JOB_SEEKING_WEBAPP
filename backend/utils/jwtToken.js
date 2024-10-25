export const sendToken = (user, statusCode, res, message) => {
  if (!user) {
    console.error("User is not defined");
    return;
  }

  const token = user.getJWTToken();

  if (!token) {
    console.error("Token is not defined");
    return;
  }

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token,
  });
};