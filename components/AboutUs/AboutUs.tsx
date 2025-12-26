import Image from "next/image";
import Link from "next/link";
import about_us from "@/helper/images/about_us.webp";
import { useTranslations } from "next-intl";

export const AboutUs: React.FC = () => {
  const t = useTranslations("about");
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 text-center md:text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-blue-600 font-semibold">{t("About Us")}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 my-4">
              {t("Strength Born of Trials")}
            </h2>
            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              {t("part_1")}
            </p>
            <p className="text-gray-700 text-lg mb-4 leading-relaxed">
              {t("part_2")}
            </p>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              {t("part_3")}
            </p>
            <Link
              href="#contact"
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              {t("Contact us")}
            </Link>
          </div>
          <div className="flex justify-center">
            {/* Використовуйте тут фото, що символізує спільноту */}
            <Image
              src={about_us}
              alt={t("alt")}
              className="rounded-lg shadow-xl object-cover w-full max-w-md"
              onError={(e) =>
                (e.currentTarget.src =
                  "https://placehold.co/600x400/eeeeee/222222?text=Помилка+зображення")
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};
