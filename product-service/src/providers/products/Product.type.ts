export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  count: number
}

export type NewProduct = Omit<Product, 'id'>;
