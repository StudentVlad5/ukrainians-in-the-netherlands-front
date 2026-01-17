"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Mail,
  MessageCircle,
  Send,
  Languages,
  MapPin,
  Euro,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import defaultImage from "@/public/images/no-photo-available-icon.jpg";
import { useEffect, useState } from "react";
import { ISpecialist } from "@/helper/types/specialist";
import { getPublicSpecialistById } from "@/helper/api/getPublicData";
import { useParams } from "next/navigation";
import { onFetchError } from "@/lib/Messages/NotifyMessages";
import { useLocale, useTranslations } from "next-intl";
import { Lang } from "@/helper/types/common";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function MasterProfile() {
  const [master, setMaster] = useState<ISpecialist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [getError, setGetError] = useState(false);
  const { id } = useParams(); // Отримуємо id безпосередньо
  const locale = useLocale() as Lang;
  const [index, setIndex] = useState(-1);
  const slides = master?.portfolio?.map((src) => ({ src })) || [];
  const t = useTranslations("specialists");

  useEffect(() => {
    const fetchMaster = async () => {
      try {
        setIsLoading(true);
        const data = await getPublicSpecialistById(id as string);

        // Перевіряємо, чи отримали ми об'єкт
        if (data) {
          setMaster(data);
          setGetError(false);
        }
      } catch (e) {
        setGetError(true);
        console.error("error", e);
        onFetchError(t("Failed to load wizard data"));
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchMaster();
  }, [id, t]);

  if (isLoading)
    return (
      <div className="text-center py-20 min-h-screen">{t("Loading")}...</div>
    );
  if (getError || !master)
    return (
      <div className="text-center py-20 text-red-500 min-h-screen">
        {t("Error loading data")}
      </div>
    );

  return (
    <div className="min-h-screen bg-white pb-20 text-slate-900 mt-15">
      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        <Link
          href="/masters"
          className="flex items-center gap-2 text-nl-blue font-semibold hover:underline mb-8 transition-all w-fit"
        >
          <ArrowLeft size={20} />
          <span>{t("Back to the masters")}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ЛІВА КОЛОНКА */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="relative h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl ring-4 ring-gray-50">
              <Image
                src={master.imageUrl || defaultImage}
                alt={master.name[locale] || master.name.uk || "Master"}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
                className="object-cover"
              />
            </div>

            <div className="bg-ua-blue/5 rounded-3xl p-6 border border-ua-blue/10 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-ua-blue text-white rounded-2xl flex items-center justify-center shadow-lg shadow-ua-blue/20">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-ua-blue uppercase tracking-tight">
                    {t("Location")}
                  </p>
                  <p className="text-lg font-extrabold text-slate-900">
                    {master.location?.address || t("No address specified")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-nl-red text-white rounded-2xl flex items-center justify-center shadow-lg shadow-nl-red/20">
                  <Euro size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-nl-red uppercase tracking-tight">
                    {t("Order")}
                  </p>
                  <p className="text-lg font-extrabold text-slate-900">
                    {master.minOrder
                      ? `${t("From")} ${master.minOrder}€`
                      : t("The price is negotiable")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ПРАВА КОЛОНКА */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 space-y-8"
          >
            <div>
              <span className="bg-nl-red text-white px-5 py-1.5 rounded-full text-sm font-black uppercase tracking-widest shadow-md">
                {master.specialty[locale] || master.specialty.uk}
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-nl-blue mt-6 leading-tight">
                {master.name[locale] || master.name.uk}
              </h1>
            </div>

            {master.description && (
              <div className="bg-gray-50 p-8 rounded-4xl border-l-8 border-ua-blue">
                <p className="text-xl font-medium text-slate-800 leading-relaxed italic">
                  {master.description[locale] || master.description.uk}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-5 p-6 bg-white rounded-3xl shadow-sm border-2 border-gray-100 hover:border-ua-blue transition-colors">
                <div className="w-14 h-14 bg-ua-blue rounded-2xl flex items-center justify-center text-white shrink-0">
                  <Mail size={28} />
                </div>
                <div className="min-w-0">
                  <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                    Email
                  </h5>
                  <p className="text-lg font-bold text-ua-blue truncate">
                    {master.email || t("Not specified")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 p-6 bg-white rounded-3xl shadow-sm border-2 border-gray-100">
                <div className="flex items-center gap-2 text-nl-blue mb-2">
                  <Languages size={20} />
                  <span className="font-black uppercase text-xs tracking-widest text-slate-900">
                    {t("Languages")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {master.languages?.map((l) => (
                    <span
                      key={l}
                      className="bg-nl-blue text-white px-4 py-2 rounded-xl text-sm font-bold capitalize"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Месенджери */}
            <div className="flex flex-wrap gap-4 pt-4">
              {master.telegram && (
                <a
                  href={`https://t.me/${master.telegram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-3 py-4 bg-[#0088cc] text-white rounded-2xl font-black hover:scale-105 transition shadow-xl"
                >
                  <Send size={22} />
                  <span>TELEGRAM</span>
                </a>
              )}
              {master.whatsapp && (
                <a
                  href={`https://wa.me/${master.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[200px] flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white rounded-2xl font-black hover:scale-105 transition shadow-xl"
                >
                  <MessageCircle size={22} />
                  <span>WHATSAPP</span>
                </a>
              )}
            </div>

            {/* СЕКЦІЯ ПОРТФОЛІО */}
            {master?.portfolio && master.portfolio.length > 0 && (
              <div className="mt-12 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                    {t("My works")}
                  </h4>
                  <span className="text-slate-400 font-medium">
                    {master.portfolio.length} {t("Foto")}
                  </span>
                </div>

                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={20}
                  slidesPerView={1.2}
                  navigation
                  pagination={{ clickable: true }}
                  breakpoints={{
                    640: { slidesPerView: 2.2 },
                    1024: { slidesPerView: 3 },
                  }}
                  className="pb-12"
                >
                  {master.portfolio.map((url, idx) => (
                    <SwiperSlide key={idx}>
                      <motion.div
                        whileHover={{ y: -5 }}
                        onClick={() => setIndex(idx)}
                        className="relative h-72 rounded-4xl overflow-hidden cursor-zoom-in shadow-lg border-4 border-white"
                      >
                        <Image
                          src={url}
                          alt={`Portfolio ${idx}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority
                          className="object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Модальне вікно для перегляду */}
                <Lightbox
                  index={index}
                  open={index >= 0}
                  close={() => setIndex(-1)}
                  slides={slides}
                  plugins={[Zoom]} // Додаємо плагін зуму
                  zoom={{
                    maxZoomPixelRatio: 3, // Наскільки сильно можна збільшити
                    zoomInMultiplier: 2,
                    doubleTapDelay: 300,
                  }}
                  carousel={{
                    padding: "0px", // Прибираємо відступи повністю для максимального розміру
                  }}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
