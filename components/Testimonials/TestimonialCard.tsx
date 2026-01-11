import { ITestimonial } from "@/helper/types/testimonial";
import { QuoteIcon } from "../UI/Icons/icons";
import { useTranslations } from "next-intl";

export const TestimonialCard: React.FC<{ testimonial: ITestimonial }> = ({
  testimonial,
}) => {
  const t = useTranslations("testimonials");

  return (
    <div key={testimonial._id} className="bg-white p-8 rounded-lg shadow-lg">
      <QuoteIcon className="text-blue-600 w-10 h-10 mb-4" />
      <p className="text-gray-700 text-lg italic mb-6">
        &quot;{testimonial.quote}&quot;
      </p>
      <div className="flex items-center">
        <div className="ml-4">
          <p className="font-bold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-600">
            {t("Ordered")}: {testimonial.service}
          </p>
        </div>
      </div>
    </div>
  );
};
