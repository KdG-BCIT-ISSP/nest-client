"use client";

import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import JotaiProvider from "./providers/JotaiProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <JotaiProvider>{children}</JotaiProvider>
    </I18nextProvider>
  );
}
