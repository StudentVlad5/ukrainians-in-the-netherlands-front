import { ITestimonial } from "@/helper/types/testimonial";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getPubliTestimonials } from "@/helper/api/getPublicData";
import { TestimonialCard } from "./TestimonialCard";
import { TestimonialsSceleton } from "./TestimonialSceleton";

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [getError, setGetError] = useState(false);

  const t = useTranslations("testimonials");

  useEffect(() => {
    const fetchTestemonials = async () => {
      setIsLoading(true);
      setGetError(false);
      try {
        const data = await getPubliTestimonials();
        if (data) setTestimonials(data);
      } catch (e) {
        console.log("Error fetching testimonials", e);
        setGetError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestemonials();
  }, []);

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          {t("What People Say")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            <TestimonialsSceleton />
          ) : getError ? (
            <div className="text-center py-20 text-red-500">
              {t("Error loading testimonials")}
            </div>
          ) : (
            testimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial._id}
                testimonial={testimonial}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};
