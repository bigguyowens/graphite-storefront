import { randomUUID } from "node:crypto";
import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  tags: string[];
  image: string;
  gallery: string[];
  rating: number;
  ratingCount: number;
  inventory: number;
  featured: boolean;
  brand: string;
  colors: string[];
};

type ProductDocument = Product & {
  _id?: ObjectId;
};

const ADJECTIVES = [
  "Executive",
  "Graphite",
  "Foundry",
  "Atlas",
  "Union",
  "Summit",
  "Axis",
  "Slate",
  "Beacon",
  "Harbor",
];

const IMAGE_LIBRARY = [
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1560&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1560&q=80",
  "https://images.unsplash.com/photo-1596079890744-df4f2c1ff6f3?auto=format&fit=crop&w=1560&q=80",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1560&q=80",
  "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?auto=format&fit=crop&w=1560&q=80",
  "https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?auto=format&fit=crop&w=1560&q=80",
];

const PRODUCT_ARCHETYPES = [
  {
    baseName: "Ergo Task Chair",
    baseSlug: "ergo-task-chair",
    category: "Seating",
    description:
      "Adjustable lumbar support, breathable mesh, and seat depth tuning for all-day comfort.",
    tags: ["chair", "ergonomic", "office"],
    brand: "Graphite Studio",
    colors: ["Carbon", "Fog", "Cobalt"],
    basePrice: 329,
    image:
      "https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=1560&q=80",
  },
  {
    baseName: "Standing Desk",
    baseSlug: "standing-desk",
    category: "Desks",
    description:
      "Dual-motor adjustable desk with memory presets and cable passthrough channels.",
    tags: ["desk", "sit-stand", "workspace"],
    brand: "Union Works",
    colors: ["Walnut", "Birch", "Matte White"],
    basePrice: 489,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1560&q=80",
  },
  {
    baseName: "Mobile File Cabinet",
    baseSlug: "mobile-file-cabinet",
    category: "Storage",
    description:
      "Locking three-drawer steel cabinet with soft-close rails and casters.",
    tags: ["storage", "files", "organization"],
    brand: "Beacon Supply",
    colors: ["Graphite", "White", "Navy"],
    basePrice: 189,
    image:
      "https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?auto=format&fit=crop&w=1560&q=80",
  },
  {
    baseName: "Conference Keyboard",
    baseSlug: "conference-keyboard",
    category: "Accessories",
    description:
      "Full-size wireless keyboard with noise-dampened keys and multi-device pairing.",
    tags: ["keyboard", "wireless", "peripheral"],
    brand: "Slate Input",
    colors: ["Black", "Sandstone"],
    basePrice: 129,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1560&q=80",
  },
  {
    baseName: "Desk Lighting System",
    baseSlug: "desk-lamp",
    category: "Lighting",
    description:
      "LED task lamp with ambient glow, wireless charging base, and adaptive color temperature.",
    tags: ["lighting", "USB-C", "charger"],
    brand: "Foundry Light",
    colors: ["Matte Black", "Copper"],
    basePrice: 158,
    image:
      "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf?auto=format&fit=crop&w=1560&q=80",
  },
];

const VARIANTS_PER_ARCHETYPE = 6;

const SAMPLE_PRODUCTS: Product[] = PRODUCT_ARCHETYPES.flatMap(
  (archetype, archetypeIndex) =>
    Array.from({ length: VARIANTS_PER_ARCHETYPE }).map((_, variantIndex) => {
      const adjective =
        ADJECTIVES[(archetypeIndex + variantIndex) % ADJECTIVES.length];
      const name = `${adjective} ${archetype.baseName}`;
      const slug = `${archetype.baseSlug}-${variantIndex + 1}`;
      const image = archetype.image;

      return {
        id: slug,
        name,
        slug,
        description: archetype.description,
        price: Math.round(
          archetype.basePrice + variantIndex * 7 + archetypeIndex * 3,
        ),
        currency: "USD",
        category: archetype.category,
        tags: archetype.tags,
        image,
        gallery: [
          image,
          IMAGE_LIBRARY[(archetypeIndex + variantIndex + 1) % IMAGE_LIBRARY.length],
        ],
        rating: Number(
          (4.2 + ((archetypeIndex + variantIndex) % 6) * 0.1).toFixed(1),
        ),
        ratingCount: 120 + archetypeIndex * 40 + variantIndex * 12,
        inventory: 20 + variantIndex * 8,
        featured: variantIndex === 0,
        brand: archetype.brand,
        colors: archetype.colors,
      };
    }),
);

async function getProductCollection() {
  const db = await getDatabase();
  if (!db) {
    return null;
  }

  return db.collection<ProductDocument>("products");
}

function sanitizeProduct(doc: ProductDocument): Product {
  const { _id, ...rest } = doc;
  const fallback = rest.id ?? rest.slug;

  return {
    ...rest,
    id:
      typeof fallback === "string" && fallback.length
        ? fallback
        : _id?.toString() ?? randomUUID(),
  };
}

async function readProductsFromDatabase() {
  const collection = await getProductCollection();
  if (!collection) {
    return null;
  }

  try {
    const count = await collection.estimatedDocumentCount();
    if (count === 0) {
      await collection.insertMany(SAMPLE_PRODUCTS);
      return SAMPLE_PRODUCTS;
    }

    const docs = await collection.find().toArray();
    return docs.map(sanitizeProduct);
  } catch (error) {
    console.error("[mongo] Failed to read products", error);
    return null;
  }
}

export async function getProducts() {
  return (await readProductsFromDatabase()) ?? SAMPLE_PRODUCTS;
}

export async function getFeaturedProducts() {
  const products = await getProducts();
  return products.filter((product) => product.featured);
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return (
    products.find((product) => product.slug === slug) ??
    null
  );
}

export async function searchProducts(term: string) {
  const normalized = term.trim();
  if (!normalized) {
    return [];
  }

  const regex = new RegExp(
    normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "i",
  );

  const collection = await getProductCollection();
  if (collection) {
    try {
      const docs = await collection
        .find({
          $or: [
            { name: { $regex: regex } },
            { description: { $regex: regex } },
            { category: { $regex: regex } },
            { tags: { $elemMatch: { $regex: regex } } },
          ],
        })
        .limit(12)
        .toArray();

      return docs.map(sanitizeProduct);
    } catch (error) {
      console.error("[mongo] Search fallback", error);
    }
  }

  const products = await getProducts();
  return products
    .filter(
      (product) =>
        regex.test(product.name) ||
        regex.test(product.description) ||
        regex.test(product.category) ||
        product.tags.some((tag) => regex.test(tag)),
    )
    .slice(0, 12);
}
