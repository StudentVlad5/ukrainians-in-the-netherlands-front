import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

// Виправлена генерація метаданих
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return {
    title: t("title"),
    description: t("introduction"),
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PrivacyPolicy({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });

  return (
    <article className="max-w-4xl mx-auto py-16 px-6 sm:px-8 mt-20">
      <header className="mb-12 border-b pb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          {t("title")}
        </h1>
        <p className="text-sm text-gray-500 italic">{t("lastUpdated")}</p>
      </header>

      <div className="space-y-10 text-gray-700 leading-relaxed text-lg">
        <section>
          <p className="text-xl text-gray-600 mb-8 font-medium">
            {t("introduction")}
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-base">
              1
            </span>
            {t("sections.dataCollection")}
          </h2>
          <p>{t("dataCollectionText")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-base">
              2
            </span>
            {t("sections.cookies")}
          </h2>
          <p>{t("cookiesText")}</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-base">
              3
            </span>
            {t("sections.thirdParties")}
          </h2>
          <p>{t("thirdPartiesText")}</p>
        </section>
      </div>
    </article>
  );
}
