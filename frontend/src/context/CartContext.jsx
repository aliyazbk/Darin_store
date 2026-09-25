import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getFinalPrice } from "../utils/productPricing";
export const CartContext = createContext(null);

function getInitialCart() {
  try {
    const savedCart = localStorage.getItem("darin-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(getInitialCart);

  useEffect(() => {
    localStorage.setItem("darin-cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, variant, quantity = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.variantId === variant.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.variantId === variant.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + quantity,
                  variant.stock_quantity
                ),
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          variantId: variant.id,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          size: variant.size,
          color: variant.color,
          price: getFinalPrice(product, variant),
          quantity,
          stockQuantity: variant.stock_quantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((variantId) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.variantId !== variantId
      )
    );
  }, []);

  const updateQuantity = useCallback((variantId, quantity) => {
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.variantId !== variantId) {
          return item;
        }

        return {
          ...item,
          quantity: Math.max(
            1,
            Math.min(quantity, item.stockQuantity)
          ),
        };
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [items]
  );

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}