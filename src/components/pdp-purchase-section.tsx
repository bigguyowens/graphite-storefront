'use client';

import { useState } from "react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { QuantitySelector } from "@/components/quantity-selector";
import type { Product } from "@/lib/products";

type PdpPurchaseSectionProps = {
  product: Product;
  maxQuantity: number;
};

export function PdpPurchaseSection({
  product,
  maxQuantity,
}: PdpPurchaseSectionProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-4">
      <QuantitySelector
        value={quantity}
        onChange={setQuantity}
        max={maxQuantity}
      />
      <AddToCartButton
        product={product}
        quantity={quantity}
        className="w-full rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      />
    </div>
  );
}
