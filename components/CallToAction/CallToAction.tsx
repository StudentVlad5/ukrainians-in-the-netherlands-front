import Link from "next/link";

export const CallToAction: React.FC = () => {
  return (
    <section id="cta" className="py-20 bg-yellow-400">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
          Долучайтеся до Спільноти!
        </h2>
        <p className="text-lg text-blue-800 mb-8 max-w-2xl mx-auto">
          Ви пропонуєте послуги, продаєте товари або організовуєте події?
          Розкажіть про себе нашій спільноті.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            href="/add-business"
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Додати свій бізнес
          </Link>
          <Link
            href="/events"
            className="bg-white text-blue-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-100 transition-colors duration-300 border-2 border-blue-900"
          >
            Знайти подію
          </Link>
        </div>
      </div>
    </section>
  );
};
