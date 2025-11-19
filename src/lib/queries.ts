export const PRODUCT_FIELDS = `
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
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products {
    products {
${PRODUCT_FIELDS}
    }
  }
`;
