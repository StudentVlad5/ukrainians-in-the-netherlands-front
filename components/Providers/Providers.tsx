import Image from "next/image";
import Link from "next/link";

interface IProvider {
  id: number;
  name: string;
  specialty: string;
  imageUrl: string;
}

const mockProviders: IProvider[] = [
  {
    id: 1,
    name: "Марія К.",
    specialty: "Кондитер",
    imageUrl: "",
  },
  {
    id: 2,
    name: "Олександр П.",
    specialty: "Фотограф",
    imageUrl: "",
  },
  {
    id: 3,
    name: "Ірина С.",
    specialty: "Майстер манікюру",
    imageUrl: "",
  },
  {
    id: 4,
    name: "Тарас Г.",
    specialty: "Кераміст",
    imageUrl: "",
  },
  {
    id: 5,
    name: "Олена В.",
    specialty: "Майстриня",
    imageUrl: "",
  },
  {
    id: 6,
    name: "Віктор Л.",
    specialty: "Програміст",
    imageUrl: "",
  },
  {
    id: 7,
    name: "Анна Д.",
    specialty: "Перекладач",
    imageUrl: "",
  },
];
export const ProvidersSection: React.FC = () => {
  // Цей компонент створює ефект "біжучої стрічки" (marquee) за допомогою CSS
  // Це замінює Swiper, щоб уникнути зовнішніх бібліотек

  const duplicatedProviders = [...mockProviders, ...mockProviders]; // Дублюємо для безперервного циклу

  return (
    <>
      {" "}
      <style>{`
               /* Анімація для біжучої стрічки (заміна Swiper) */
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            /* Тут ми зсуваємо на половину ширини контейнера.
              (Кількість елементів * ширина)
            */
            transform: translateX(-${mockProviders.length * 12}rem);
          }
        }

        .animate-scroll-slow {
          animation: scroll 40s linear infinite;
        }
      `}</style>
      <section
        id="providers"
        className="py-16 md:py-24 bg-blue-50 text-gray-900 overflow-hidden"
      >
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Наші Майстри та Підприємці
          </h2>

          <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent_0,black_10%,black_90%,transparent_100%)]">
            <div
              className="flex animate-scroll-slow p-2"
              style={{ width: `${mockProviders.length * 2 * 12}rem` }}
            >
              {duplicatedProviders.map((provider, index) => (
                <Link
                  key={index}
                  href={`/provider/${provider.id}`}
                  className="flex flex-col items-center justify-center w-48 mx-4 shrink-0 group"
                >
                  <Image
                    src={provider.imageUrl}
                    alt={provider.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-900 border-b-red-700 transition-transform duration-300 group-hover:scale-110"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/100x100/eeeeee/222222?text=Помилка+зображення")
                    }
                  />
                  <h3 className="text-xl font-bold mt-3">{provider.name}</h3>
                  <p className="text-blue-600">{provider.specialty}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
