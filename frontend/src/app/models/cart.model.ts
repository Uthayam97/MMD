import { Product } from "./product.model";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  user: string;
  items: CartItem[];
}
