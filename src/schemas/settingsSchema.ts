import { z } from "zod";

// Hero Page
export const WebsiteSchema = z.object({
  logo: z.string().optional(),
  svg: z.string().optional(),
  isSvg: z.boolean().default(true).optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaData: z.string().optional(),
  metaTags: z.string().optional(),
});
export const HeroFloatingFeaturesSchema = z.object({
  label: z.string().min(1, "Label is required"),
  position: z.string().min(1, "Position is required"),
  icon: z.string().optional(),
});
export const HeroFeaturesSchema = z.object({
  label: z.string().min(1, "Label is required"),
});

export const HeroSectionScheme = z.object({
  floatingFeature: z.array(HeroFloatingFeaturesSchema),
  head: z.string().min(1, "Heading is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  features: z.array(HeroFeaturesSchema),
});
export const CompanyStatsScheme = z.object({
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const OurStorySectionSchema = z.object({
  titleDesc: z.string().min(1, "Title Description is required"),
  image: z.string().min(1, "Image is required"),
  description: z.string().min(1, "Description is required"),
  storyTeller: z.string().min(1, "Story teller is required"),
  position: z.string().min(1, "Position is required"),
  quote: z.string().min(1, "Quote is required"),
  isMissionView: z.boolean().default(false).optional(),
  missionDescription: z.string().optional(),
  companyStats: z.array(CompanyStatsScheme),
});

export const CitySchema = z.object({
  cityName: z.string().min(1, "City Name is required"),
  cityImage: z.string().min(1, "City Image is required"),
  atl: z.string().optional(),
});

export const WeWorkAcross = z.object({
  workAcross: z.string().min(1, "Work Across is required"),
  isWorkAcrossView: z.boolean().default(true).optional(),
  workAcrossCities: z.array(CitySchema).optional(),
});

export const SocialMediaSchema = z.object({
  icon: z.string().optional(),
  svg: z.string().optional(),
  url: z.string().optional(),
  isSvg: z.boolean().default(false).optional(),
});
export const QuickLikSchema = z.object({
  title: z.string().min(1, "Title is required"),
  link: z.string().min(1, "Link is required"),
});
export const TechnologySchema = z.object({
  title: z.string().min(1, "Title is required"),
  fileUrl: z.string().min(1, "File is required"),
});
export const ContactSchema = z.object({
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().min(1, "Email is required"),
});

export const WhyContactUs = z.object({
  label: z.string().min(1, "Label is required"),
});
export const FooterSchema = z.object({
  socialMedia: z.array(SocialMediaSchema).optional(),
  quickLinks: z.array(QuickLikSchema).optional(),
  technology: z.array(TechnologySchema).optional(),
  contactDetails: ContactSchema,
  whyContactUs: z.array(WhyContactUs).optional(),
});

// Main Product Schema - Modified for MongoDB
export const SettingsSchema = z.object({
  _id: z.string().optional(),
  websiteInfo: WebsiteSchema,
  heroSection: HeroSectionScheme,
  ourStorySection: OurStorySectionSchema,
  weWorkAcross: WeWorkAcross,
  footerSection: FooterSchema,
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

// Derived schemas

export const SettingsCreateSchema = SettingsSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export const SettingsUpdateSchema = SettingsSchema.partial().omit({
  _id: true,
  createdAt: true,
});

// TypeScript types
export type ISettings = z.infer<typeof SettingsSchema> & {
  id?: string;
};

export type IFloatingFeatures = z.infer<typeof HeroFloatingFeaturesSchema>;
export type IFeatures = z.infer<typeof HeroFeaturesSchema>;
export type IWebsiteInfo = z.infer<typeof WebsiteSchema>;
export type IHeroSection = z.infer<typeof HeroSectionScheme>;
export type ICompanyStats = z.infer<typeof CompanyStatsScheme>;
export type IOurStorySection = z.infer<typeof OurStorySectionSchema>;
export type ICity = z.infer<typeof CitySchema>;
export type IWeWorkAcrossSection = z.infer<typeof WeWorkAcross>;
export type ISocialMedia = z.infer<typeof SocialMediaSchema>;
export type IQuickLink = z.infer<typeof QuickLikSchema>;
export type ITechnology = z.infer<typeof TechnologySchema>;
export type IContact = z.infer<typeof ContactSchema>;
export type IWhyContactUs = z.infer<typeof WhyContactUs>;
export type IFooterSection = z.infer<typeof FooterSchema>;
export type ISettingsCreateInput = z.infer<typeof SettingsCreateSchema>;
export type ISettingsUpdateInput = z.infer<typeof SettingsUpdateSchema>;
export type SettingsFieldArrayPaths =
  | "heroSection.floatingFeature"
  | "heroSection.features"
  | "ourStorySection.companyStats"
  | "weWorkAcross.workAcrossCities"
  | "footerSection.socialMedia"
  | "footerSection.quickLinks"
  | "footerSection.technology"
  | "footerSection.whyContactUs";
