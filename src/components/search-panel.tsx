'use client';

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { GraphQLClient, gql } from "graphql-request";
import type { Product } from "@/lib/products";

const client = new GraphQLClient("/api/graphql");

const SEARCH_PRODUCTS = gql`
  query SearchProducts($term: String!) {
    searchProducts(term: $term) {
      id
      name
      slug
      price
      currency
      image
      category
    }
  }
`;

type SearchResult = Pick<
  Product,
  "id" | "name" | "slug" | "price" | "currency" | "image" | "category"
>;

type SearchResponse = {
  searchProducts: SearchResult[];
};

export function SearchPanel() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestCounter = useRef(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSearch = useCallback((value: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const sanitized = value.trim();
    if (!sanitized) {
      requestCounter.current += 1;
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const currentRequest = ++requestCounter.current;
    debounceRef.current = setTimeout(() => {
      client
        .request<SearchResponse>(SEARCH_PRODUCTS, {
          term: sanitized,
        })
        .then((data) => {
          if (currentRequest !== requestCounter.current) {
            return;
          }

          setResults(data.searchProducts);
          setError(null);
        })
        .catch(() => {
          if (currentRequest !== requestCounter.current) {
            return;
          }
          setError("Search failed. Please try again.");
        })
        .finally(() => {
          if (currentRequest === requestCounter.current) {
            setLoading(false);
          }
        });
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <section className="rounded-[12px] border border-black/5 bg-white p-6">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-black/50">
            Search the catalog
          </p>
          <h2 className="text-2xl font-semibold text-black">
            Find your next essential
          </h2>
        </div>
        <label className="relative flex items-center">
          <input
            type="search"
            value={term}
            onChange={(event) => {
              const value = event.target.value;
              setTerm(value);
              scheduleSearch(value);
            }}
            placeholder='Try "sneaker", "bag", or "studio"'
            className="w-full rounded-lg border border-black/10 bg-white px-5 py-3 text-sm outline-none transition focus:border-black"
          />
          <span className="absolute right-4 text-xs uppercase tracking-[0.4em] text-black/40">
            {loading ? "Searching..." : "Enter"}
          </span>
        </label>
        {error ? (
          <p className="text-sm text-rose-500">{error}</p>
        ) : null}
        <div className="divide-y divide-black/5">
          {results.length === 0 && term.trim() ? (
            <p className="py-6 text-sm text-slate-500">
              {loading
                ? "Looking for matches..."
                : "No products matched that search."}
            </p>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 py-4"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-black">
                    {product.name}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-black/50">
                    {product.category}
                  </p>
                </div>
                <p className="text-sm font-semibold text-black">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: product.currency,
                  }).format(product.price)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
