import { ISvgLogo } from "@/schemas/logoSchema";
import mongoose, { Document, Schema } from "mongoose";

// Define the interface for Mongoose document
interface ISvgLogoDocument extends ISvgLogo, Document {
  isActive: boolean;
}

// Create the Mongoose schema
const SvgLogoSchema = new Schema<ISvgLogoDocument>(
  {
    svg: {
      viewBox: {
        type: String,
        required: [true, "ViewBox is required"],
      },
      size: {
        type: Number,
        min: 1,
        optional: true,
      },
      paths: {
        type: String,
        required: true,
        validate: {
          validator: (value: string) => {
            try {
              const parsed = JSON.parse(value);
              return (
                Array.isArray(parsed) &&
                parsed.every((item: any) => typeof item.d === "string")
              );
            } catch {
              return false;
            }
          },
          message:
            "Must be a valid JSON array of path objects with 'd' property",
        },
      },
      animation: {
        duration: {
          type: Number,
          min: 0.1,
        },
        delayMultiplier: {
          type: Number,
          min: 0,
        },
      },
      source: {
        type: String,
        optional: true,
      },
    },
    isActive: { type: Boolean, default: true},
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);
// Create the model
const SvgLogoModel: mongoose.Model<ISvgLogo> =
  mongoose.models.SvgLogo ||
  mongoose.model<ISvgLogoDocument>("SvgLogo", SvgLogoSchema);

export default SvgLogoModel;
