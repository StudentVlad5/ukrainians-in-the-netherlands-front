import Link from "next/link";

export const LegalStatus: React.FC = () => {
  return (
    <section id="status" className="py-16 md:py-24 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-red-600 font-semibold">Важливо</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 my-4">
            Ваш Статус: Навігація в Європі
          </h2>
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            Розуміння правового статусу є ключовим для вашої стабільності.
            Більшість українців у ЄС, включно з Нідерландами, перебувають під
            Директивою про Тимчасовий Захист (RTB в Нідерландах).
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link
              href="https://ind.nl/en/ukraine"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-blue-800 text-blue-800 font-bold py-3 px-6 rounded-lg hover:bg-blue-800 hover:text-white transition-all duration-300"
            >
              Офіційно: IND (NL)
            </Link>
            <Link
              href="https://www.rijksoverheid.nl/onderwerpen/opvang-vluchtelingen-uit-oekraine"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-gray-600 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-700 hover:text-white transition-all duration-300"
            >
              Rijksoverheid (NL)
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
