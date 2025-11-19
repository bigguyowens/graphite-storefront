import { headers } from "next/headers";

type GraphQLParams = {
  query: string;
  variables?: Record<string, unknown>;
  revalidate?: number;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function fetchGraphQL<T>({
  query,
  variables,
  revalidate,
}: GraphQLParams) {
  let headerList: Headers | null = null;
  try {
    headerList = await headers();
  } catch {
    headerList = null;
  }

  const origin =
    headerList?.get("origin") ??
    headerList?.get("x-forwarded-host") ??
    undefined;
  const host = headerList?.get("host");
  const protocol =
    headerList?.get("x-forwarded-proto") ?? "http";

  const baseUrl =
    origin && origin.startsWith("http")
      ? origin
      : host
        ? `${protocol}://${host}`
        : process.env.NEXT_PUBLIC_SITE_URL ??
          "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: "no-store",
    next: revalidate
      ? { revalidate }
      : undefined,
  });

  if (!response.ok) {
    throw new Error("GraphQL request failed");
  }

  const payload: GraphQLResponse<T> =
    await response.json();

  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message);
  }

  if (!payload.data) {
    throw new Error("GraphQL response missing data");
  }

  return payload.data;
}
