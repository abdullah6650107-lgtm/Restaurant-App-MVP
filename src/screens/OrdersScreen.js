import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useCart } from "../context/CartContext";
import BottomNav from "../components/BottomNav";

export default function OrdersScreen({ navigation }) {
  const { orderHistory, theme } = useCart();

  const statusColor = {
    Confirmed: theme.accent,
    Preparing: "#B2782B",
    "On the Way": "#3B8293",
    Delivered: theme.success,
  };

  if (!orderHistory.length) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <View style={styles.emptyContainer}>
        <View style={[styles.emptyIcon, { backgroundColor: theme.accentSoft }]}>
          <Ionicons name="receipt-outline" size={32} color={theme.accent} />
        </View>
        <Text style={[styles.emptyText, { color: theme.text }]}>No orders yet</Text>
        <Text style={[styles.emptyHint, { color: theme.textMuted }]}>Your next favorite meal is one tap away.</Text>
        <TouchableOpacity style={[styles.browseButton, { backgroundColor: theme.accent }]} onPress={() => navigation.navigate("Menu")}>
          <Text style={styles.trackButtonText}>Explore the menu</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
        </View>
        <BottomNav navigation={navigation} activeTab="Orders" />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Your orders</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>A little update on every delivery</Text>
        </View>
      </View>

      <FlatList
        data={orderHistory}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: theme.panel, borderColor: theme.border },
            ]}
          >
            <View style={styles.orderTopRow}>
              <Text style={[styles.orderTitle, { color: theme.text }]}>
                Order #{item.id}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: `${statusColor[item.status] || statusColor.Confirmed}22`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: statusColor[item.status] || statusColor.Confirmed },
                  ]}
                >
                  {item.status || "Confirmed"}
                </Text>
              </View>
            </View>

            <Text style={[styles.meta, { color: theme.textMuted }]}>{item.customerName}</Text>
            <Text style={[styles.meta, { color: theme.textMuted }]}>{item.paymentMethod}</Text>
            <Text style={[styles.meta, { color: theme.textMuted }]}>{item.address}</Text>
            <Text style={[styles.total, { color: theme.text }]}>Total: Rs. {item.total}</Text>
            <Text style={[styles.items, { color: theme.textMuted }]}>
              {item.items.map((entry) => `${entry.name} ×${entry.quantity}`).join("  ·  ")}
            </Text>

            <TouchableOpacity
              style={[styles.trackButton, { backgroundColor: theme.accent }]}
              onPress={() => navigation.navigate("OrderTracking", { order: item })}
              accessibilityLabel={`Track order ${item.id}`}
            >
              <Ionicons name="navigate-outline" size={17} color="#fff" />
              <Text style={styles.trackButtonText}>Track Order</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      </View>
      <BottomNav navigation={navigation} activeTab="Orders" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  orderTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  meta: {
    marginBottom: 4,
  },
  total: {
    marginTop: 8,
    fontWeight: "700",
  },
  items: {
    marginTop: 8,
    lineHeight: 19,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 14,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyHint: {
    marginTop: 6,
    fontSize: 13,
    textAlign: "center",
  },
  browseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginTop: 20,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontWeight: "700",
    fontSize: 11,
  },
  trackButton: {
    marginTop: 14,
    minHeight: 44,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  trackButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
