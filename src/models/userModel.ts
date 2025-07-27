import { IUser } from "@/schemas/userSchema";
import mongoose, { Schema, Document, Model } from "mongoose";
// Define the role enum
export type UserRole = "admin" | "user";
// Define the interface
export interface IUserDocument extends IUser, Document {}

// Updated User schema
const UserSchema: Schema<IUserDocument> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please use a valid email address"],
      index: true,
      lowercase: true,
    },
    name: { type: String },
    phone: { type: String },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    banner: { type: String },
    image: { type: String },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    verifyCode: {
      type: String,
      required: false,
    },

    verifyCodeExpiry: {
      type: Date,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Create and export the model
const UserModel: Model<IUserDocument> =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

export default UserModel;
