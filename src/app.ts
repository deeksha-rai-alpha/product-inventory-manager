import { Product, DiscountedProduct } from "./models.js";
import {
  getAvailableProducts,
  applyDiscountToProducts,
  addProduct,
  deleteProduct,
  toggleStock,
  getTotalValue,
} from "./inventory.js";

let products: Product[] = [
  { id: 1, name: "Laptop", price: 55000, inStock: true, tags: ["electronics", "computer"] },
  { id: 2, name: "Mouse", price: 600, inStock: true, tags: ["accessory"] },
  { id: 3, name: "Keyboard", price: 1500, inStock: false, tags: ["accessory"] },
  { id: 4, name: "Monitor", price: 12000, inStock: true },
];

let showOnlyInStock: boolean = false;
let discountPercent: number | null = null;

const form = document.getElementById("product-form") as HTMLFormElement;
const nameInput = document.getElementById("name") as HTMLInputElement;
const priceInput = document.getElementById("price") as HTMLInputElement;
const stockInput = document.getElementById("inStock") as HTMLInputElement;
const tagsInput = document.getElementById("tags") as HTMLInputElement;
const discountInput = document.getElementById("discount") as HTMLInputElement;
const applyBtn = document.getElementById("apply-discount") as HTMLButtonElement;
const clearBtn = document.getElementById("clear-discount") as HTMLButtonElement;
const filterBtn = document.getElementById("toggle-filter") as HTMLButtonElement;
const tbody = document.getElementById("product-body") as HTMLTableSectionElement;
const summary = document.getElementById("summary") as HTMLParagraphElement;
const priceHeader = document.getElementById("discount-header") as HTMLTableCellElement;

function render(): void {
  const list: Product[] = showOnlyInStock ? getAvailableProducts(products) : products;
  const rows: (Product | DiscountedProduct)[] =
    discountPercent !== null ? applyDiscountToProducts(list, discountPercent) : list;

  priceHeader.style.display = discountPercent !== null ? "" : "none";
  tbody.innerHTML = "";

  rows.forEach((p) => {
    const tr = document.createElement("tr");
    const discounted = "discountedPrice" in p ? (p as DiscountedProduct) : null;
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.name}</td>
      <td>₹${p.price}</td>
      ${discounted ? `<td>₹${discounted.discountedPrice} (${discounted.discountPercent}% off)</td>` : ""}
      <td>${p.inStock ? "In Stock" : "Out of Stock"}</td>
      <td>${p.tags && p.tags.length ? p.tags.join(", ") : "-"}</td>
      <td>
        <button data-action="toggle" data-id="${p.id}">Toggle Stock</button>
        <button data-action="delete" data-id="${p.id}">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });

  summary.textContent = `Showing ${rows.length} of ${products.length} products | Total value: ₹${getTotalValue(list)}`;
  filterBtn.textContent = showOnlyInStock ? "Show All Products" : "Show Only In-Stock";
}

form.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  const name: string = nameInput.value.trim();
  const price: number = parseFloat(priceInput.value);
  const tags: string[] = tagsInput.value
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  if (name === "" || isNaN(price) || price < 0) {
    alert("Enter a valid name and price.");
    return;
  }
  products = addProduct(products, name, price, stockInput.checked, tags);
  form.reset();
  render();
});

tbody.addEventListener("click", (e: Event) => {
  const target = e.target as HTMLElement;
  const action = target.getAttribute("data-action");
  const id = Number(target.getAttribute("data-id"));
  if (action === "delete") products = deleteProduct(products, id);
  else if (action === "toggle") products = toggleStock(products, id);
  else return;
  render();
});

applyBtn.addEventListener("click", () => {
  const value: number = parseFloat(discountInput.value);
  if (isNaN(value) || value < 0 || value > 100) {
    alert("Enter a discount between 0 and 100.");
    return;
  }
  discountPercent = value;
  render();
});

clearBtn.addEventListener("click", () => {
  discountPercent = null;
  discountInput.value = "";
  render();
});

filterBtn.addEventListener("click", () => {
  showOnlyInStock = !showOnlyInStock;
  render();
});

render();
