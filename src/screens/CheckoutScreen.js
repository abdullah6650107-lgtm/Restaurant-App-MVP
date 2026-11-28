import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useCart } from "../context/CartContext";
import { useCheckout } from "../hooks/useCheckout";

export default function CheckoutScreen({ navigation }) {
  const { items, subtotal, placeOrder, clearCart, theme, user } = useCart();
  const {
    name,
    setName,
    address,
    setAddress,
    isSubmitting,
    deliveryFee,
    total,
    itemCount,
    submitOrder,
  } = useCheckout({ items, subtotal, user, placeOrder, clearCart });

  const handlePlaceOrder = async () => {
    const result = await submitOrder();
    if (result.status === "ignored") return;
    if (result.status === "invalid") {
      Alert.alert(result.title, result.message);
      return;
    }
    if (result.status === "success") {
      Alert.alert("Order Placed", "Your food is being prepared.");
      navigation.navigate("Orders");
      return;
    }
    Alert.alert("Order Failed", result.message);
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: theme.text }]}>Almost there</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>Delivery details and payment</Text>

      <View style={[styles.card, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <View style={styles.sectionHeading}>
          <Ionicons name="location-outline" size={19} color={theme.accent} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Delivery details</Text>
        </View>
        <Text style={[styles.label, { color: theme.text }]}>Customer Name</Text>
        <TextInput
          style={[styles.input, { color: theme.text, backgroundColor: theme.input, borderColor: theme.border }]}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={theme.textMuted}
          autoCapitalize="words"
          returnKeyType="next"
        />

        <Text style={[styles.label, { color: theme.text }]}>Delivery Address</Text>
        <TextInput
          style={[styles.input, styles.textArea, { color: theme.text, backgroundColor: theme.input, borderColor: theme.border }]}
          value={address}
          onChangeText={setAddress}
          multiline
          placeholder="Street, area, city"
          placeholderTextColor={theme.textMuted}
          textAlignVertical="top"
        />

        <Text style={[styles.label, { color: theme.text }]}>Payment Method</Text>
        <View style={[styles.paymentButton, { backgroundColor: theme.accentSoft, borderColor: theme.accent }]}>
          <Ionicons name="cash-outline" size={17} color={theme.accent} />
          <Text style={[styles.paymentText, { color: theme.text }]}>Cash on Delivery</Text>
        </View>
      </View>

      <View style={[styles.summaryCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <View style={styles.sectionHeading}>
          <Ionicons name="receipt-outline" size={19} color={theme.accent} />
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Order summary</Text>
          <Text style={[styles.itemCount, { color: theme.textMuted }]}>{itemCount} {itemCount === 1 ? "item" : "items"}</Text>
        </View>
        {items.map((item) => (
          <View key={item.id} style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>{item.name}  × {item.quantity}</Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>Rs {item.price * item.quantity}</Text>
          </View>
        ))}
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Subtotal</Text>
          <Text style={[styles.summaryValue, { color: theme.text }]}>Rs. {subtotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Delivery</Text>
          <Text style={[styles.summaryValue, { color: theme.text }]}>Rs. {deliveryFee}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: theme.border }]}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>Total</Text>
          <Text style={[styles.totalValue, { color: theme.text }]}>Rs. {total}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.placeButton, { backgroundColor: theme.accent, opacity: isSubmitting ? 0.7 : 1 }]} onPress={handlePlaceOrder} disabled={isSubmitting}>
        <Text style={styles.placeButtonText} numberOfLines={1}>
          Place order · Rs {total}
        </Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 18,
    paddingBottom: 56,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 18,
  },
  card: {
    borderRadius: 9,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
  },
  itemCount: {
    fontSize: 12,
    fontWeight: "600",
  },
  label: {
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 48,
  },
  textArea: {
    minHeight: 76,
  },
  paymentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 8,
  },
  paymentButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  paymentSelected: {
    backgroundColor: "#222",
    borderColor: "#222",
  },
  paymentText: {
    fontWeight: "600",
  },
  paymentTextSelected: {
    color: "#fff",
  },
  summaryCard: {
    borderRadius: 9,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 13,
  },
  summaryValue: {
    fontWeight: "600",
    fontSize: 13,
  },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "800",
  },
  placeButton: {
    minHeight: 56,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  placeButtonText: {
    flexShrink: 1,
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    textAlign: "center",
  },
});
