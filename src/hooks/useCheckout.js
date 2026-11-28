import { useMemo, useState } from "react";

export function useCheckout({ items, subtotal, user, placeOrder, clearCart }) {
  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = useMemo(() => (items.length > 0 ? 120 : 0), [items]);
  const total = subtotal + deliveryFee;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const submitOrder = async () => {
    if (isSubmitting) return { status: "ignored" };
    if (!items.length) {
      return {
        status: "invalid",
        title: "Cart Empty",
        message: "Add some items before checkout.",
      };
    }

    if (!name.trim() || !address.trim()) {
      return {
        status: "invalid",
        title: "Delivery details needed",
        message: "Enter your name and delivery address to continue.",
      };
    }

    setIsSubmitting(true);
    try {
      await placeOrder({
        customerName: name.trim(),
        address: address.trim(),
        paymentMethod: "Cash on Delivery",
        items,
      });
      clearCart();
      return { status: "success" };
    } catch (error) {
      return { status: "error", message: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    setName,
    address,
    setAddress,
    isSubmitting,
    deliveryFee,
    total,
    itemCount,
    submitOrder,
  };
}
