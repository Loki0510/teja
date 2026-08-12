export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category: string;
  images: string[];
  sizes: string[] | null;
  in_stock: boolean;
  created_at: string;
};

export const CATEGORIES = [
  "Narayanpet",
  "Anarkalis",
  "Lehengas",
  "Kota Cotton",
  "Custom Orders",
] as const;

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string | null;
  size: string | null;
  quantity: number;
};
