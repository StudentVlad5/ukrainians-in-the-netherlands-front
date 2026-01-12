import Image from "next/image";
import Link from "next/link";
import hero_img from "@/helper/images/hero_img.webp";
import { useTranslations } from "next-intl";

export const Hero: React.FC = () => {
  const t = useTranslations("hero");
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white overflow-hidden">
      <Image
        src={hero_img}
        alt={t("Ukrainians and friends in the Netherlands")}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        onError={(e) =>
          (e.currentTarget.src =
            "https://placehold.co/1920x1080/0057b7/ffd700?text=Помилка+зображення")
        }
      />

      <div className="relative z-20 p-4 animate-fade-in-down flex justify-end flex-col items-center h-full w-full">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
          {t("Ukrainians in the Netherlands")}
        </h1>
        <p className="text-xl md:text-2xl mb-8 drop-shadow-md">{t("moto")}</p>
        <Link
          href="/masters"
          className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-300 transition-transform duration-300 hover:scale-105"
        >
          {t("Support")}
        </Link>
      </div>
    </section>
  );
};
