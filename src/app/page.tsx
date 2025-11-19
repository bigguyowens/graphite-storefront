import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { fetchGraphQL } from "@/lib/graphql-client";
import type { Product } from "@/lib/products";

const HOME_QUERY = /* GraphQL */ `
  query HomeProducts {
    featuredProducts {
      id
      name
      slug
      description
      price
      currency
      category
      tags
      image
      gallery
      rating
      ratingCount
      inventory
      featured
      brand
      colors
    }
    products {
      id
      name
      slug
      description
      price
      currency
      category
      tags
      image
      gallery
      rating
      ratingCount
      inventory
      featured
      brand
      colors
    }
  }
`;

type HomeQuery = {
  featuredProducts: Product[];
  products: Product[];
};

export default async function Home() {
  const { featuredProducts, products } =
    await fetchGraphQL<HomeQuery>({
      query: HOME_QUERY,
      revalidate: 300,
    });

  const heroProducts =
    featuredProducts.length > 0
      ? featuredProducts
      : products.slice(0, 3);

  const heroImage =
    "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1920&q=80";

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <section className="relative isolate flex min-h-[85vh] items-center overflow-hidden bg-[var(--color-accent)] text-white">
        <Image
          src={heroImage}
          alt="Graphite & Co. workspace"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-20 lg:flex-row lg:items-end lg:px-0">
          <div className="flex-1 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.5em] text-white/70">
              Graphite &amp; Co.
            </p>
            <h1 className="text-5xl font-semibold leading-tight md:text-6xl">
              Workspace staples for teams that get things done.
            </h1>
            <p className="max-w-2xl text-lg text-white/80">
              From sit-stand desks to connected lighting, Graphite &amp; Co. curates the equipment modern offices rely on. Every SKU lives inside MongoDB and stays in sync via GraphQL.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[var(--color-foreground)] transition hover:opacity-90"
              >
                Shop the catalog
              </Link>
              <Link
                href="/search"
                className="rounded-lg border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore search
              </Link>
            </div>
          </div>
          <div className="rounded-[12px] border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">
              Featured drop
            </p>
            <p className="mt-2 text-lg font-semibold">
              {heroProducts[0]?.name}
            </p>
            <p className="text-sm text-white/70">
              {heroProducts[0]?.description}
            </p>
          </div>
        </div>
      </section>
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-16 lg:px-0">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#838383]/70">
                Spotlight
              </p>
              <h2 className="mt-2 text-4xl font-semibold text-[var(--color-foreground)]">
                Three office staples on rotation
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden rounded-lg border border-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-foreground)] transition hover:bg-[var(--color-accent)] hover:text-white lg:inline-flex"
            >
              View catalog
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {heroProducts.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
        <section className="grid gap-10 rounded-[12px] border border-[var(--color-primary)]/20 bg-white p-8 md:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#838383]/70">
              Catalog
            </p>
            <h3 className="text-3xl font-semibold text-[var(--color-foreground)]">
              Modular desks, ergonomic seating, connected accessories
            </h3>
            <p className="text-base text-slate-600">
              Outfit every workstation in minutes. Adjustable desks, breathable task chairs, locking storage, and smart peripherals all live inside one schema so merchandising updates and PDPs stay perfectly aligned.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-500">
              <li>Shared GraphQL fragments powering PLP, PDP, hero, and search</li>
              <li>Pricing, inventory, and metadata synchronized from MongoDB</li>
              <li>Ready for quote workflows, bundles, and merchandising experiments</li>
            </ul>
          </div>
          <div className="relative min-h-[280px] overflow-hidden rounded-[12px]">
            <Image
              src={products[4]?.image ?? heroProducts[0]?.image ?? "/hero.jpg"}
              alt="Product exposition"
              fill
              className="object-cover"
            />
          </div>
        </section>
        <section className="grid gap-10 rounded-[12px] border border-[var(--color-primary)]/20 bg-white p-8 md:grid-cols-[0.9fr,1.1fr]">
          <div className="relative min-h-[280px] overflow-hidden rounded-[12px] order-last md:order-none">
            <Image
              src={products[5]?.image ?? heroProducts[1]?.image ?? "/hero.jpg"}
              alt="Company values"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#838383]/70">
              Company
            </p>
            <h3 className="text-3xl font-semibold text-[var(--color-foreground)]">
              Built for procurement and product teams alike
            </h3>
            <p className="text-base text-slate-600">
              Graphite &amp; Co. is more than a demo storefront. It’s a template for modern commerce stacks: Next.js App Router,
              Tailwind CSS 4, MongoDB for flexible data, and a GraphQL layer that feeds every surface—even search and merchandising tools.
            </p>
            <p className="text-sm text-slate-500">
              Use this repo as a blueprint for composable commerce so digital teams, merchandisers, and procurement all ship fast without compromising performance.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
