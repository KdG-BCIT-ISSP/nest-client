import i18n from "i18next";
import HttpBackend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import { i18n as nextI18nConfig } from "./next-i18next.config";

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: nextI18nConfig.defaultLocale,
    supportedLngs: nextI18nConfig.locales,
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    ns: ["common", "post", "article", "dashboard"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
