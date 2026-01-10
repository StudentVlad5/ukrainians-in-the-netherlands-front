import { useEffect, useMemo, useState } from "react";
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
  const [getError, setGetError] = useState(false);
  const t = useTranslations("providers");
  const locale = useLocale() as Lang;

  const duplicatedProviders = useMemo(
    () => [...providers, ...providers],
    [providers]
  );

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        const data = await getPublicSpecialistsWithLimits(20);

        if (Array.isArray(data)) {
          setProviders(data);
          setGetError(false);
        }
      } catch (e) {
        setGetError(true);
        console.log(e);
        onFetchError(t("Failed to load wizards"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [t]);

  return (
    <>
      {" "}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-${providers.length * 12}rem);
          }
        }

        .animate-scroll-slow {
          animation: scroll 40s linear infinite;
        }
      `}</style>
      <section
        id="providers"
        className="pt-16 pb-4 mt:py-24 bg-white text-gray-900 overflow-hidden"
      >
        <div className="container mx-auto">
          <Link href="/masters">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t("Our Masters and Entrepreneurs")}
            </h2>
          </Link>
          <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent_0,black_10%,black_90%,transparent_100%)]">
            {isLoading ? (
              <div className="text-center py-20">{t("loading")}</div>
            ) : getError ? (
              <div className="text-center py-20 text-red-500">
                {t("Error loading data")}
              </div>
            ) : (
              <div
                className="flex animate-scroll-slow p-2"
                style={{ width: `${providers.length * 2 * 12}rem` }}
              >
                {duplicatedProviders.map((provider, index) => (
                  <Link
                    key={index}
                    href={`/masters/${provider._id}`}
                    className="flex flex-col items-center justify-center w-48 mx-4 shrink-0 group"
                  >
                    <Image
                      src={provider?.imageUrl || defaultImage}
                      alt={provider.name[locale] || provider.name.uk}
                      width={120}
                      height={120}
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-900 border-b-red-700 transition-transform duration-300 group-hover:scale-110"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://placehold.co/100x100/eeeeee/222222?text=Помилка+зображення")
                      }
                    />
                    <h3 className="text-xl font-bold mt-3">
                      {provider.name[locale]}
                    </h3>
                    <p className="text-blue-600 capitalize">
                      {provider.specialty[locale]}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="text-center mt-12">
          <Link
            href="/masters"
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition"
          >
            {t("viewAll")}
          </Link>
        </div>
      </section>
    </>
  );
};
