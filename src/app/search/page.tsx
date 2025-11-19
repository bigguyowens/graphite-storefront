import Link from "next/link";
import { FilterSidebar } from "@/components/filter-sidebar";
import { ProductCard } from "@/components/product-card";
import { fetchGraphQL } from "@/lib/graphql-client";
import { filterProductsByParams } from "@/lib/filter-options";
import { PRODUCT_FIELDS, PRODUCTS_QUERY } from "@/lib/queries";
import type { Product } from "@/lib/products";

const SEARCH_QUERY = /* GraphQL */ `
  query SearchProducts($term: String!) {
    searchProducts(term: $term) {
${PRODUCT_FIELDS}
    }
  }
`;

type SearchResult = {
  searchProducts: Product[];
};

type CatalogResult = {
  products: Product[];
};

type SearchPageProps = {
  searchParams: Promise<
    Record<string, string | string[] | undefined>
  >;
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;

  const normalizeParam = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

  const rawQuery = normalizeParam(params.q);
  const term = rawQuery?.trim() ?? "";
  const selectedCategory = normalizeParam(params.category);
  const selectedPrice = normalizeParam(params.price);

  const initialParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    const normalized = normalizeParam(value);
    if (normalized) {
      initialParams[key] = normalized;
    }
  });

  const [{ products: catalogProducts }, searchData] =
    await Promise.all([
      fetchGraphQL<CatalogResult>({
        query: PRODUCTS_QUERY,
        revalidate: 300,
      }),
      term
        ? fetchGraphQL<SearchResult>({
            query: SEARCH_QUERY,
            variables: { term },
            revalidate: 0,
          })
        : Promise.resolve({ searchProducts: [] }),
    ]);

  const categories = catalogProducts.map(
    (product) => product.category,
  );

  const searchResults = term
    ? filterProductsByParams(
        searchData.searchProducts,
        selectedCategory,
        selectedPrice,
      )
    : [];

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-24 pt-12">
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 lg:px-0">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-black/50">
            Search
          </p>
          <h1 className="text-4xl font-semibold text-black">
            {term ? `Results for “${term}”` : "Find gear fast"}
          </h1>
          <p className="text-sm text-slate-500">
            Powered by MongoDB + GraphQL. Filter by category or
            bucketed price once you start typing.
          </p>
        </div>
        <form
          className="flex flex-col gap-3 md:flex-row"
          action="/search"
          role="search"
        >
          <input
            type="search"
            name="q"
            defaultValue={term}
            placeholder='Try "sneaker", "bag", or "studio"'
            className="w-full rounded-lg border border-black/10 bg-white px-5 py-3 text-sm outline-none transition focus:border-black"
          />
          <button
            type="submit"
            className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Search
          </button>
        </form>
        <div className="grid gap-8 grid-cols-[minmax(220px,_0.25fr)_minmax(0,_0.75fr)]">
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            selectedPrice={selectedPrice}
            basePath="/search"
            initialParams={initialParams}
          />
          <div className="space-y-6">
            {term ? (
              searchResults.length ? (
                <>
                  <p className="text-sm text-black/60">
                    Showing {searchResults.length} result
                    {searchResults.length === 1 ? "" : "s"} for “
                    {term}”.
                  </p>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {searchResults.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-[12px] border border-black/5 bg-white p-10 text-center">
                  <p className="text-lg font-semibold text-black">
                    No matches for “{term}”
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Try another keyword or{" "}
                    <Link href="/products" className="underline">
                      browse the full catalog
                    </Link>
                    .
                  </p>
                </div>
              )
            ) : (
              <div className="rounded-[12px] border border-black/5 bg-white p-10 text-center text-sm text-slate-500">
                Start typing above to search the catalog.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
