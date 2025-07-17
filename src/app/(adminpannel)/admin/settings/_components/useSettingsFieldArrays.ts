// hooks/useSettingsFieldArrays.ts
import { useFieldArray, Control } from "react-hook-form";
import { IFooterSection, IHeroSection, IOurStorySection, ISettings, IWeWorkAcrossSection } from "@/schemas/settingsSchema";


export const useHeroSectionFieldArrays = (control: Control<IHeroSection>) => {
  return {
    floatingFeatures: useFieldArray({
      control,
      name: "floatingFeature",
    }),
    features: useFieldArray({
      control,
      name: "features",
    }),
  };
};

export const useOurStoryFieldArrays = (control: Control<IOurStorySection>) => {
  return {
    companyStats: useFieldArray({
      control,
      name: "companyStats",
    }),
  };
};
export const useWeWorkAcrossFieldArrays = (control: Control<IWeWorkAcrossSection>) => {
  return {
    workAcrossCities: useFieldArray({
      control,
      name: "workAcrossCities",
    }),
  };
};
export const useFooterSectionFieldArrays = (control: Control<IFooterSection>) => {
  return {
    socialMedia: useFieldArray({
      control,
      name: "socialMedia",
    }),
    quickLinks: useFieldArray({
      control,
      name: "quickLinks",
    }),
    technologies: useFieldArray({
      control,
      name: "technology",
    }),
    whyContactUs: useFieldArray({
      control,
      name: "whyContactUs",
    }),
  };
};

export const useSettingsFieldArrays = (control: Control<ISettings>) => {
  const heroSection = {
    floatingFeatures: useFieldArray({
      control,
      name: "heroSection.floatingFeature",
    }),
    features: useFieldArray({
      control,
      name: "heroSection.features",
    }),
  };

  const ourStorySection = {
    companyStats: useFieldArray({
      control,
      name: "ourStorySection.companyStats",
    }),
  };

  const weWorkAcross = {
    workAcrossCities: useFieldArray({
      control,
      name: "weWorkAcross.workAcrossCities",
    }),
  };

  const footerSection = {
    socialMedia: useFieldArray({
      control,
      name: "footerSection.socialMedia",
    }),
    quickLinks: useFieldArray({
      control,
      name: "footerSection.quickLinks",
    }),
    technologies: useFieldArray({
      control,
      name: "footerSection.technology",
    }),
    whyContactUs: useFieldArray({
      control,
      name: "footerSection.whyContactUs",
    }),
  };

  return {
    heroSection,
    ourStorySection,
    weWorkAcross,
    footerSection,
  };
};