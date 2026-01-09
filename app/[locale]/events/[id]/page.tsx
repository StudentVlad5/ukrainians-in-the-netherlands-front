"use client";
import { useLocale } from "next-intl";
import Image from "next/image";
import { format } from "date-fns";
import { IActiveEvent } from "@/helper/types/activeEvent";
import { useEffect, useState } from "react";
import { getPublicActiveEventsById } from "@/helper/api/getPublicData";
import { useParams } from "next/navigation";
import BookingModal from "@/components/UI/BookingModal/BookingModal";

const EventDetailPage = () => {
  // Змінюємо null для зручної перевірки
  const [eventData, setEventData] = useState<IActiveEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const locale = useLocale() as "uk" | "en" | "de" | "nl";
  const { id } = useParams();
  console.log("eventData", eventData);
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const res = await getPublicActiveEventsById(id as string);
        // Перевіряємо структуру відповіді вашого API
        setEventData(res?.data || res);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // 1. Стан завантаження
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        <p className="mt-4 text-gray-500 uppercase tracking-widest text-xs">
          Завантаження...
        </p>
      </div>
    );
  }

  // 2. Якщо даних немає після завантаження
  if (!eventData || !eventData.parentEvent) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <p className="text-gray-500">Подію не знайдено</p>
      </div>
    );
  }

  // Тепер деструктуризація безпечна
  const {
    parentEvent,
    specialist,
    vacancies,
    price,
    date,
    time,
    type,
    location,
  } = eventData;
  const isSoldOut = vacancies <= 0;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Ліва частина */}
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-black italic uppercase mb-6 leading-tight text-gray-900">
            {parentEvent.title[locale]}
          </h1>

          <div className="grid grid-cols-1 gap-4 mb-8">
            {parentEvent.images?.map((img: string, idx: number) => (
              <div
                key={idx}
                className="relative h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl"
              >
                <Image
                  src={img}
                  alt="Event"
                  fill
                  className="object-cover"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <h2 className="text-2xl font-black uppercase italic mb-4">
              Про захід
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {parentEvent.description[locale]}
            </p>
          </div>

          {/* Спеціаліст */}
          <div className="bg-white rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center border border-gray-100 shadow-sm">
            <div className="relative w-40 h-40 shrink-0 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
              <Image
                src={specialist?.imageUrl || "/placeholder-avatar.jpg"}
                alt="Specialist"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-red-500 text-xs font-black uppercase tracking-[0.2em] mb-2">
                Ведучий
              </p>
              <h3 className="text-3xl font-black italic uppercase mb-2">
                {specialist?.name[locale]}
              </h3>
              <p className="text-gray-500 font-bold mb-4 uppercase text-sm tracking-widest">
                {specialist?.specialty[locale]}
              </p>
              <p className="text-gray-600 italic leading-relaxed">
                {specialist?.description?.[locale]}
              </p>
            </div>
          </div>
        </div>

        {/* Права частина: Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-3xl border border-gray-100 shadow-2xl p-8">
            <div className="mb-8 border-b pb-6">
              <p className="text-xs font-black uppercase text-gray-400 mb-1 tracking-widest">
                Вартість участі
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">€{price}</span>
                <span className="text-gray-400 font-bold text-sm uppercase">
                  / особа
                </span>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="text-2xl">📅</div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Дата
                  </p>
                  <p className="font-bold">
                    {format(new Date(date), "dd MMMM yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">⏰</div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Час та тривалість
                  </p>
                  <p className="font-bold">
                    {time} ({parentEvent.duration})
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">📍</div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Локація
                  </p>
                  <p className="font-bold">
                    {type === "online"
                      ? "Online Stream"
                      : `${location?.city}, ${location?.address}`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">🎟️</div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                    Вільні місця
                  </p>
                  <p
                    className={`font-bold ${
                      vacancies < 5 ? "text-red-500" : "text-black"
                    }`}
                  >
                    {vacancies} квитків
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={isSoldOut}
              onClick={() => setIsModalOpen(true)}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl 
                ${
                  isSoldOut
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-black text-white hover:bg-gray-800 active:scale-95 shadow-black/20"
                }`}
            >
              {isSoldOut ? "Місць немає" : "Забронювати"}
            </button>
            {/* Модальне вікно */}
            {eventData && (
              <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                eventData={{
                  eventId: parentEvent?._id,
                  activeEventId: eventData._id,
                  price: price,
                  title: parentEvent.title[locale],
                }}
              />
            )}

            <p className="text-center text-[10px] font-bold text-gray-400 mt-6 uppercase tracking-wider">
              Гарантія безпечного бронювання
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EventDetailPage;
