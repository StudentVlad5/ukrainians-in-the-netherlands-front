export interface IOrder {
  _id: string;
  orderNumber?: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  eventId?: {
    title?: { [key: string]: string };
    date?: string;
  };
}

export interface IOrdersResponse {
  total: number;
  page: number;
  limit: number;
  data: IOrder[];
}
