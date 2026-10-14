import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useCart } from "../context/CartContext";

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
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        }}
        style={styles.image}
      />
      <Text style={styles.logo}>Bite & Bliss</Text>
      <Text style={styles.tagline}>Fresh flavors, served fast</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111111",
    padding: 20,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  logo: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  tagline: {
    color: "#ddd",
    marginTop: 8,
    fontSize: 16,
  },
});
