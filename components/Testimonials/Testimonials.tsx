import { QuoteIcon } from "../UI/Icons/icons";

interface ITestimonial {
  id: number;
  name: string;
  quote: string;
  service: string;
}

const mockTestimonials: ITestimonial[] = [
  {
    id: 1,
    name: "Kees J.",
    quote:
      "Замовляв торт у Марії. Це було неймовірно! Справжній смак дитинства моєї дружини.",
    service: "Домашній торт",
  },
  {
    id: 2,
    name: "Svitlana V.",
    quote:
      "Фотосесія в Олександра - це просто знахідка. Дуже професійно та комфортно.",
    service: "Фотосесія",
  },
  {
    id: 3,
    name: "Emma de V.",
    quote:
      "Якісний манікюр від Ірини. Дуже задоволена! Буду рекомендувати подругам.",
    service: "Манікюр",
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Що Кажуть Люди
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <QuoteIcon className="text-blue-600 w-10 h-10 mb-4" />
              <p className="text-gray-700 text-lg italic mb-6">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="flex items-center">
                <div className="ml-4">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">
                    Замовив: {testimonial.service}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
