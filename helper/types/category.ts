// import { MultilangString } from "./common";

// Інтерфейс для перекладних рядків (на основі вашої translatableStringSchema)
export interface ITranslatableString {
  uk: string;
  nl: string;
  de: string;
  en: string;
  [key: string]: string;
}

// Основний інтерфейс категорії
export interface ICategory {
  _id?: string;
  title: ITranslatableString;
  createdAt?: Date;
  updatedAt?: Date;
}
