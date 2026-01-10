export interface ProductApi {
  _id: string;
  title: Record<string, string>;
  price: number;
  category: string;
  images: string[];
  location: {
    city: string;
  };
}

export interface ServiceApi {
  id: string;
  image: string;
  specialty: Record<string, string>;
  price: number;
  location: string;
}

export interface IMarketItem {
  id: string;
  type: "product" | "service";
  title: string;
  subtitle: string;
  imageUrl: string;
  price: number;
  location: string;
}

export interface MarketplaceCardProps {
  id: string;
  type: "product" | "service";
  title: string;
  subtitle: string;
  imageUrl: string;
  price: number;
  location: string;
}
