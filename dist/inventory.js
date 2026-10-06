export function calculateDiscount(price, discountPercent = 10) {
    return Number((price - (price * discountPercent) / 100).toFixed(2));
}
export function getAvailableProducts(products) {
    return products.filter((p) => p.inStock);
}
export function applyDiscountToProducts(products, discountPercent) {
    return products.map((p) => ({
        ...p,
        discountPercent,
        discountedPrice: calculateDiscount(p.price, discountPercent),
    }));
}
export function addProduct(products, name, price, inStock, tags) {
    const id = products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct = { id, name, price, inStock, tags };
    return [...products, newProduct];
}
export function deleteProduct(products, id) {
    return products.filter((p) => p.id !== id);
}
export function toggleStock(products, id) {
    return products.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p));
}
export function getTotalValue(products) {
    return products.reduce((sum, p) => sum + p.price, 0);
}
