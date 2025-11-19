import { FilterSidebar } from "@/components/filter-sidebar";
import { ProductCard } from "@/components/product-card";
import { fetchGraphQL } from "@/lib/graphql-client";
import { filterProductsByParams, PRICE_OPTIONS } from "@/lib/filter-options";
import { PRODUCTS_QUERY } from "@/lib/queries";
import type { Product } from "@/lib/products";

type ProductsResult = {
  products: Product[];
};

type ProductsPageProps = {
  searchParams: Promise<
    Record<string, string | string[] | undefined>
  >;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const normalizeParam = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

  const selectedCategory = normalizeParam(
    params.category,
  );
  const selectedPrice = normalizeParam(params.price);
  const priceOption = PRICE_OPTIONS.find(
    (option) => option.value === selectedPrice,
  );
  const priceLabel =
    priceOption && priceOption.value ? priceOption.label : undefined;

  const initialParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    const normalized = normalizeParam(value);
    if (normalized) {
      initialParams[key] = normalized;
    }
  });

  const { products } = await fetchGraphQL<ProductsResult>({
    query: PRODUCTS_QUERY,
    revalidate: 300,
  });

  const categories = products.map((product) => product.category);
  const filteredProducts = filterProductsByParams(
    products,
    selectedCategory,
    selectedPrice,
  );

  const heading = (() => {
    const priceText = priceLabel
      ? priceLabel.includes("–")
        ? `between ${priceLabel.replace("–", "and")}`
        : priceLabel.toLowerCase()
      : null;

    if (selectedCategory && priceText) {
      return `Shop all ${selectedCategory} ${priceText}`;
    }
    if (selectedCategory) {
      return `Shop all ${selectedCategory}`;
    }
    if (priceText) {
      return `Shop all products ${priceText}`;
    }
    return "Shop all products";
  })();

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24 pt-12">
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 lg:px-0">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-black/50">
            Product Listing
          </p>
          <h1 className="text-4xl font-semibold text-black">
            {heading}
          </h1>
        </div>
        <div className="grid gap-8 grid-cols-[minmax(220px,_0.25fr)_minmax(0,_0.75fr)]">
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            selectedPrice={selectedPrice}
            basePath="/products"
            initialParams={initialParams}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {filteredProducts.length === 0 ? (
              <p className="text-sm text-black/60">
                No products match the selected filters.
              </p>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
