import { createSchema, createYoga } from "graphql-yoga";
import {
  getFeaturedProducts,
  getProductBySlug,
  getProducts,
  searchProducts,
} from "@/lib/products";

const { handleRequest } = createYoga({
  schema: createSchema({
    typeDefs: /* GraphQL */ `
      type Product {
        id: ID!
        name: String!
        slug: String!
        description: String!
        price: Float!
        currency: String!
        category: String!
        tags: [String!]!
        image: String!
        gallery: [String!]!
        rating: Float!
        ratingCount: Int!
        inventory: Int!
        featured: Boolean!
        brand: String!
        colors: [String!]!
      }

      type Query {
        products: [Product!]!
        featuredProducts: [Product!]!
        product(slug: String!): Product
        searchProducts(term: String!): [Product!]!
      }
    `,
    resolvers: {
      Query: {
        products: () => getProducts(),
        featuredProducts: () => getFeaturedProducts(),
        product: (
          _,
          args: { slug: string },
        ) => getProductBySlug(args.slug),
        searchProducts: (
          _,
          args: { term: string },
        ) => searchProducts(args.term),
      },
    },
  }),
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response, Request, Headers },
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  return handleRequest(request, {});
}

export async function POST(request: Request) {
  return handleRequest(request, {});
}
