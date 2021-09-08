export interface Product {
  id: string;
  title: string;
  desciption?: string;
  price: number;
}

export type NewProduct = Omit<Product, 'id'>;
