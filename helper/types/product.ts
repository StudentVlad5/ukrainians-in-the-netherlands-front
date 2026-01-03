export interface IProduct {
  _id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  price: number | string;
  category: string | Record<string, string>; // Залежить від вашого бекенду
  tags?: string;
  location:
    | {
        city?: string;
        address?: string;
      }
    | string;
  deliveryOptions?:
    | {
        pickup: boolean;
        shipping: boolean;
      }
    | string;
  condition: "new" | "used";
  images: string[];
  status: string;
}

export interface ProductCardProps {
  product: IProduct;
}

export interface IProductsResponse {
  success: boolean;
  data: IProduct[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
