'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { QuantitySelector } from "@/components/quantity-selector";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const priceLabel = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency,
  }).format(product.price);
  const [quantity, setQuantity] = useState(1);

  return (
    <article className="flex flex-col rounded-[12px] border border-[var(--color-primary)]/20 bg-white transition hover:-translate-y-1 hover:shadow-2xl">
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-1 flex-col"
      >
        <div className="relative aspect-square overflow-hidden rounded-[12px]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 hover:scale-105"
            sizes="(min-width: 1024px) 25vw, 50vw"
            priority={product.featured}
          />
          {product.featured ? (
            <span className="absolute left-4 top-4 rounded-md bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Featured
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]/70">
              {product.category}
            </p>
            <p className="text-sm font-semibold text-[var(--color-foreground)]">
              {priceLabel}
            </p>
          </div>
          <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm text-slate-600">
            {product.description}
          </p>
          <div className="flex items-center justify-between text-xs text-[var(--color-primary)]/80">
            <span>
              Rating {product.rating.toFixed(1)} · {product.ratingCount} reviews
            </span>
            <span className="text-[var(--color-primary)]/70">
              {product.inventory} in stock
            </span>
          </div>
        </div>
      </Link>
      <div className="flex gap-2 px-5 pb-5 pt-0">
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          size="sm"
          max={product.inventory}
        />
        <AddToCartButton
          product={product}
          quantity={quantity}
          className="flex-1 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        />
      </div>
    </article>
  );
}
