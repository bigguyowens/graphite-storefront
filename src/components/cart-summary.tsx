'use client';

import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "@/context/cart-context";

const TAX_RATE = 0.07;
const SHIPPING_THRESHOLD = 100;
const SHIPPING_FEE = 9.99;

export function CartSummary() {
  const { items, itemCount } = useCart();

  const { subtotal, shipping, tax, total } = useMemo(() => {
    const subtotalValue = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const shippingValue =
      subtotalValue > 0 && subtotalValue < SHIPPING_THRESHOLD
        ? SHIPPING_FEE
        : 0;
    const taxValue = subtotalValue * TAX_RATE;
    return {
      subtotal: subtotalValue,
      shipping: shippingValue,
      tax: taxValue,
      total: subtotalValue + shippingValue + taxValue,
    };
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="rounded-[12px] border border-dashed border-[var(--color-primary)]/30 bg-white p-8 text-center text-[var(--color-primary)]">
        <p className="text-lg font-semibold text-[var(--color-foreground)]">
          Your bag is empty
        </p>
        <p className="mt-2 text-sm">
          Add products from the listing page to see them here.
        </p>
        <Link
          href="/products"
          className="mt-4 inline-flex rounded-lg bg-[var(--color-accent)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 rounded-[12px] border border-[var(--color-primary)]/20 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase tracking-[0.4em] text-[var(--color-primary)]/70">
          Cart
        </p>
        <p className="text-sm text-[var(--color-primary)]/70">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </div>
      <div className="space-y-2 text-sm text-[var(--color-foreground)]">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span>
            {shipping === 0
              ? "Free"
              : new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(shipping)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Tax (7%)</span>
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(tax)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--color-primary)]/20 pt-3 font-semibold">
          <span>Total</span>
          <span>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(total)}
          </span>
        </div>
      </div>
      <Link
        href="/checkout"
        className="inline-flex w-full justify-center rounded-lg bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Proceed to checkout
      </Link>
    </div>
  );
}
