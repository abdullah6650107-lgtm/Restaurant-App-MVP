import React, { useEffect } from "react";
import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import { CartProvider, useCart } from "../context/CartContext";

const customerRoutes = [
  "menu",
  "food-detail",
  "cart",
  "checkout",
  "orders",
  "reservations",
  "order-tracking",
  "review",
];

function AppRouter() {
  const { theme, darkMode, authReady, user } = useCart();
  const segments = useSegments();
  const currentRoute = segments[0] || "index";

  useEffect(() => {
    if (!authReady) return;
    if (!user && !["index", "login"].includes(currentRoute)) {
      router.replace("/login");
      return;
    }
    if (user && ["login"].includes(currentRoute)) {
      router.replace(user.role === "manager" ? "/dashboard" : "/menu");
      return;
    }
    if (user && currentRoute === "dashboard" && user.role !== "manager") {
      router.replace("/menu");
      return;
    }
    if (user?.role === "manager" && customerRoutes.includes(currentRoute)) {
      router.replace("/dashboard");
    }
  }, [authReady, currentRoute, user]);

  if (!authReady && currentRoute !== "index") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.background }}>
        <Text style={{ color: theme.textMuted }}>Restoring your session…</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.panel },
          headerTintColor: theme.text,
          headerTitleStyle: { color: theme.text, fontSize: 16, fontWeight: "800" },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="menu" options={{ title: "Menu" }} />
        <Stack.Screen name="food-detail" options={{ title: "Food Details" }} />
        <Stack.Screen name="cart" options={{ title: "Cart" }} />
        <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
        <Stack.Screen name="orders" options={{ title: "Orders" }} />
        <Stack.Screen name="reservations" options={{ title: "Reservations" }} />
        <Stack.Screen name="order-tracking" options={{ title: "Order Tracking" }} />
        <Stack.Screen name="profile" options={{ title: "Profile" }} />
        <Stack.Screen name="review" options={{ title: "Reviews" }} />
        <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <CartProvider>
      <AppRouter />
    </CartProvider>
  );
}