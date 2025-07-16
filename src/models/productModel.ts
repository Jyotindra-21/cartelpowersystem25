import {
  applyPricingUpdates,
  calculateDiscount,
  calculateUpdatedPricing,
  hasPricingUpdates,
} from "@/lib/discountCalculation";

import {
  IProduct,
  IProductBasicInfo,
  IProductBenefit,
  IProductFeature,
  IProductFeatures,
  IProductFlags,
  IProductImage,
  IProductInventory,
  IProductMedia,
  IProductPricing,
  IProductRatings,
  IProductResources,
  IProductSeo,
  IProductSpecification,
  IProductTags,
  IProductWarranty,
  ProductSchema,
} from "@/schemas/productsSchema";
import mongoose, { Schema, Document, Types, UpdateQuery } from "mongoose";

type HookNextFunction = (err?: mongoose.CallbackError) => void;

export interface IProductDocument
  extends Omit<IProduct, "_id" | "id">,
    Document {
  _id: Types.ObjectId;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper schema definitions
const productSpecificationSchema = new Schema<IProductSpecification & Document>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    icon: { type: String, optional: true },
  }
);

const productFeatureSchema = new Schema<IProductFeature & Document>({
  title: { type: String, required: true },
  description: { type: String, optional: true },
  icon: { type: String, optional: true },
});

const productBenefitSchema = new Schema<IProductBenefit & Document>({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, optional: true },
});

const productImageSchema = new Schema<IProductImage & Document>({
  url: { type: String, optional: true },
  altText: { type: String, optional: true },
  caption: { type: String, optional: true },
});

// Section schemas
const basicInfoSchema = new Schema<IProductBasicInfo & Document>({
  name: { type: String, required: true },
  slug: { type: String, optional: true, index: true },
  // category: { type: String, optional: true },
  // subcategory: { type: String, optional: true },
  brand: { type: String, optional: true },
  description: { type: String, required: true },
  shortDescription: { type: String, optional: true },
});

const mediaSchema = new Schema<IProductMedia & Document>({
  mainImage: { type: String, required: true },
  images: [productImageSchema],
  videoUrl: { type: String, optional: true },
});

const pricingSchema = new Schema<IProductPricing & Document>({
  price: { type: Number, required: true, min: 0 },
  oldPrice: { type: Number, optional: true, min: 0 },
  discountPercentage: { type: Number, optional: true, min: 0, max: 100 },
  hasDiscount: { type: Boolean, default: false },
  taxIncluded: { type: Boolean, default: false },
  costPrice: { type: Number, optional: true, min: 0 },
});

const inventorySchema = new Schema<IProductInventory & Document>({
  inStock: { type: Boolean, default: true },
  stockQuantity: { type: Number, optional: true, min: 0 },
  sku: { type: String, required: true },
  barcode: { type: String, optional: true },
});

const featuresSchema = new Schema<IProductFeatures & Document>({
  features: [productFeatureSchema],
  keyFeatures: [{ type: String }],
  specifications: [productSpecificationSchema],
  benefits: [productBenefitSchema],
});

const tagsSchema = new Schema<IProductTags & Document>({
  tags: [{ type: String }],
});

const ratingsSchema = new Schema<IProductRatings & Document>({
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
});

const warrantySchema = new Schema<IProductWarranty & Document>({
  warranty: { type: String, required: true },
  warrantyDuration: { type: String, optional: true },
  supportInfo: { type: String, optional: true },
});

const flagsSchema = new Schema<IProductFlags & Document>({
  isNewProduct: { type: Boolean, required: true },
  isBanner: { type: Boolean, required: true },
  isHighlighted: { type: Boolean, required: true },
  isActive: { type: Boolean, required: true },
});

const seoSchema = new Schema<IProductSeo & Document>({
  seoTitle: { type: String, optional: true },
  seoDescription: { type: String, optional: true },
});

const resourcesSchema = new Schema<IProductResources & Document>({
  installationGuideUrl: { type: String, optional: true },
  relatedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

// Main product schema
const productSchema = new Schema<IProductDocument>(
  {
    basicInfo: basicInfoSchema,
    media: {
      type: mediaSchema,
      required: false, // Make optional
    },
    pricing: {
      type: pricingSchema,
      required: false, // Make optional
    },
    inventory: {
      type: inventorySchema,
      required: false, // Make optional
    },
    featuresSection: {
      type: featuresSchema,
      required: false, // Make optional
    },
    tags: {
      type: tagsSchema,
      required: false, // Make optional
    },
    ratingsAndReview: {
      type: ratingsSchema,
      required: false, // Make optional
    },
    warranty: {
      type: warrantySchema,
      required: false, // Make optional (overrides the required fields in warrantySchema)
    },
    flags: {
      type: flagsSchema,
      required: false, // Make optional
    },
    seo: {
      type: seoSchema,
      required: false, // Make optional
    },
    resources: {
      type: resourcesSchema,
      required: false, // Make optional
    },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete (ret as any)._id;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

productSchema.virtual("id").get(function () {
  return this._id.toString();
});

productSchema.index({ "basicInfo.slug": 1 }, { unique: true });

// ====================== MIDDLEWARE ORGANIZATION ======================
// 1. VALIDATION MIDDLEWARE
const createValidationMiddleware = (operation: "save" | "update") => {
  return async function (this: any, next: HookNextFunction) {
    try {
      let dataToValidate;

      if (operation === "save") {
        dataToValidate = this.toObject();
      } else {
        const update = this.getUpdate();
        if (!update) return next();

        const doc = await this.model.findOne(this.getQuery());
        if (!doc) return next();

        dataToValidate = { ...doc.toObject(), ...update };
      }

      await ProductSchema.parseAsync(dataToValidate);
      next();
    } catch (error) {
      next(error as Error);
    }
  };
};

// 2. DISCOUNT CALCULATION MIDDLEWARE
const createDiscountMiddleware = (operation: "save" | "update") => {
  return async function (this: any, next: HookNextFunction) {
    try {
      if (operation === "save") {
        calculateDiscount((this as IProductDocument).pricing);
        return next();
      }

      const update = this.getUpdate() as UpdateQuery<IProductDocument>;
      if (!hasPricingUpdates(update)) return next();

      const doc = await this.model.findOne(this.getQuery());
      if (!doc) return next();

      const newPricing = calculateUpdatedPricing(update, doc.pricing);
      calculateDiscount(newPricing);
      applyPricingUpdates(update, newPricing);

      next();
    } catch (error) {
      next(error as Error);
    }
  };
};

// 3. TIMESTAMP MIDDLEWARE
const updateTimestamps = function (this: any, next: HookNextFunction) {
  this.set({ updatedAt: new Date() });
  next();
};

// ====================== HOOK REGISTRATION ======================

// Save hooks
productSchema.pre("save", createValidationMiddleware("save"));
productSchema.pre("save", createDiscountMiddleware("save"));

// Update hooks
productSchema.pre(
  ["updateOne", "findOneAndUpdate"],
  createValidationMiddleware("update")
);
productSchema.pre(
  ["updateOne", "findOneAndUpdate"],
  createDiscountMiddleware("update")
);
productSchema.pre(["updateOne", "findOneAndUpdate"], updateTimestamps);

// Create text index for search
productSchema.index({
  "basicInfo.name": "text",
  "basicInfo.description": "text",
  "basicInfo.shortDescription": "text",
  "featuresSection.keyFeatures": "text",
  "tags.tags": "text",
});

// Create the model
export const ProductModel =
  mongoose.models.Product ||
  mongoose.model<IProductDocument>("Product", productSchema);
