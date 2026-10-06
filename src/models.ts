export interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  tags?: string[];
}

export interface DiscountedProduct extends Product {
  discountPercent: number;
  discountedPrice: number;
}
