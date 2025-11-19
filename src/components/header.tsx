'use client';

import Image from "next/image";
import Link from "next/link";
import { HeaderSearch } from "@/components/header-search";
import { useCart } from "@/context/cart-context";

const navLinks = [
  { href: "/products", label: "Shop" },
];

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-primary)]/30 bg-[var(--color-primary)] text-white">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4 lg:px-0">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-graphite.png?v=2"
            alt="Graphite Co."
            width={160}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-zinc-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden flex-1 justify-center md:flex">
          <HeaderSearch />
        </div>
        <Link
          href="/cart"
          className="ml-auto flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[var(--color-accent)] transition hover:opacity-90"
        >
          Cart
          <span className="rounded-md bg-[var(--color-accent)]/10 px-2 py-0.5 text-xs text-[var(--color-accent)]">
            {itemCount}
          </span>
        </Link>
      </div>
    </header>
  );
}
