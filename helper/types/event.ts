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
export interface IEvent {
  _id?: string;
  title: ITranslatableString;
  description: ITranslatableString;
  article_event: string;
  specialistId: string;
  duration: string;
  category: string;
  rating: number;
  images: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
