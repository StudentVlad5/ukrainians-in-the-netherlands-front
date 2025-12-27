import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Header/Navbar";
import "@/app/globals.css";

// 1. Import ReactNode for typing children
import { ReactNode } from "react";
import PageTransitionWrapper from "@/components/UI/PageTransitionWrapper/PageTransitionWrapper";
import { Footer } from "@/components/Footer/Footer";

// 2. Define the prop types
type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;

  const titles: Record<string, string> = {
    uk: "Українська спільнота в Європі | Маркетплейс",
    en: "Ukrainian Community in Europe | Marketplace",
    nl: "Oekraïense gemeenschap in Europa | Marktplaats",
    de: "Ukrainische Community in Europa | Marktplatz",
  };

  const descriptions: Record<string, string> = {
    uk: "Новини, майстри, події, сервіси та товари для українців у Європі.",
    en: "News, specialists, events, services and marketplace for Ukrainians in Europe.",
    nl: "Nieuws, specialisten, evenementen en diensten voor Oekraïners in Europa.",
    de: "Nachrichten, Spezialisten, Events und Services für Ukrainer in Europa.",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: {
      canonical: `https://your-domain.com/${locale}`,
      languages: {
        uk: "https://your-domain.com/uk",
        en: "https://your-domain.com/en",
        nl: "https://your-domain.com/nl",
        de: "https://your-domain.com/de",
      },
    },
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `https://your-domain.com/${locale}`,
      siteName: "Ukrainian Community",
      locale,
      type: "website",
    },
  };
}
// 3. Apply types to props
export default async function LocaleLayout({ children, params }: Props) {
  // 4. Access 'locale' directly. 'await' is not needed for params.
  const { locale } = await params;
  let messages;

  try {
    messages = await getMessages({ locale });
  } catch (error) {
    console.error("i18n error:", error);
    notFound();
  }

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-gray-50 text-gray-900 flex justify-center flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar locale={locale} />
          <main>
            {" "}
            <PageTransitionWrapper>{children}</PageTransitionWrapper>
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
