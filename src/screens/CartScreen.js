import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useCart } from "../context/CartContext";
import BottomNav from "../components/BottomNav";

export default function CartScreen({ navigation }) {
  const { items, updateQuantity, removeItem, subtotal, clearCart, theme, totalItems } = useCart();

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.panel, borderColor: theme.border }]} key={item.id}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
        <View style={styles.itemPriceRow}>
          <Text style={[styles.price, { color: theme.textMuted }]}>Rs {item.price} each</Text>
          <Text style={[styles.lineTotal, { color: theme.text }]}>Rs {item.price * item.quantity}</Text>
        </View>

        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={[styles.qtyButton, { backgroundColor: theme.accent }]}
            onPress={() => updateQuantity(item.id, -1)}
            accessibilityLabel={`Remove one ${item.name}`}
          >
            <Ionicons name="remove" size={18} color="#fff" />
          </TouchableOpacity>

          <Text style={[styles.quantity, { color: theme.text }]}>{item.quantity}</Text>

          <TouchableOpacity
            style={[styles.qtyButton, { backgroundColor: theme.accent }]}
            onPress={() => updateQuantity(item.id, 1)}
            accessibilityLabel={`Add one ${item.name}`}
          >
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => removeItem(item.id)} accessibilityLabel={`Remove ${item.name} from cart`}>
          <Ionicons name="trash-outline" size={17} color={theme.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.accentSoft }]}>
            <Ionicons name="bag-handle-outline" size={34} color={theme.accent} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Your bag is taking a break</Text>
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>Pick a dish and we’ll get it started.</Text>
          <TouchableOpacity
            style={[styles.browseButton, { backgroundColor: theme.accent }]}
            onPress={() => navigation.navigate("Menu")}
          >
            <Text style={styles.checkoutText}>Browse menu</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <BottomNav navigation={navigation} activeTab="Cart" />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListHeaderComponent={(
          <View style={styles.listHeader}>
            <Text style={[styles.itemCount, { color: theme.textMuted }]}>{totalItems} {totalItems === 1 ? "dish" : "dishes"}</Text>
            <TouchableOpacity onPress={clearCart} accessibilityLabel="Clear cart">
              <Text style={[styles.clearText, { color: theme.danger }]}>Clear all</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={[styles.footer, { backgroundColor: theme.panel, borderTopColor: theme.border }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Subtotal</Text>
          <Text style={[styles.summaryValue, { color: theme.text }]}>Rs. {subtotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Delivery</Text>
          <Text style={[styles.summaryValue, { color: theme.text }]}>Calculated at checkout</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutButton, { backgroundColor: theme.accent }]}
          onPress={() => navigation.navigate("Checkout")}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
      <BottomNav navigation={navigation} activeTab="Cart" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 14,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 18,
    paddingBottom: 12,
  },
  itemCount: {
    fontSize: 13,
    fontWeight: "700",
  },
  card: {
    flexDirection: "row",
    borderRadius: 9,
    borderWidth: 1,
    marginBottom: 10,
    overflow: "hidden",
  },
  image: {
    width: 92,
    height: 116,
  },
  info: {
    flex: 1,
    padding: 11,
  },
  name: {
    fontSize: 15,
    fontWeight: "800",
  },
  itemPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    marginVertical: 5,
    fontSize: 11,
  },
  lineTotal: {
    fontSize: 12,
    fontWeight: "800",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  qtyButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  quantity: {
    marginHorizontal: 12,
    fontWeight: "600",
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "bold",
  },
  checkoutButton: {
    minHeight: 50,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  clearText: {
    textAlign: "center",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
  browseButton: {
    minHeight: 48,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 22,
    paddingHorizontal: 20,
  },
});
