"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPublicNewsBySlug } from "@/helper/api/viewProductData";
import { INews } from "@/helper/types/news";
import { useLocale, useTranslations } from "next-intl";
import { Lang } from "@/helper/types/common";
import Image from "next/image";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";

export default function NewsDetail() {
  const { slug } = useParams();
  const locale = useLocale() as Lang;
  const t = useTranslations("news");

  const [article, setArticle] = useState<INews | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [getError, setGetError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const data = await getPublicNewsBySlug(slug as string);

        if (data) {
          setArticle(data);
          setGetError(false);
        } else {
          setGetError(true);
        }
      } catch (e) {
        console.error(e);
        setGetError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchNews();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="py-20 text-center min-h-screen">{t("loading")}...</div>
    );
  }

  if (getError || !article) {
    return (
      <div className="py-20 text-center text-red-500 min-h-screen">
        {t("Error loading news")}
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={article.imageUrl}
          alt={article.title[locale]}
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            <Link href="/news">
              <div className="flex items-center gap-2 text-white/80 hover:text-white mb-6 font-bold uppercase text-xs tracking-widest">
                <ArrowLeft size={16} /> {t("Back")}
              </div>
            </Link>

            <h1 className="text-4xl md:text-6xl font-black text-white">
              {article.title[locale]}
            </h1>

            <div className="flex items-center gap-4 mt-6 text-white/90">
              <Calendar size={18} />
              <span className="font-bold">
                {new Date(article.date).toLocaleDateString(locale)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <p className="text-xl font-bold text-slate-400 mb-10 italic border-l-4 border-blue-600 pl-6">
          {article.shortDescription[locale]}
        </p>

        <div className="space-y-12">
          {article.paragraphs.map((p, idx) => (
            <section key={idx} className="space-y-4">
              {p.title?.[locale] && (
                <h2 className="text-2xl font-black uppercase italic">
                  {p.title[locale]}
                </h2>
              )}
              <div className="text-lg leading-loose whitespace-pre-line">
                {p.body[locale]}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
