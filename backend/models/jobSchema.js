import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  companyname:{
    type: String,
    required: [true, "Please provide a Name oF the Company."],
    minLength: [3, "Company name must contain at least 3 Characters!"],
    maxLength: [300, "Company Name cannot exceed 300 Characters!"],
  },
  title: {
    type: String,
    required: [true, "Please provide a title."],
    minLength: [3, "Title must contain at least 3 Characters!"],
    maxLength: [30, "Title cannot exceed 30 Characters!"],
  },
  description: {
    type: String,
    required: [true, "Please provide decription."],
    minLength: [30, "Description must contain at least 30 Characters!"],
    maxLength: [1500, "Description cannot exceed 1500 Characters!"],
  },
  category: {
    type: String,
    required: [true, "Please provide a category."],
  },
  vacancy: {
    type: Number,
    required: [true, "Please provide No oF Vacant Seats."],
    minLength:[1000000, "Vacantposition seats should be at least 1 "]
  },
  qualification: {
    type: String,
    required: [true, "Please enter qualification."],
    minLength: [10, "Must contain atleast 10 character"],
  },
  location: {
    type: String,
    required: [true, "Please provide location."],
    minLength: [20, "Location must contian at least 20 characters!"],
  },
  fixedSalary: {
    type: String,
    minLength: [4, "Salary must contain at least 4 digits/ any word that contain 4 words"],
    maxLength: [9, "Salary cannot exceed 9 digits"],
  },
  timeperiod:{
    type: String,
    required:[true,"Enter time period of the job"],
  },
  salaryFrom: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"],
    maxLength: [9, "Salary cannot exceed 9 digits"],
  },
  salaryTo: {
    type: Number,
    minLength: [4, "Salary must contain at least 4 digits"],
    maxLength: [9, "Salary cannot exceed 9 digits"],
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Job = mongoose.model("Job", jobSchema);
