"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { INews } from "@/helper/types/news";
import { getPublicNews } from "@/helper/api/viewProductData";
import { onFetchError } from "@/lib/Messages/NotifyMessages";
import NewsCard from "@/components/News/NewsCard";
import { Button } from "@/components/UI/Button/Button";
import { NewsCardSkeleton } from "@/components/News/NewsCardSkeleton";

export default function NewsPage() {
  const [news, setNews] = useState<INews[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const t = useTranslations("news");
  const limit = 10;

  const fetchNews = async (pageNum: number) => {
    try {
      setIsLoading(true);
      const response = await getPublicNews(pageNum, limit);

      if (response && response.news) {
        setNews((prev) =>
          pageNum === 1 ? response.news : [...prev, ...response.news]
        );
        setHasMore(pageNum < response.totalPages);
      }
    } catch (e) {
      onFetchError(t("Failed to load news"));
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage);
  };

  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-900 uppercase italic">
            {t("latest")}
          </h1>
          <div className="h-1.5 w-24 bg-ua-blue mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <NewsCard key={item._id} item={item} />
          ))}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <NewsCardSkeleton key={index} />
            ))}
          </div>
        )}

        {hasMore && !isLoading && (
          <div className="flex justify-center mt-12">
            <Button
              onClick={handleLoadMore}
              variant="secondary"
              className="px-8 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              {t("Show more")}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
