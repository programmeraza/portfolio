const dictionaries = {
  ru: () => import("./ru.json").then((module) => module.default),
  en: () => import("./en.json").then((module) => module.default),
  uz: () => import("./uz.json").then((module) => module.default),
  ja: () => import("./ja.json").then((module) => module.default),
  zh: () => import("./zh.json").then((module) => module.default),
  es: () => import("./es.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;
export const locales = Object.keys(dictionaries) as Locale[];
export const defaultLocale: Locale = "ru";

export const getDictionary = async (locale: Locale) => {
  if (!dictionaries[locale]) {
    return dictionaries[defaultLocale]();
  }
  return dictionaries[locale]();
};
