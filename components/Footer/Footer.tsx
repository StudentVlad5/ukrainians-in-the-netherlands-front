import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-blue-100 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              <span className="text-blue-400">UA</span>
              <span className="text-yellow-400">in</span>
              <span className="text-red-500">NL</span>
            </h3>
            <p className="text-sm">
              Платформа для єднання, підтримки та розвитку української спільноти
              в Нідерландах.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Навігація</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="hover:text-yellow-400">
                  Про нас
                </a>
              </li>
              <li>
                <a href="#market" className="hover:text-yellow-400">
                  Ринок
                </a>
              </li>
              <li>
                <a href="#news" className="hover:text-yellow-400">
                  Новини
                </a>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-yellow-400">
                  Політика конфіденційності
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Корисні Посилання
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://ind.nl/en/ukraine"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400"
                >
                  IND
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.rijksoverheid.nl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400"
                >
                  Rijksoverheid
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.refugeehelp.nl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400"
                >
                  RefugeeHelp
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Слідкуйте за нами
            </h4>
            {/* Тут будуть іконки соцмереж */}
          </div>
        </div>
        <div className="border-t border-blue-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} UAinNL. Всі права захищено.</p>
          <p>З любов&apos;ю з України, в серці Нідерландів.</p>
        </div>
      </div>
    </footer>
  );
};
