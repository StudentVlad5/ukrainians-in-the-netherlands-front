import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
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
