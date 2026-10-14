import { useCallback, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_STORAGE_KEY = "restaurantapp.cart";

export function useCartItems() {
  const [items, setItems] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    async function restoreCart() {
      try {
        const storedItems = await AsyncStorage.getItem(CART_STORAGE_KEY);
        const parsedItems = storedItems ? JSON.parse(storedItems) : [];
        if (active && Array.isArray(parsedItems)) setItems(parsedItems);
      } catch {
        // Invalid local cache should not prevent the menu or account screens from opening.
      } finally {
        if (active) setIsHydrated(true);
      }
    }

    restoreCart();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)).catch(() => {
      // Persistence is best effort; the active session remains usable.
    });
  }, [isHydrated, items]);

  const addItem = useCallback((product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(99, item.quantity + 1) }
            : item
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          quantity: 1,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((productId, change) => {
    setItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.id !== productId) return item;

          const nextQuantity = Math.min(99, item.quantity + change);
          return nextQuantity > 0 ? { ...item, quantity: nextQuantity } : null;
        })
        .filter(Boolean)
    );
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return {
    items,
    setItems,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    subtotal,
  };
}
