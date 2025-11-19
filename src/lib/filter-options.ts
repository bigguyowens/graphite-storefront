import type { Product } from "@/lib/products";

export const PRICE_OPTIONS = [
  { label: "All prices", value: "" },
  { label: "Under $100", value: "under-100", max: 100 },
  {
    label: "$100 – $150",
    value: "100-150",
    min: 100,
    max: 150,
  },
  { label: "Over $150", value: "over-150", min: 150 },
];

export function filterProductsByParams(
  products: Product[],
  category?: string | null,
  priceValue?: string | null,
) {
  return products.filter((product) => {
    const categoryMatch =
      !category || product.category === category;

    const priceOption = PRICE_OPTIONS.find(
      (option) => option.value === priceValue,
    );

    const priceMatch =
      !priceOption ||
      priceOption.value === "" ||
      ((priceOption.min === undefined ||
        product.price >= priceOption.min) &&
        (priceOption.max === undefined ||
          product.price <= priceOption.max));

    return categoryMatch && priceMatch;
  });
}
