export interface UserProfile {
  firstName: string;
  lastName: string;
  fullName: string; // З віртуального поля
  email: string;
  avatarUrl: string;
  city: string;
  phone: string;
  role: string;
  contact?: {
    website: string;
    linkedin: string;
    facebook: string;
  };
  status: string;
}

export type ActiveTab = "personal" | "edit" | "favorites" | "orders";
