import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import "@/app/globals.css";

// 1. Import ReactNode for typing children
import { ReactNode } from "react";
import PageTransitionWrapper from "@/components/PageTransitionWrapper";

// 2. Define the prop types
type Props = {
  children: ReactNode;
  // 'params' is a regular object, not a promise.
  params: Promise<{ locale: string }>;
};

// 3. Apply types to props
export default async function LocaleLayout({ children, params }: Props) {
  // 4. Access 'locale' directly. 'await' is not needed for params.
  const { locale } = await params;
  let messages;

  try {
    // getMessages() implicitly uses the locale from the request
    messages = await getMessages({ locale });
  } catch (error) {
    console.error("i18n error:", error);
    notFound();
  }

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Navbar locale={locale} />
          <main>
            {" "}
            <PageTransitionWrapper>{children}</PageTransitionWrapper>
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
