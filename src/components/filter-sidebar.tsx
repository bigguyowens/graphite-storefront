import Link from "next/link";
import { PRICE_OPTIONS } from "@/lib/filter-options";

type FilterSidebarProps = {
  categories: string[];
  selectedCategory?: string;
  selectedPrice?: string;
  basePath: string;
  initialParams?: Record<string, string>;
};

function buildHref(
  basePath: string,
  initial: Record<string, string>,
  updates: Record<string, string | undefined>,
) {
  const params = new URLSearchParams(initial);

  Object.entries(updates).forEach(([key, value]) => {
    if (value && value.length) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function FilterSidebar({
  categories,
  selectedCategory,
  selectedPrice,
  basePath,
  initialParams = {},
}: FilterSidebarProps) {
  const uniqueCategories = Array.from(new Set(categories)).sort();

  return (
    <aside className="flex flex-col gap-6 rounded-[12px] border border-black/5 bg-white p-6 md:sticky md:top-28 md:h-fit">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-black/50">
          Category
        </p>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          <Link
            href={buildHref(basePath, initialParams, {
              category: undefined,
            })}
            className={`transition hover:text-black ${
              !selectedCategory ? "font-semibold text-black" : "text-black/60"
            }`}
          >
            All
          </Link>
          {uniqueCategories.map((category) => (
            <Link
              key={category}
              href={buildHref(basePath, initialParams, {
                category,
              })}
              className={`transition hover:text-black ${
                selectedCategory === category
                  ? "font-semibold text-black"
                  : "text-black/60"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-black/50">
          Price
        </p>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          {PRICE_OPTIONS.map((option) => (
            <Link
              key={option.value || "all"}
              href={buildHref(basePath, initialParams, {
                price: option.value || undefined,
              })}
              className={`transition hover:text-black ${
                selectedPrice === option.value ||
                (!selectedPrice && option.value === "")
                  ? "font-semibold text-black"
                  : "text-black/60"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
