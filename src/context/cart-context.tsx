'use client';

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
} from "react";
import type { Product } from "@/lib/products";

type CartItem = Product & { quantity: number };

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity: number }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "REMOVE_ITEM"; productId: string };

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  addItem: (product: Product, quantity?: number) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(
  null,
);

function cartReducer(
  state: CartState,
  action: CartAction,
): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.product.id,
      );

      if (existingIndex >= 0) {
        const updated = [...state.items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity:
            updated[existingIndex].quantity + action.quantity,
        };

        return { items: updated };
      }

      return {
        items: [
          ...state.items,
          { ...action.product, quantity: action.quantity },
        ],
      };
    }
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          items: state.items.filter(
            (item) => item.id !== action.productId,
          ),
        };
      }

      return {
        items: state.items.map((item) =>
          item.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item,
        ),
      };
    }
    case "REMOVE_ITEM": {
      return {
        items: state.items.filter(
          (item) => item.id !== action.productId,
        ),
      };
    }
    default:
      return state;
  }
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
  });

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      itemCount: state.items.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
      addItem: (product, quantity = 1) =>
        dispatch({ type: "ADD_ITEM", product, quantity }),
      updateItemQuantity: (productId, quantity) =>
        dispatch({
          type: "UPDATE_QUANTITY",
          productId,
          quantity,
        }),
    }),
    [state.items],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider",
    );
  }

  return context;
}
