import mongoose, { Document, Schema } from "mongoose";
import {
  IFloatingFeatures,
  IFeatures,
  IHeroSection,
  ICompanyStats,
  IOurStorySection,
  ICity,
  IWeWorkAcrossSection,
  ISocialMedia,
  IQuickLink,
  ITechnology,
  IContact,
  IWhyContactUs,
  IFooterSection,
  ISettings,
  IWebsiteInfo,
} from "@/schemas/settingsSchema"; // Import your existing Zod-derived types

// Convert Zod types to Mongoose schemas
const WebsiteInfoSchema = new Schema<IWebsiteInfo & Document>({
  logo: { type: String },
  svg: { type: String },
  isSvg: { type: Boolean, default: true },
  tagLine: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaData: { type: String },
  metaTags: { type: String },
});
const FloatingFeaturesSchema = new Schema<IFloatingFeatures & Document>({
  label: { type: String, required: true },
  position: { type: String, required: true },
  icon: { type: String },
});
const FeaturesSchema = new Schema<IFeatures & Document>({
  label: { type: String, required: true },
});

const CompanyStatsSchema = new Schema<ICompanyStats & Document>({
  label: { type: String, required: true },
  value: { type: String, required: true },
  icon: { type: String },
  color: { type: String },
});

const CitySchema = new Schema<ICity & Document>({
  cityName: { type: String, required: true },
  cityImage: { type: String, required: true },
  atl: { type: String },
});

const SocialMediaSchema = new Schema<ISocialMedia & Document>({
  icon: { type: String },
  svg: { type: String },
  url: { type: String },
  isSvg: { type: Boolean, default: false },
});

const QuickLinkSchema = new Schema<IQuickLink & Document>({
  title: { type: String, required: true },
  link: { type: String, required: true },
});

const TechnologySchema = new Schema<ITechnology & Document>({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
});

const ContactSchema = new Schema<IContact & Document>({
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
});
const WhyContactUsSchema = new Schema<IWhyContactUs & Document>({
  label: { type: String, required: true },
});

const HeroSectionSchema = new Schema<IHeroSection & Document>({
  floatingFeature: { type: [FloatingFeaturesSchema], required: true },
  head: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: { type: [FeaturesSchema] },
});

const OurStorySectionSchema = new Schema<IOurStorySection & Document>({
  titleDesc: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  storyTeller: { type: String, required: true },
  position: { type: String, required: true },
  quote: { type: String, required: true },
  isMissionView: { type: Boolean, default: false },
  missionDescription: { type: String },
  companyStats: { type: [CompanyStatsSchema], required: true },
});

const WeWorkAcrossSchema = new Schema<IWeWorkAcrossSection & Document>({
  workAcross: { type: String, required: true },
  isWorkAcrossView: { type: Boolean, default: true },
  workAcrossCities: { type: [CitySchema] },
});

const FooterSectionSchema = new Schema<IFooterSection & Document>({
  socialMedia: { type: [SocialMediaSchema] },
  quickLinks: { type: [QuickLinkSchema] },
  technology: { type: [TechnologySchema] },
  contactDetails: { type: ContactSchema, required: true },
  whyContactUs: { type: [WhyContactUsSchema] },
});

// Main Settings Schema
const SettingsSchema = new Schema<ISettings & Document>(
  {
    websiteInfo: { type: WebsiteInfoSchema, required: true },
    heroSection: { type: HeroSectionSchema, required: true },
    ourStorySection: { type: OurStorySectionSchema, required: true },
    weWorkAcross: { type: WeWorkAcrossSchema, required: true },
    footerSection: { type: FooterSectionSchema, required: true },
  },
  { timestamps: true }
);

export const SettingsModel =
  mongoose.models.Setting ||
  mongoose.model<ISettings & Document>("Setting", SettingsSchema);
