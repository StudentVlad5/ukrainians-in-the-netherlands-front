"use client";
import { useEffect, useState } from "react";
import { getPublicActiveEvents } from "@/helper/api/getPublicData";
import { IActiveEvent } from "@/helper/types/activeEvent";
import Calendar from "@/components/ActiveEvents/calendar";
import ActiveEvents from "@/components/ActiveEvents/ActiveEvents";

const EventList = () => {
  const [events, setEvents] = useState<IActiveEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveEvents = async () => {
      try {
        const res = await getPublicActiveEvents(1, 10000, "active");
        setEvents(res?.data || res || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveEvents();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Ліва колонка: Календар */}
        <aside className="w-full lg:w-[400px] flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">
              Виберіть дату
            </h3>
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              events={events}
            />

            {/* Додаткова інфо-картка під календарем */}
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-blue-800 text-xs leading-relaxed">
                💡 Натисніть на дату з{" "}
                <span className="text-red-500 font-bold">червоною крапкою</span>
                , щоб побачити доступні події.
              </p>
            </div>
          </div>
        </aside>

        {/* Права колонка: Список подій */}
        <main className="flex-grow">
          <div className="mb-6">
            <h1 className="text-3xl font-black text-gray-900 mb-2 italic uppercase">
              Події
            </h1>
            <p className="text-gray-500 italic">
              Знайдіть ідеальний захід для себе
            </p>
          </div>
          <ActiveEvents
            events={events}
            selectedDate={selectedDate}
            loading={loading}
          />
        </main>
      </div>
    </div>
  );
};

export default EventList;
