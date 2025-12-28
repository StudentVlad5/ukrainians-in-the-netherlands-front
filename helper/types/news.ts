import { MultilangString } from "./common";

export interface INewsParagraph {
  title?: MultilangString;
  body: MultilangString;
}

export interface INews {
  _id?: string;
  slug: string;
  date: string;
  category: MultilangString;
  imageUrl: string;
  sourceUrl?: string;
  isActive: boolean;
  title: MultilangString;
  shortDescription: MultilangString;
  paragraphs: {
    title: MultilangString;
    body: MultilangString;
  }[];
}
