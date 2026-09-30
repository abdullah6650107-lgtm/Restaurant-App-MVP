import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import MenuScreen from "../screens/MenuScreen";
import DashboardScreen from "../screens/DashboardScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrdersScreen from "../screens/OrdersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import OrderTrackingScreen from "../screens/OrderTrackingScreen";
import FoodDetailScreen from "../screens/FoodDetailScreen";
import ReviewScreen from "../screens/ReviewScreen";
import ReservationScreen from "../screens/ReservationScreen";
import { useCart } from "../context/CartContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { theme } = useCart();

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerStyle: { backgroundColor: theme.panel },
        headerTintColor: theme.text,
        headerTitleStyle: { color: theme.text, fontSize: 16, fontWeight: "800" },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",
        contentStyle: { backgroundColor: theme.background },
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Menu"
        component={MenuScreen}
        options={{ title: "Menu" }}
      />

      <Stack.Screen
        name="FoodDetail"
        component={FoodDetailScreen}
        options={{ title: "Food Details" }}
      />

      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: "Cart" }}
      />

      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: "Checkout" }}
      />

      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: "Orders" }}
      />

      <Stack.Screen
        name="Reservations"
        component={ReservationScreen}
        options={{ title: "Reservations" }}
      />

      <Stack.Screen
        name="OrderTracking"
        component={OrderTrackingScreen}
        options={{ title: "Order Tracking" }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />

      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{ title: "Reviews" }}
      />

      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: "Dashboard" }}
      />
    </Stack.Navigator>
  );
}