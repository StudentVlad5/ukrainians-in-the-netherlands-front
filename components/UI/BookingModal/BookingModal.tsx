import { creatPublicOrder } from "@/helper/api/getPublicData";
import React, { useState } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: {
    eventId: string;
    activeEventId: string;
    price: number;
    title: string;
  };
}

const BookingModal = ({ isOpen, onClose, eventData }: BookingModalProps) => {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    bookingSeats: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      eventId: eventData.eventId,
      activeEventID: eventData.activeEventId,
      userName: formData.userName,
      userEmail: formData.userEmail,
      bookingSeats: formData.bookingSeats,
      priceTotal: formData.bookingSeats * eventData.price,
    };

    try {
      const response = await creatPublicOrder(orderData);

      if (response || response.ok) {
        alert("Бронювання успішне!");
        onClose();
      }
    } catch (error) {
      console.error("Помилка:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black text-2xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-black uppercase italic mb-2">
          Бронювання
        </h2>
        <p className="text-gray-500 text-sm mb-6 uppercase tracking-widest font-bold">
          {eventData.title}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="userName"
              className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1"
            >
              Ваше Імя
            </label>
            <input
              required
              id="userName"
              minLength={2}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-black outline-none transition-all"
              type="text"
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1"
            >
              Email
            </label>
            <input
              title="Please enter a valid email address"
              required
              id="email"
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-black outline-none transition-all"
              type="email"
              value={formData.userEmail}
              onChange={(e) =>
                setFormData({ ...formData, userEmail: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="bookingSeats"
              className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-1"
            >
              Кількість місць
            </label>
            <input
              title="Please enter a count of a seats"
              required
              id="bookingSeats"
              min={1}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 focus:border-black outline-none transition-all"
              type="number"
              value={formData.bookingSeats}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bookingSeats: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="pt-4 border-t mt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold uppercase text-xs text-gray-400">
                Разом до сплати:
              </span>
              <span className="text-2xl font-black">
                €{formData.bookingSeats * eventData.price}
              </span>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full py-4 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all disabled:bg-gray-300"
              type="submit"
            >
              {isSubmitting ? "Оформлення..." : "Підтвердити замовлення"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
