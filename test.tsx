import React, { useState, useEffect, useRef } from "react";

// --- ІНТЕРФЕЙСИ TYPESCRIPT ---
// Використовуємо інтерфейси для типізації наших даних

// --- КОМПОНЕНТ LEGAL STATUS ---

// --- МOCK ДАНІ ДЛЯ ДЕМОНСТРАЦІЇ ---

// --- КОМПОНЕНТ PROVIDERS SECTION (SLIDER) ---

// --- КОМПОНЕНТ TESTIMONIALS SECTION ---

// --- КОМПОНЕНТ CALL TO ACTION ---

// --- КОМПОНЕНТ FOOTER ---

// --- ГОЛОВНИЙ КОМПОНЕНТ APP ---
const App: React.FC = () => {
  return (
    <>
      {/* Глобальні стилі та анімації
        Підключаємо Tailwind CSS та визначаємо кастомні анімації
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          scroll-behavior: smooth;
        }

        /* Анімація появи для Hero */
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-down {
          animation: fadeInDown 1s ease-out forwards;
        }

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

      {/* Підключення Tailwind CSS через CDN. 
        У реальному Next.js проекті це буде в global.css
      */}
      <script src="https://cdn.tailwindcss.com"></script>

      {/* Для SEO в Next.js, використовуйте компонент <Head> тут,
        щоб додати <title>, <meta description>, <meta keywords>
        та теги OpenGraph.
      */}

      <div className="bg-white text-gray-800">
        <Header />
        <main>
          <Hero />
          <AboutUs />
          <LegalStatus />
          <NewsSection />
          <MarketplaceSection />
          <ProvidersSection />
          <TestimonialsSection />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;
