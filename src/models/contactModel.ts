import { IContactForm } from "@/schemas/contactSchema";
import mongoose, { Schema, Types } from "mongoose";

export interface IContactFormDocument
  extends Omit<IContactForm, "_id">,
    Document {
  _id: Types.ObjectId;
}

const contactFormSchema = new Schema<IContactFormDocument>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: (v: string) => /^\d{10,15}$/.test(v),
        message: "Phone number must be 10-15 digits",
      },
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["new", "inprogress", "resolved"],
      default: "new",
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    autoCreate: true,
    autoIndex: true,
  }
);

export const ContactFormModel =
  mongoose.models.ContactForm ||
  mongoose.model<IContactFormDocument>("ContactForm", contactFormSchema);
