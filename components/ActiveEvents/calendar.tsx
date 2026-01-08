"use client";

import { useCallback, useEffect, useState } from "react";
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  getWeek,
  addWeeks,
  subWeeks,
} from "date-fns";
import { IconArrowLeft, IconArrowRight } from "@/helper/images/icon";
import { CalendarProps } from "@/helper/types/calendar";
import { useLocale, useTranslations } from "next-intl";
import { enUS, uk, nl, de } from "date-fns/locale";

const Calendar = ({
  showDetailsHandle,
  currentWeek,
  setCurrentWeek,
  selectedDate,
  setSelectedDate,
  setState,
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate ?? new Date()
  );
  const [, setCurrentWeekNumber] = useState<number>(getWeek(currentMonth));

  const t = useTranslations("Calendar");

  const local = useLocale();

  const localeMap = {
    de,
    ua: uk,
    en: enUS,
    nl,
  } as const;
  const locale = localeMap[local as keyof typeof localeMap] ?? localeMap["ua"];

  const changeWeekHandle = (type: "prev" | "next") => {
    const newDate =
      type === "prev" ? subWeeks(currentMonth, 1) : addWeeks(currentMonth, 1);

    setCurrentMonth(newDate);
    setCurrentWeekNumber(getWeek(newDate));
    getCurrentWeekDates(newDate);
    setSelectedDate(null);
    setState(false);
  };

  const onDateClickHandle = (day: Date) => {
    const dayStr = format(day, "ccc dd MMM yy");
    setSelectedDate(day);
    showDetailsHandle(dayStr);
  };

  const getCurrentWeekDates = useCallback(
    (date: Date) => {
      const startWeek = startOfWeek(date, { weekStartsOn: 1 });
      const weekDates = Array.from({ length: 7 }, (_, i) =>
        format(addDays(startWeek, i), "ccc dd MMM yy")
      );

      localStorage.setItem("currentWeek", JSON.stringify(weekDates));

      const formatted = weekDates.map((d) => new Date(d).toLocaleDateString());

      if (JSON.stringify(formatted) !== JSON.stringify(currentWeek)) {
        setCurrentWeek(formatted);
      }
    },
    [currentWeek, setCurrentWeek]
  );

  useEffect(() => {
    getCurrentWeekDates(currentMonth);
  }, [currentMonth, getCurrentWeekDates]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Header */}
      <div className="mb-4 text-lg font-medium">
        {t(format(currentMonth, "LLLL yyyy", { locale }))}
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-4 mb-2 text-sm text-gray-400">
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i}>
            {format(
              addDays(startOfWeek(currentMonth, { weekStartsOn: 1 }), i),
              "EEE",
              { locale }
            )}
          </span>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, i) => {
          const day = addDays(
            startOfWeek(currentMonth, { weekStartsOn: 1 }),
            i
          );

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateClickHandle(day)}
              className={`
                h-10 w-10 rounded-full flex items-center justify-center
                transition
                ${isSameDay(day, new Date()) ? "border border-black" : ""}
                ${
                  selectedDate && isSameDay(day, selectedDate)
                    ? "bg-black text-white"
                    : "hover:bg-gray-200"
                }
              `}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex gap-6 mt-4">
        <button
          type="button"
          title="to left"
          onClick={() => changeWeekHandle("prev")}
        >
          <IconArrowLeft />
        </button>
        <button
          type="button"
          title="to right"
          onClick={() => changeWeekHandle("next")}
        >
          <IconArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Calendar;
