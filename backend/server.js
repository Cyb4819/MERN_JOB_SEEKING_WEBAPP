import app from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

// Set the port
const PORT = process.env.PORT || 3000;

app.listen(process.env.PORT, () => {
  console.log(`Server running at port ${process.env.PORT}`);
});
