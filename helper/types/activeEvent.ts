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
  _id?: string;
  eventId: string;
  date: Date;
  time: string;
  price: number;
  seats: number;
  booking: number;
  vacancies: number;
  location: {
    city: string;
    address: string;
  };
  status: string;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}
