import mongoose, { Types } from "mongoose";
import { z } from "zod";

export const SlugParamsSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens",
  });

// ====================== Helper Schemas ======================
const ProductSpecificationSchema = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  icon: z.string().optional(),
});

const ProductFeatureSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

const ProductBenefitSchema = z.object({
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  color: z.string().optional(),
});

const ProductImageSchema = z.object({
  url: z
    .string()
    .min(1, "Image is required, or remove this field if not needed.")
    .optional(),
  altText: z.string().optional(),
  caption: z.string().optional(),
});

// ====================== Section Schemas ======================
export const ProductBasicInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  // category: z.string().optional(),
  // subcategory: z.string().optional(),
  brand: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().min(1, "Description is required"),
});

export const ProductMediaSchema = z.object({
  mainImage: z.string().min(1, "Main image is required"),
  images: z.array(ProductImageSchema),
  videoUrl: z.string().optional(),
});

export const ProductPricingSchema = z.object({
  price: z.number().min(0, "Price must be positive"),
  oldPrice: z.number().min(0).optional(),
  discountPercentage: z.number().min(0).max(100).optional(),
  hasDiscount: z.boolean().default(false),
  taxIncluded: z.boolean().default(false),
  costPrice: z.number().min(0).optional(),
});

export const ProductInventorySchema = z.object({
  inStock: z.boolean().default(true),
  stockQuantity: z.number().min(0).optional(),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
});

export const ProductFeaturesSchema = z.object({
  features: z.array(ProductFeatureSchema).optional(),
  keyFeatures: z.array(z.string().min(1, "Feature cannot be empty")).optional(),
  specifications: z.array(ProductSpecificationSchema).optional(),
  benefits: z.array(ProductBenefitSchema).optional(),
});

export const ProductTagsSchema = z.object({
  tags: z.array(z.string()).optional(),
});

export const ProductRatingsSchema = z.object({
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().min(0).default(0),
});

export const ProductWarrantySchema = z.object({
  warranty: z.string().min(1, "Warranty info is required"),
  warrantyDuration: z.string().optional(),
  supportInfo: z.string().optional(),
});

export const ProductFlagsSchema = z.object({
  isNewProduct: z.boolean(),
  isBanner: z.boolean(),
  isHighlighted: z.boolean(),
  isActive: z.boolean(),
});

export const ProductSeoSchema = z.object({
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const ProductResourcesSchema = z.object({
  installationGuideUrl: z.string().optional(),
  relatedProducts: z.array(z.string()).optional(),
});

// ====================== Main Product Schema ======================
export const ProductSchema = z.object({
  _id: z.instanceof(Types.ObjectId).or(z.string()).optional(),
  basicInfo: ProductBasicInfoSchema,
  media: ProductMediaSchema.optional(),
  pricing: ProductPricingSchema,
  inventory: ProductInventorySchema.optional(),
  featuresSection: ProductFeaturesSchema.optional(),
  tags: ProductTagsSchema.optional(),
  ratingsAndReview: ProductRatingsSchema.optional(),
  warranty: ProductWarrantySchema.optional(),
  flags: ProductFlagsSchema.optional(),
  seo: ProductSeoSchema.optional(),
  resources: ProductResourcesSchema.optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

// ====================== Derived Schemas ======================
export const ProductCreateSchema = ProductSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const ProductUpdateSchema = ProductSchema.partial().omit({
  _id: true,
  createdAt: true,
});

// ====================== TypeScript Types ======================
export type IProduct = z.infer<typeof ProductSchema> & {
  id?: string; // Frontend-compatible alias
};

export type ISlug = z.infer<typeof SlugParamsSchema>;
export type IProductSpecification = z.infer<typeof ProductSpecificationSchema>;
export type IProductFeature = z.infer<typeof ProductFeatureSchema>;
export type IProductBenefit = z.infer<typeof ProductBenefitSchema>;
export type IProductImage = z.infer<typeof ProductImageSchema>;
export type IProductCreateInput = z.infer<typeof ProductCreateSchema>;
export type IProductUpdateInput = z.infer<typeof ProductUpdateSchema>;

// Section types
export type IProductBasicInfo = z.infer<typeof ProductBasicInfoSchema>;
export type IProductMedia = z.infer<typeof ProductMediaSchema>;
export type IProductPricing = z.infer<typeof ProductPricingSchema>;
export type IProductInventory = z.infer<typeof ProductInventorySchema>;
export type IProductFeatures = z.infer<typeof ProductFeaturesSchema>;
export type IProductTags = z.infer<typeof ProductTagsSchema>;
export type IProductRatings = z.infer<typeof ProductRatingsSchema>;
export type IProductWarranty = z.infer<typeof ProductWarrantySchema>;
export type IProductFlags = z.infer<typeof ProductFlagsSchema>;
export type IProductSeo = z.infer<typeof ProductSeoSchema>;
export type IProductResources = z.infer<typeof ProductResourcesSchema>;

export type ProductSections = {
  basicInfo?: IProductBasicInfo;
  pricing?: IProductPricing;
  inventory?: IProductInventory;
  flags?: IProductFlags;
  media?: IProductMedia;
  featuresSection?: IProductFeatures;
  tags?: IProductTags;
  ratingsAndReview?: IProductRatings;
  warranty?: IProductWarranty;
  seo?: IProductSeo;
  resources?: IProductResources;
};
