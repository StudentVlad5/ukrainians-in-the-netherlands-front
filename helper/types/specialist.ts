import { MultilangString } from "./common";

export interface ISpecialist {
  _id: string;
  isActive: boolean;
  name: MultilangString;
  specialty: MultilangString;
  education?: MultilangString;
  description?: MultilangString;
  imageUrl?: string;
  languages: string[];
  portfolio: string[];
  email?: string;
  phone?: string;
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
  rating?: string | number | undefined;
  minOrder?: string;
  author: string;
  location?: {
    address?: string;
    lat?: number;
    lng?: number;
  };
}
