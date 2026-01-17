"use client";
import { useState, useMemo } from "react";
import { isSameDay, isSameWeek, isSameMonth, parseISO, format } from "date-fns";
import Image from "next/image";
import { IActiveEvent } from "@/helper/types/activeEvent";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const ActiveEvents = ({
  events,
  selectedDate,
  loading,
}: {
  events: IActiveEvent[];
  selectedDate: Date;
  loading: boolean;
}) => {
  const [filterType, setFilterType] = useState<"day" | "week" | "month">(
    "month",
  );
  const t = useTranslations("events");
  const filteredEvents = useMemo(() => {
    return events.filter((event: IActiveEvent) => {
      const eventDate = parseISO(event.date);
      if (filterType === "day") return isSameDay(eventDate, selectedDate);
      if (filterType === "week")
        return isSameWeek(eventDate, selectedDate, { weekStartsOn: 1 });
      if (filterType === "month") return isSameMonth(eventDate, selectedDate);
      return false;
    });
  }, [events, selectedDate, filterType]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="inline-flex p-1 bg-gray-100 rounded-xl">
          {(["day", "week", "month"] as const).map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer hover:bg-nl-blue hover:text-white
                ${
                  filterType === type
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {type === "day"
                ? t("day")
                : type === "week"
                  ? t("week")
                  : t("month")}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-500 font-medium">
          {t("Found")}: {filteredEvents.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event: IActiveEvent) => (
          <div
            key={event._id}
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-48 w-full">
              <Image
                src={event.parentEvent.images[0] || "/placeholder-event.jpg"}
                alt="Event cover"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-4 right-4 z-10"
              >
                <div className="relative group overflow-hidden backdrop-blur-md bg-nl-red px-4 py-1.5 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-1.5 transition-all duration-300">
                  {/* Анімований значок Євро */}
                  <motion.span
                    animate={{
                      y: [0, -2, 0],
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="text-white font-black text-lg"
                  >
                    €
                  </motion.span>

                  {/* Ціна */}
                  <span className="text-white font-black text-2xl tracking-tighter">
                    {event.price > 0 ? event.price : "Free"}
                  </span>

                  {/* Ефект легкого блику при наведенні (проходить крізь кнопку) */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </motion.div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
                <span>{format(parseISO(event.date), "dd MMM")}</span>
                <span>•</span>
                <span>{event.time}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {event.parentEvent.title.en}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {event.parentEvent.description?.en ||
                  "No description available for this event."}
              </p>

              <Link
                href={`events/${event._id}`}
                className="flex not-prose mt-4 w-full py-3 bg-nl-blue text-white rounded-xl font-medium hover:bg-black transition-colors justify-center items-center"
              >
                {t("More details")}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && !loading && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400">
            {t("There are no events scheduled for the selected period")}
          </p>
        </div>
      )}
    </div>
  );
};

export default ActiveEvents;
