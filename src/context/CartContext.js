import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { useCartItems } from "../hooks/useCartItems";
import { useFavorites } from "../hooks/useFavorites";
import { useOrders } from "../hooks/useOrders";
import { useReservations } from "../hooks/useReservations";
import { useTheme } from "../hooks/useTheme";
import { api } from "../api";

const CartContext = createContext();

export function CartProvider({ children }) {
  const cart = useCartItems();
  const favorites = useFavorites();
  const appearance = useTheme();
  const orders = useOrders();
  const reservations = useReservations();
  const { clearCart } = cart;
  const { setFavorites } = favorites;
  const {
    orderHistory,
    setOrderHistory,
    placeOrder: createOrder,
    updateOrderStatus: changeOrderStatus,
  } = orders;
  const {
    reservations: reservationHistory,
    setReservations,
    addReservation: createReservation,
    cancelReservation: removeReservation,
  } = reservations;

  const clearAccountData = useCallback(() => {
    setOrderHistory([]);
    setReservations([]);
  }, [setOrderHistory, setReservations]);

  const clearShoppingData = useCallback(() => {
    clearCart();
    setFavorites([]);
  }, [clearCart, setFavorites]);

  const loadAccountData = useCallback(async (sessionToken) => {
    const [ordersResponse, reservationsResponse] = await Promise.all([
      api.getOrders(sessionToken),
      api.getReservations(sessionToken),
    ]);
    setOrderHistory(ordersResponse.orders);
    setReservations(reservationsResponse.reservations);
  }, [setOrderHistory, setReservations]);

  const auth = useAuth({ loadAccountData, clearAccountData, clearShoppingData });

  const placeOrder = useCallback(
    (order) => createOrder(order, auth.token),
    [createOrder, auth.token]
  );
  const updateOrderStatus = useCallback(
    (orderId, status) => changeOrderStatus(orderId, status, auth.token),
    [changeOrderStatus, auth.token]
  );
  const addReservation = useCallback(
    (reservation) => createReservation(reservation, auth.token),
    [createReservation, auth.token]
  );
  const cancelReservation = useCallback(
    (reservationId) => removeReservation(reservationId, auth.token),
    [removeReservation, auth.token]
  );

  const value = useMemo(
    () => ({
      items: cart.items,
      favorites: favorites.favorites,
      orderHistory,
      reservations: reservationHistory,
      token: auth.token,
      user: auth.user,
      authReady: auth.authReady,
      darkMode: appearance.darkMode,
      theme: appearance.theme,
      toggleDarkMode: appearance.toggleDarkMode,
      addItem: cart.addItem,
      toggleFavorite: favorites.toggleFavorite,
      updateQuantity: cart.updateQuantity,
      removeItem: cart.removeItem,
      clearCart: cart.clearCart,
      placeOrder,
      updateOrderStatus,
      addReservation,
      cancelReservation,
      signIn: auth.signIn,
      signUp: auth.signUp,
      signOut: auth.signOut,
      loadAccountData,
      sessionError: auth.sessionError,
      totalItems: cart.totalItems,
      subtotal: cart.subtotal,
    }),
    [
      cart.items,
      cart.addItem,
      cart.updateQuantity,
      cart.removeItem,
      cart.clearCart,
      cart.totalItems,
      cart.subtotal,
      favorites.favorites,
      favorites.toggleFavorite,
      orderHistory,
      reservationHistory,
      auth.token,
      auth.user,
      auth.authReady,
      auth.signIn,
      auth.signUp,
      auth.signOut,
      auth.sessionError,
      appearance.darkMode,
      appearance.theme,
      appearance.toggleDarkMode,
      placeOrder,
      updateOrderStatus,
      addReservation,
      cancelReservation,
      loadAccountData,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
