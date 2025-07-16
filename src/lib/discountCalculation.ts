import { IProductDocument } from "@/models/productModel";
import { UpdateQuery } from "mongoose";

export function hasPricingUpdates(
  update: UpdateQuery<IProductDocument>
): boolean {
  return !!(
    update.pricing ||
    update.$set?.pricing ||
    update.$set?.["pricing.price"] ||
    update.$set?.["pricing.oldPrice"]
  );
}
export async function getDocumentForUpdate(
  this: any
): Promise<IProductDocument | null> {
  if (this.model.findOne) {
    return this.model.findOne(this.getQuery());
  }
  return null;
}
// Helper Function
export function calculateUpdatedPricing(
  update: UpdateQuery<IProductDocument>,
  currentPricing: IProductDocument["pricing"]
): IProductDocument["pricing"] {
  // Handle direct pricing object updates
  if (update.pricing || update.$set?.pricing) {
    return {
      ...currentPricing,
      ...(update.pricing || {}),
      ...(update.$set?.pricing || {}),
    };
  }
  // Handle individual field updates
  return {
    ...currentPricing,
    price: update.$set?.["pricing.price"] ?? currentPricing.price,
    oldPrice: update.$set?.["pricing.oldPrice"] ?? currentPricing.oldPrice,
  };
}

export function applyPricingUpdates(
  update: UpdateQuery<IProductDocument>,
  newPricing: IProductDocument["pricing"]
): void {
  update.$set = update.$set || {};

  // Apply the full pricing object if it was a direct update
  if (update.pricing || update.$set?.pricing) {
    update.$set.pricing = newPricing;
  }
  // Otherwise apply individual fields
  else {
    if (update.$set?.["pricing.price"] !== undefined) {
      update.$set["pricing.price"] = newPricing.price;
    }
    if (update.$set?.["pricing.oldPrice"] !== undefined) {
      update.$set["pricing.oldPrice"] = newPricing.oldPrice;
    }
    update.$set["pricing.discountPercentage"] = newPricing.discountPercentage;
    update.$set["pricing.hasDiscount"] = newPricing.hasDiscount;
  }
}

export function calculateDiscount(pricing: {
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  hasDiscount?: boolean;
}) {
  if (pricing.oldPrice && pricing.price && pricing.oldPrice > pricing.price) {
    const discount =
      ((pricing.oldPrice - pricing.price) / pricing.oldPrice) * 100;
    pricing.discountPercentage = parseFloat(discount.toFixed(2));
    pricing.hasDiscount = true;
  } else {
    pricing.discountPercentage = undefined;
    pricing.hasDiscount = false;
  }
}
