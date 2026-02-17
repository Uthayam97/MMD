export type PaymentMethod = "card" | "upi" | "cod" | "netbanking";

export interface BillingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  _id: string;
  invoiceNumber: string;
  paymentMethod: PaymentMethod;
  billing: BillingDetails;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}
