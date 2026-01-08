// import { MultilangString } from "./common";

// Інтерфейс для перекладних рядків (на основі вашої translatableStringSchema)
export interface ITranslatableString {
  uk: string;
  nl: string;
  de: string;
  en: string;
  [key: string]: string;
}

// Основний інтерфейс івенту
export interface IActiveEvent {
  _id: string;
  eventId: string;
  date: string;
  time: string;
  price: number;
  seats: number;
  booking: number;
  status: "active" | "archived";
  type: "online" | "location";
  location?: {
    city?: string;
    address?: string;
  };
  vacancies: number;
  specialist?: {
    imageUrl: string;
    name: ITranslatableString;
    specialty: ITranslatableString;
    description: ITranslatableString;
    rating: number;
  };
  parentEvent: {
    title: ITranslatableString;
    description: ITranslatableString;
    images: string[];
    duration: string;
    category: string;
    article_event: string;
  };
}
