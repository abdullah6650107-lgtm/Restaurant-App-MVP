import { useCallback, useState } from "react";
import { api } from "../data/api";

export function useOrders() {
  const [orderHistory, setOrderHistory] = useState([]);

  const placeOrder = useCallback(async (order, token) => {
    if (!token) throw new Error("Please log in before placing an order.");
    const { order: savedOrder } = await api.createOrder(order, token);
    setOrderHistory((current) => [savedOrder, ...current]);
    return savedOrder;
  }, []);

  const updateOrderStatus = useCallback(async (orderId, status, token) => {
    const { order } = await api.updateOrderStatus(orderId, status, token);
    setOrderHistory((current) =>
      current.map((entry) => (entry.id === order.id ? order : entry))
    );
  }, []);

  return { orderHistory, setOrderHistory, placeOrder, updateOrderStatus };
}
