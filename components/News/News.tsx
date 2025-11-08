import Image from "next/image";
import Link from "next/link";

interface INewsArticle {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  category: string;
}

const mockNews: INewsArticle[] = [
  {
    id: 1,
    title: "Нові мовні курси в Амстердамі",
    excerpt: "Відкрита реєстрація на безкоштовні курси нідерландської...",
    imageUrl: "",
    date: "08.11.2025",
    category: "Освіта",
  },
  {
    id: 2,
    title: "Ярмарок вакансій для українців",
    excerpt: "Великі компанії Нідерландів шукають спеціалістів...",
    imageUrl: "",
    date: "07.11.2025",
    category: "Робота",
  },
  {
    id: 3,
    title: "Фестиваль української культури",
    excerpt: "У Гаазі відбудеться благодійний фестиваль...",
    imageUrl: "",
    date: "06.11.2025",
    category: "Події",
  },
];
export const NewsSection: React.FC = () => {
  return (
    <section id="news" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Останні Новини Спільноти
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockNews.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <Image
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-48 object-cover"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://placehold.co/400x300/eeeeee/222222?text=Помилка+зображення")
                }
              />
              <div className="p-6">
                <span className="text-sm font-semibold text-blue-600">
                  {article.category} • {article.date}
                </span>
                <h3 className="text-xl font-bold text-gray-900 my-2">
                  {article.title}
                </h3>
                <p className="text-gray-700 mb-4">{article.excerpt}</p>
                <a
                  href={`/news/${article.id}`}
                  className="font-semibold text-blue-600 hover:text-blue-800"
                >
                  Читати далі &rarr;
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/news"
            className="bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-300 transition-colors duration-300"
          >
            Переглянути всі новини
          </Link>
        </div>
      </div>
    </section>
  );
};
