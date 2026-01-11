import { getPublicNews } from "@/helper/api/viewProductData";
import { onFetchError } from "@/lib/Messages/NotifyMessages";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NewsCardSkeleton } from "./NewsCardSkeleton";
import { motion } from "framer-motion";
import { container } from "@/helper/CONST";
import NewsCard from "./NewsCard";
import { INewsArticle } from "@/helper/types/news";

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

        <motion.div
          layout
          key={isLoading ? "loading" : "loaded"} // Допомагає Framer Motion перезапустити анімацію
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <NewsCardSkeleton key={`skeleton-${i}`} />
            ))
          ) : getError ? (
            <div className="col-span-full text-center py-20 text-red-500">
              {t("Error loading data")}
            </div>
          ) : (
            news.map((article) => <NewsCard key={article._id} item={article} />)
          )}
        </motion.div>
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
