import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useCart } from "../context/CartContext";

const logo = require("../../assets/splash-icon.png");

export default function SplashScreen({ navigation }) {
  const { user, authReady } = useCart();

  useEffect(() => {
    if (!authReady) return undefined;
    const timer = setTimeout(() => {
      navigation.replace(
        user
          ? (user.role === "manager" ? "Dashboard" : "Menu")
          : "Login"
      );
    }, 800);

    return () => clearTimeout(timer);
  }, [authReady, navigation, user]);

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7EBD8",
    padding: 20,
  },
  image: {
    width: 280,
    height: 280,
  },
});
