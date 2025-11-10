import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// 1️⃣ Static imports
import uk from "./messages/uk.json";
import nl from "./messages/nl.json";
import de from "./messages/de.json";
import en from "./messages/en.json";

// 2️⃣ Define a type for your messages from one of the imports
type Messages = typeof uk;

export const locales = ["uk", "nl", "de", "en"];
export const defaultLocale = "uk";

// 3️⃣ Use Record<string, Messages> to type the map
const messagesMap: Record<string, Messages> = { uk, nl, de, en };

// 4️⃣ Export config
export default getRequestConfig(async ({ locale }) => {
  const finalLocale = locale ?? defaultLocale;

  // This check is now valid
  if (!messagesMap[finalLocale]) {
    notFound();
  }

  return {
    locale: finalLocale,
    messages: messagesMap[finalLocale],
  };
});
