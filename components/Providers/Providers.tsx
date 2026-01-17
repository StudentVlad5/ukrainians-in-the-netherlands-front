"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Додаємо motion
import { getPublicSpecialistsWithLimits } from "@/helper/api/getPublicData";
import { ISpecialist } from "@/helper/types/specialist";
import { onFetchError } from "@/lib/Messages/NotifyMessages";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import defaultImage from "@/public/images/no-photo-available-icon.jpg";
import { Lang } from "@/helper/types/common";

export const ProvidersSection: React.FC = () => {
  const [providers, setProviders] = useState<ISpecialist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("providers");
  const locale = useLocale() as Lang;

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        const data = await getPublicSpecialistsWithLimits(20);
        if (Array.isArray(data.data)) {
          setProviders(data.data);
        }
      } catch (e) {
        console.error(e);
        onFetchError(t("Failed to load wizards"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchProviders();
  }, [t]);

  // Дублюємо масив для безкінечного ефекту
  const duplicatedProviders =
    providers.length > 0 ? [...providers, ...providers] : [];

  return (
    <section
      id="providers"
      className="pt-16 pb-4 bg-white text-gray-900 overflow-hidden"
    >
      <div className="container mx-auto">
        <Link href="/masters">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 hover:text-blue-600 transition">
            {t("Our Masters and Entrepreneurs")}
          </h2>
        </Link>

        <div className="relative w-full overflow-hidden">
          {/* Градієнтне затінення по боках (заміна mask-image) */}
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

          {isLoading ? (
            <div className="text-center py-20 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
          ) : (
            providers.length > 0 && (
              <motion.div
                className="flex gap-8 p-2"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  x: ["0%", "-50%"],
                }}
                transition={{
                  opacity: { duration: 0.5 },
                  x: {
                    ease: "linear",
                    duration: 40,
                    repeat: Infinity,
                  },
                }}
                style={{ width: "max-content" }}
              >
                {duplicatedProviders.map((provider, index) => (
                  <Link
                    key={`${provider._id}-${index}`} // Унікальний ключ надважливий
                    href={`/masters/${provider._id}`}
                    className="flex flex-col items-center justify-center w-48 shrink-0 group"
                  >
                    <div className="w-32 h-32 relative mb-3">
                      <Image
                        src={provider?.imageUrl || defaultImage}
                        alt={provider.name[locale] || "Master"}
                        fill
                        sizes="128px"
                        className="rounded-full object-cover border-4 border-blue-900 border-b-red-700 transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-center">
                      {provider.name[locale] || provider.name.uk}
                    </h3>
                    <p className="text-blue-600 capitalize text-center">
                      {provider.specialty[locale]}
                    </p>
                  </Link>
                ))}
              </motion.div>
            )
          )}
        </div>
      </div>

      <div className="text-center mt-12">
        <Link
          href="/masters"
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition inline-block"
        >
          {t("viewAll")}
        </Link>
      </div>
    </section>
  );
};
