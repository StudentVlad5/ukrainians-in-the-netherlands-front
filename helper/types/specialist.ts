import { MultilangString } from "./common";

export interface ISpecialist {
  _id?: string;
  isActive: boolean;

  name: MultilangString;
  specialty: MultilangString;
  education?: MultilangString;
  description?: MultilangString;

  imageUrl?: string;

  languages: string[];

  email?: string;
  phone?: string;
  instagram?: string;
  telegram?: string;
  whatsapp?: string;

  minOrder?: string;

  location?: {
    address?: string;
    lat?: number;
    lng?: number;
  };
}
