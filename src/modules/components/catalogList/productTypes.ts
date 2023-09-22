export interface ProductCardData {
  link: string;
  imageUrl: string;
  title: string;
  price: number;
  discount?: number;
  description: string;
  weight?: string;
  key: string;
  inCart?: boolean;
  quantity?: number;
}
