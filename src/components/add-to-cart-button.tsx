'use client';

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/context/cart-context";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
  quantity?: number;
};

export function AddToCartButton({
  product,
  className,
  quantity = 1,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [status, setStatus] = useState<
    "idle" | "added"
  >("idle");

  return (
    <button
      type="button"
      className={`cursor-pointer ${className ?? ""}`.trim()}
      onClick={() => {
        addItem(product, quantity);
        setStatus("added");
        setTimeout(() => setStatus("idle"), 2000);
      }}
    >
      {status === "added" ? "Added ✓" : "Add to bag"}
    </button>
  );
}
