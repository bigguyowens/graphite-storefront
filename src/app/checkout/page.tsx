'use client';

import Link from "next/link";
import { useMemo } from "react";
import Image from "next/image";
import { useCart } from "@/context/cart-context";

const TAX_RATE = 0.07;
const SHIPPING_THRESHOLD = 100;
const SHIPPING_FEE = 9.99;

export default function CheckoutPage() {
  const { items } = useCart();

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

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <main className="mx-auto grid max-w-6xl gap-8 px-6 pb-24 pt-12 lg:grid-cols-[minmax(0,0.75fr)_minmax(260px,0.25fr)] lg:px-0">
        <section className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#838383]/70">
              Checkout
            </p>
            <h1 className="text-4xl font-semibold text-[var(--color-foreground)]">
              Complete your order
            </h1>
            <p className="text-sm text-slate-500">
              Graphite &amp; Co. is ready for real payment and fulfillment flows. Wire up your provider here.
            </p>
          </div>
          <div className="space-y-4 rounded-[12px] border border-[var(--color-primary)]/20 bg-white p-8">
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              Contact information
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-lg border border-[var(--color-primary)]/30 px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]" placeholder="First name" />
              <input className="rounded-lg border border-[var(--color-primary)]/30 px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]" placeholder="Last name" />
              <input className="rounded-lg border border-[var(--color-primary)]/30 px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]" placeholder="Email" />
              <input className="rounded-lg border border-[var(--color-primary)]/30 px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]" placeholder="Phone" />
            </div>
          </div>
          <div className="space-y-4 rounded-[12px] border border-[var(--color-primary)]/20 bg-white p-8">
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              Shipping details
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input className="rounded-lg border border-[var(--color-primary)]/30 px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)] md:col-span-2" placeholder="Street address" />
              <input className="rounded-lg border border-[var(--color-primary)]/30 px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]" placeholder="City" />
              <input className="rounded-lg border border-[var(--color-primary)]/30 px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]" placeholder="State" />
              <input className="rounded-lg border border-[var(--color-primary)]/30 px-4 py-3 text-sm outline-none transition focus:border-[var(--color-accent)]" placeholder="Postal code" />
            </div>
          </div>
          <div className="space-y-4 rounded-[12px] border border-[var(--color-primary)]/20 bg-white p-8">
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">
              Payment
            </h2>
            <p className="text-sm text-slate-500">
              Wire this into your provider of choice. This template uses placeholders.
            </p>
          </div>
        </section>
        <aside className="rounded-[12px] border border-[var(--color-primary)]/20 bg-white p-6 lg:sticky lg:top-24">
          <h3 className="text-sm font-semibold uppercase tracking-[0.4em] text-[#838383]/70">
            Order summary
          </h3>
          <div className="mt-4 space-y-4">
            {items.length === 0 ? (
              <p className="text-sm text-[#838383]/70">Cart is empty.</p>
            ) : null}
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
                  {shipping === 0 ? "Free" : new Intl.NumberFormat("en-US", {
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
              href="/products"
              className="mt-4 inline-flex w-full justify-center rounded-lg bg-[var(--color-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Return to catalog
            </Link>
            {items.length > 0 ? (
              <div className="space-y-4 border-t border-[var(--color-primary)]/20 pt-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-slate-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-[var(--color-foreground)]">{item.name}</p>
                      <p className="text-[#838383]/70">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: item.currency,
                      }).format(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </aside>
      </main>
    </div>
  );
}
