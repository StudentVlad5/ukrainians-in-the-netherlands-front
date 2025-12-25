export interface Master {
  _id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  description: string;
  rating: number;
  education: string;
  languages: string[];
}

export interface MastersGridProps {
  filteredMasters: Master[];
}
