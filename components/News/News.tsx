import { getPublicNews } from "@/helper/api/viewProductData";
import { onFetchError } from "@/lib/Messages/NotifyMessages";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface INewsArticle {
  _id: string;
  slug: string;
  title: Record<string, string>;
  shortDescription: Record<string, string>;
  imageUrl: string;
  date: string;
  category: Record<string, string>;
}

export const NewsSection: React.FC = () => {
  const [news, setNews] = useState<INewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [getError, setGetError] = useState(false);

  const t = useTranslations("news");
  const locale = useLocale();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const data = await getPublicNews(1, 3);

        if (Array.isArray(data.news)) {
          setNews(data.news);
          setGetError(false);
        }
      } catch (e) {
        setGetError(true);
        onFetchError(t("Failed to load news"));
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [t]);

  return (
    <section id="news" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {t("latest")}
        </h2>

        {isLoading ? (
          <div className="text-center py-20">{t("loading")}...</div>
        ) : getError ? (
          <div className="text-center py-20 text-red-500">
            {t("Error loading data")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((article) => (
              <article
                key={article._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={article.imageUrl || "/placeholder.jpg"}
                    alt={article.title[locale]}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6">
                  <span className="text-sm font-semibold text-blue-600">
                    {article.category[locale]} • {article.date}
                  </span>

                  <h3 className="text-xl font-bold my-2">
                    {article.title[locale]}
                  </h3>

                  <p className="text-gray-700 mb-4">
                    {article.shortDescription[locale]}
                  </p>

                  <Link
                    href={`/news/${article.slug}`}
                    className="font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {t("readMore")} →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/news"
            className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-300 transition"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
};
