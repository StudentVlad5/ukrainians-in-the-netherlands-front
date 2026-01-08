"use client";
import { useState, useMemo } from "react";
import { isSameDay, isSameWeek, isSameMonth, parseISO, format } from "date-fns";
import Image from "next/image";
import { IActiveEvent } from "@/helper/types/activeEvent";
import Link from "next/link";

const ActiveEvents = ({
  events,
  selectedDate,
  loading,
}: {
  events: IActiveEvent[];
  selectedDate: Date;
  loading: boolean;
}) => {
  const [filterType, setFilterType] = useState<"day" | "week" | "month">("day");

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
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-all
                ${
                  filterType === type
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {type === "day" ? "День" : type === "week" ? "Тиждень" : "Місяць"}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-500 font-medium">
          Знайдено: {filteredEvents.length}
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
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                €{event.price}
              </div>
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
                className="flex not-prose mt-4 w-full py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-black transition-colors justify-center items-center"
              >
                Детальніше
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && !loading && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400">
            На обраний період подій не заплановано
          </p>
        </div>
      )}
    </div>
  );
};

export default ActiveEvents;
