"use client";
import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isSameWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { IconArrowLeft, IconArrowRight } from "@/helper/images/icon";
import { useLocale } from "next-intl";
import { enUS, uk, nl, de } from "date-fns/locale";
import { IActiveEvent } from "@/helper/types/activeEvent";

const Calendar = ({
  selectedDate,
  setSelectedDate,
  events = [],
}: {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  events: IActiveEvent[];
}) => {
  const [viewDate, setViewDate] = useState(new Date());
  const local = useLocale();
  const localeMap = { de, ua: uk, en: enUS, nl } as const;
  const locale = localeMap[local as keyof typeof localeMap] ?? uk;

  // Логіка генерації днів для повної сітки місяця
  const startMonth = startOfMonth(viewDate);
  const endMonth = endOfMonth(startMonth);
  const startDate = startOfWeek(startMonth, { weekStartsOn: 1 });
  const endDate = endOfWeek(endMonth, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="w-[360px] max-w-full mx-auto bg-white p-4 rounded-2xl border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-800 capitalize">
          {format(viewDate, "LLLL yyyy", { locale })}
        </h2>
        <div className="flex gap-1">
          <button
            title="Previous Month"
            type="button"
            onClick={() => setViewDate(subMonths(viewDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IconArrowLeft />
          </button>
          <button
            type="button"
            title="Next Month"
            onClick={() => setViewDate(addMonths(viewDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IconArrowRight />
          </button>
        </div>
      </div>

      {/* Назви днів тижня */}
      <div
        className="gap-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        }}
      >
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((d) => (
          <div
            key={d}
            className="h-8 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Сітка чисел */}
      <div
        className="gap-1"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
        }}
      >
        {days.map((day) => {
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, viewDate);
          const isToday = isSameDay(day, new Date());
          const isSameWeekAsSelected =
            selectedDate && isSameWeek(day, selectedDate, { weekStartsOn: 1 });
          const hasEvents = events?.some((e) =>
            isSameDay(new Date(e.date), day)
          );

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => setSelectedDate(day)}
              className={`relative h-12 flex items-center justify-center rounded-lg transition-all duration-200 ${
                !isCurrentMonth ? "text-gray-300" : "text-gray-800"
              } ${isSelected ? "bg-black text-white shadow-lg" : ""} ${
                isToday && !isSelected ? "border border-gray-900" : ""
              }${
                isSameWeekAsSelected && !isSelected ? "bg-gray-100" : ""
              } hover:bg-gray-200`}
            >
              <span className="text-sm font-semibold">{format(day, "d")}</span>

              {/* Маркер події */}
              {hasEvents && (
                <span
                  className={`absolute bottom-1 w-1 h-1 rounded-full ${
                    isSelected ? "bg-white" : "bg-red-500"
                  }`}
                />
              )}
            </button>
          );
        })}
        {/* </div> */}
      </div>
    </div>
  );
};
export default Calendar;
