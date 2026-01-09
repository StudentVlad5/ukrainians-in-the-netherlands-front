"use client";

import { useState } from "react";
import { saveActiveEvent } from "@/helper/api/viewActiveEventsData";
import { IActiveEvent } from "@/helper/types/activeEvent";
import { IEvent } from "@/helper/types/event";
import { Input } from "@/components/UI/Input/Input";
import { Button } from "@/components/UI/Button/Button";

export const ActiveEventForm = ({
  baseEvents,
  activeEvent,
  token,
  onSaved,
}: {
  baseEvents: IEvent[];
  activeEvent: IActiveEvent | null;
  token: string | undefined;
  onSaved: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    eventId: activeEvent?.eventId || "",
    date: activeEvent?.date
      ? new Date(activeEvent.date).toISOString().split("T")[0]
      : "",
    time: activeEvent?.time || "",
    price: activeEvent?.price || 0,
    seats: activeEvent?.seats || 20,
    location: {
      city: activeEvent?.location?.city || "",
      address: activeEvent?.location?.address || "",
    },
    status: activeEvent?.status || "active",
    type: activeEvent?.type || "online",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Обробка дати: беремо дату і додаємо час для коректного збереження
      await saveActiveEvent(token, activeEvent?._id, form);
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold">Оберіть подію</label>
          <select
            title="eventId"
            className="border p-2 rounded"
            value={form.eventId}
            onChange={(e) => setForm({ ...form, eventId: e.target.value })}
            required
          >
            <option value="">-- Оберіть івент --</option>
            {baseEvents.map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.title.uk}
              </option>
            ))}
          </select>
        </div>

        <select
          id="status"
          title="select"
          className="border p-2 rounded"
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value as "active" | "archived",
            })
          }
        >
          <option value="active">Активний</option>
          <option value="archived">Архівний</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="date"
          label="Дата"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <Input
          id="time"
          label="Час (напр. 19:00)"
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="city"
          label="Місто"
          value={form.location.city}
          onChange={(e) =>
            setForm({
              ...form,
              location: { ...form.location, city: e.target.value },
            })
          }
          required
        />
        <Input
          id="address"
          label="Адреса"
          value={form.location.address}
          onChange={(e) =>
            setForm({
              ...form,
              location: { ...form.location, address: e.target.value },
            })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="seats"
          label="Кількість місць"
          type="number"
          value={form.seats}
          onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
          required
        />
        <Input
          id="price"
          label="Ціна (€)"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <select
          id="type"
          title="select"
          className="border p-2 rounded"
          value={form.type}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value as "location" | "online" })
          }
        >
          <option value="online">Онлайн</option>
          <option value="location">На локації</option>
        </select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Збереження..." : "Зберегти в календар"}
      </Button>
    </form>
  );
};
