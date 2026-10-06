import { Product, DiscountedProduct } from "./models.js";

export function calculateDiscount(price: number, discountPercent: number = 10): number {
  return Number((price - (price * discountPercent) / 100).toFixed(2));
}

export function getAvailableProducts(products: Product[]): Product[] {
  return products.filter((p) => p.inStock);
}

export function applyDiscountToProducts(
  products: Product[],
  discountPercent: number
): DiscountedProduct[] {
  return products.map((p) => ({
    ...p,
    discountPercent,
    discountedPrice: calculateDiscount(p.price, discountPercent),
  }));
}

export function addProduct(
  products: Product[],
  name: string,
  price: number,
  inStock: boolean,
  tags: string[]
): Product[] {
  const id: number = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
  const newProduct: Product = { id, name, price, inStock, tags };
  return [...products, newProduct];
}

export function deleteProduct(products: Product[], id: number): Product[] {
  return products.filter((p) => p.id !== id);
}

export function toggleStock(products: Product[], id: number): Product[] {
  return products.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p));
}

export function getTotalValue(products: Product[]): number {
  return products.reduce((sum, p) => sum + p.price, 0);
}
