export interface ITranslatableString {
  uk: string;
  nl: string;
  de: string;
  en: string;
}

export interface IProduct {
  _id: string;
  user: string;
  title: ITranslatableString;
  description: ITranslatableString;
  price: number;
  category: string;
  tags: string[];
  images: string[];
  status: "active" | "inactive";
  location: {
    city: string;
    postalCode?: string;
    address?: string;
  };
  condition: "new" | "used";
  createdAt: string;
  updatedAt: string;
}

export const defaultFormState: IProduct = {
  _id: "",
  user: "",
  title: { uk: "", nl: "", de: "", en: "" },
  description: { uk: "", nl: "", de: "", en: "" },
  price: 0,
  category: "",
  tags: [],
  images: [],
  status: "active",
  location: { city: "", postalCode: "", address: "" },
  condition: "new",
  createdAt: "",
  updatedAt: "",
};
