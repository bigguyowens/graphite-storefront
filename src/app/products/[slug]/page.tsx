import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PdpPurchaseSection } from "@/components/pdp-purchase-section";
import { fetchGraphQL } from "@/lib/graphql-client";
import type { Product } from "@/lib/products";

const PRODUCT_QUERY = /* GraphQL */ `
  query Product($slug: String!) {
    product(slug: $slug) {
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

type ProductResult = {
  product: Product | null;
};

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const { product } = await fetchGraphQL<ProductResult>({
    query: PRODUCT_QUERY,
    variables: { slug },
    revalidate: 300,
  });

  if (!product) {
    notFound();
  }

  const priceLabel = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency,
  }).format(product.price);

  const maxQuantity = product.inventory;

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24 pt-12">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 lg:px-0">
        <Link
          href="/products"
          className="text-sm font-semibold text-black hover:underline"
        >
          Back to products
        </Link>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,0.35fr)]">
          <div className="space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-white">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 60vw, 100vw"
                priority
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.gallery.map((src) => (
                <div
                  key={src}
                  className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-white"
                >
                  <Image
                    src={src}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6 rounded-[12px] border border-black/5 bg-white p-8">
            <p className="text-xs uppercase tracking-[0.4em] text-black/50">
              {product.category}
            </p>
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold text-black">
                {product.name}
              </h1>
              <p className="text-lg text-slate-600">
                {product.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-semibold text-black">
                {priceLabel}
              </span>
              <span className="text-sm text-black/50">
                {product.inventory} in stock
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-black/70">
              <span className="rounded-lg bg-black px-4 py-1 text-white">
                {product.brand}
              </span>
              <span>{product.colors.join(" / ")}</span>
              <span>Rating: {product.rating.toFixed(1)}</span>
            </div>
            <PdpPurchaseSection
              product={product}
              maxQuantity={maxQuantity}
            />
            <div className="space-y-2 text-sm text-black/70">
              <p className="font-semibold text-black">Tags</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
