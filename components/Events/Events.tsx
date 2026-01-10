"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { getPublicActiveEvents } from "@/helper/api/getPublicData";
import { IActiveEvent } from "@/helper/types/activeEvent";
import { onFetchError } from "@/lib/Messages/NotifyMessages";
import EventCard from "./EventCard";
import { EventCardSkeleton } from "./EventCardSkeleton";

export const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<IActiveEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [getError, setGetError] = useState(false);

  const t = useTranslations("events");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await getPublicActiveEvents(1, 3);

        const data = response.data || response;
        if (Array.isArray(data)) {
          setEvents(data);
          setGetError(false);
        }
      } catch (e) {
        setGetError(true);
        onFetchError(t("failedToLoad"));
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [t]);

  return (
    <section id="events" className="py-16 md:py-24 bg-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-black text-center mb-12 text-slate-900">
          {t("latest")}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <EventCardSkeleton />
          </div>
        ) : getError ? (
          <div className="text-center py-20 text-red-500 font-bold">
            {t("errorLoading")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event._id} item={event} />
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            href="/events"
            className="inline-block bg-yellow-400 text-blue-900 font-black py-4 px-10 rounded-2xl text-lg hover:bg-yellow-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {t("viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
};
