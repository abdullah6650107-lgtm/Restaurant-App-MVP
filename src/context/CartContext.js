import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

const CartContext = createContext();

export function CartProvider({ children }) {
  const systemTheme = useColorScheme();
  const [items, setItems] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [darkMode, setDarkMode] = useState(systemTheme === "dark");

  const theme = useMemo(
    () =>
      darkMode
        ? {
            background: "#121916",
            panel: "#1B2420",
            panelAlt: "#25302B",
            text: "#f8fafc",
            textMuted: "#B7C2BB",
            border: "#35423B",
            input: "#121916",
            accent: "#E47B5D",
            accentSoft: "#3B2B27",
            success: "#69B99A",
            danger: "#E87878",
          }
        : {
            background: "#F4F5F1",
            panel: "#ffffff",
            panelAlt: "#F7F8F5",
            text: "#202923",
            textMuted: "#68736C",
            border: "#DDE3DD",
            input: "#ffffff",
            accent: "#C8563F",
            accentSoft: "#FBEAE6",
            success: "#2F8064",
            danger: "#C94747",
          },
    [darkMode]
  );

  const toggleDarkMode = () => setDarkMode((current) => !current);

  const addItem = (product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
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
  };

  const updateQuantity = (productId, change) => {
    setItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.id !== productId) return item;

          const nextQuantity = item.quantity + change;
          return nextQuantity > 0 ? { ...item, quantity: nextQuantity } : null;
        })
        .filter(Boolean)
    );
  };

  const removeItem = (productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const placeOrder = (order) => {
    const newOrder = {
      id: Date.now(),
      status: "Confirmed",
      ...order,
      createdAt: new Date().toISOString(),
    };

    setOrderHistory((current) => [newOrder, ...current]);
  };

  const updateOrderStatus = (orderId, status) => {
    setOrderHistory((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const addReservation = (reservation) => {
    const newReservation = {
      id: Date.now(),
      status: "Confirmed",
      ...reservation,
      createdAt: new Date().toISOString(),
    };

    setReservations((current) => [newReservation, ...current]);
    return newReservation;
  };

  const cancelReservation = (reservationId) => {
    setReservations((current) =>
      current.filter((reservation) => reservation.id !== reservationId)
    );
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = {
    items,
    orderHistory,
    reservations,
    darkMode,
    theme,
    toggleDarkMode,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    placeOrder,
    updateOrderStatus,
    addReservation,
    cancelReservation,
    totalItems,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
