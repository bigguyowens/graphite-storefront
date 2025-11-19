## Next.js E‑Commerce Starter

Full-stack commerce starter featuring:

- Next.js App Router + Tailwind CSS 4 styling
- MongoDB product catalog with automatic sample data seeding
- GraphQL Yoga API (`/api/graphql`) used by the UI and live search
- Swipe-ready hero carousel powered by Swiper.js
- Client-side search panel with debounced GraphQL queries

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and provide your MongoDB connection string. If you deploy to a custom domain, update `NEXT_PUBLIC_SITE_URL` so server components can call the GraphQL endpoint.

```bash
cp .env.local.example .env.local
```

### 3. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the storefront. The first request will seed MongoDB with sample catalog entries when the database is reachable; otherwise the in-memory sample catalog is used.

### GraphQL Playground

Send queries to `http://localhost:3000/api/graphql`. Example:

```graphql
query Featured {
  featuredProducts {
    id
    name
    price
    category
  }
}
```

Use this endpoint for integrations or custom widgets—the UI already consumes it for the hero, catalog grid, and live search.
