import { ITestimonial } from "@/schemas/testimonialSchema";
import mongoose, { Document, Model } from "mongoose";

// Interface for Mongoose document
export interface ITestimonialDocument extends ITestimonial, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
// Mongoose schema definition
const testimonialSchema = new mongoose.Schema<ITestimonialDocument>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      minlength: [2, "Full name must be at least 2 characters"],
      maxlength: [50, "Full name must be less than 50 characters"],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      minlength: [2, "Designation must be at least 2 characters"],
      maxlength: [50, "Designation must be less than 50 characters"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [50, "Description must be at least 50 characters"],
      maxlength: [150, "Description must be less than 150 characters"],
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Create the model
export const Testimonial: Model<ITestimonialDocument> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonialDocument>("Testimonial", testimonialSchema);

export default Testimonial;
