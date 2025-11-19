'use client';

import { CartSummary } from "@/components/cart-summary";
import { QuantitySelector } from "@/components/quantity-selector";
import { useCart } from "@/context/cart-context";
import Image from "next/image";

export default function CartPage() {
  const { items, updateItemQuantity } = useCart();

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24 pt-12">
      <main className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[minmax(0,0.7fr)_minmax(260px,0.3fr)] lg:px-0">
        <section className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#838383]/70">
              Cart
            </p>
            <h1 className="text-4xl font-semibold text-[var(--color-foreground)]">
              Review your selections
            </h1>
          </div>
          <div className="space-y-4 rounded-[12px] border border-[var(--color-primary)]/20 bg-white p-6">
            {items.length === 0 ? (
              <p className="text-sm text-[#838383]/70">Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-[var(--color-primary)]/20 pb-4 last:border-none last:pb-0">
                  <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-slate-100">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-[var(--color-foreground)]">{item.name}</p>
                      <p className="text-sm font-semibold text-[var(--color-foreground)]">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: item.currency,
                        }).format(item.price * item.quantity)}
                      </p>
                    </div>
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(value) => updateItemQuantity(item.id, value)}
                      max={item.inventory}
                      size="sm"
                    />
                    <p className="text-xs text-[#838383]/70">In stock: {item.inventory}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        <div className="lg:sticky lg:top-24">
          <CartSummary />
        </div>
      </main>
    </div>
  );
}
