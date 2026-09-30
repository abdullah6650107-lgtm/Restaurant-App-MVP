import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useCart } from "../context/CartContext";

export default function FoodDetailScreen({ route, navigation }) {
  const { item } = route.params;
  const { addItem, theme } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={[styles.infoBox, { backgroundColor: theme.panel }]}>
        <Text style={[styles.category, { color: theme.textMuted }]}>{item.category}</Text>
        <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.price, { color: theme.text }]}>Rs. {item.price}</Text>

        <Text style={[styles.description, { color: theme.textMuted }]}>
          Freshly prepared, rich in flavor, and made with premium ingredients for a satisfying restaurant experience.
        </Text>

        <View style={styles.quantityRow}>
          <Text style={[styles.quantityLabel, { color: theme.text }]}>Quantity</Text>
          <View style={[styles.counterBox, { backgroundColor: theme.panelAlt }]}>
            <TouchableOpacity onPress={() => setQuantity((q) => Math.max(1, q - 1))}>
              <Text style={[styles.counterText, { color: theme.text }]}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.quantityValue, { color: theme.text }]}>{quantity}</Text>
            <TouchableOpacity onPress={() => setQuantity((q) => q + 1)}>
              <Text style={[styles.counterText, { color: theme.text }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.accent }]}
          onPress={() => {
            for (let i = 0; i < quantity; i += 1) {
              addItem(item);
            }
            navigation.navigate("Cart");
          }}
        >
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 30,
  },
  image: {
    width: "100%",
    height: 280,
  },
  infoBox: {
    marginTop: -20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
  },
  category: {
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    fontWeight: "600",
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  quantityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  counterBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  counterText: {
    fontSize: 26,
    paddingHorizontal: 12,
    fontWeight: "bold",
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: "700",
    minWidth: 30,
    textAlign: "center",
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
