import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import menuData from "../data/menu";
import usersData from "../data/users";
import { useCart } from "../context/CartContext";

const initialProducts = menuData.map((item) => ({ ...item }));
const initialAccounts = usersData.map((user) => ({ ...user }));

const defaultOrders = [
  { id: "ORD-101", customer: "Abdullah", status: "Preparing", items: 3 },
  { id: "ORD-102", customer: "Ayesha", status: "On the Way", items: 2 },
  { id: "ORD-103", customer: "Ali", status: "Pending", items: 4 },
  { id: "ORD-104", customer: "Zara", status: "Delivered", items: 1 },
];

const statusSteps = ["Pending", "Preparing", "On the Way", "Delivered"];

export default function DashboardScreen() {
  const { theme, darkMode, toggleDarkMode } = useCart();
  const [products, setProducts] = useState(initialProducts);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [orders, setOrders] = useState(defaultOrders);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Burgers",
    price: "",
  });

  const revenue = useMemo(
    () => products.reduce((sum, product) => sum + Number(product.price), 0),
    [products]
  );

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status !== "Delivered").length,
    [orders]
  );

  const addProduct = () => {
    if (!newProduct.name.trim() || !newProduct.price) return;

    const product = {
      id: `${products.length + 1}`,
      name: newProduct.name.trim(),
      category: newProduct.category,
      price: Number(newProduct.price),
      image: "https://images.unsplash.com/photo-1544025162-d76694265947",
    };

    setProducts((current) => [product, ...current]);
    setNewProduct({ name: "", category: "Burgers", price: "" });
  };

  const removeProduct = (productId) => {
    setProducts((current) => current.filter((item) => item.id !== productId));
  };

  const updatePrice = (productId, value) => {
    setProducts((current) =>
      current.map((item) =>
        item.id === productId ? { ...item, price: Number(value) } : item
      )
    );
  };

  const removeAccount = (accountId) => {
    setAccounts((current) => current.filter((user) => user.id !== accountId));
  };

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order
      )
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.topBar}>
        <Text style={[styles.title, { color: theme.text }]}>Manager Dashboard</Text>

        <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: theme.panel, borderColor: theme.border }]}
          onPress={toggleDarkMode}
        >
          <Text style={[styles.toggleText, { color: theme.text }]}>
            {darkMode ? "Light" : "Dark"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.hero, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <Text style={[styles.heroLabel, { color: theme.textMuted }]}>Operational Summary</Text>
        <Text style={[styles.heroTitle, { color: theme.text }]}>Restaurant is running smoothly</Text>
        <Text style={[styles.heroMeta, { color: theme.textMuted }]}>
          {pendingOrders} orders awaiting completion
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Orders</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{orders.length}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Revenue</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>Rs. {revenue}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Accounts</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{accounts.length}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Rating</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>4.8/5</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Add Product</Text>

        <TextInput
          value={newProduct.name}
          onChangeText={(text) => setNewProduct((current) => ({ ...current, name: text }))}
          placeholder="Product name"
          placeholderTextColor={theme.textMuted}
          style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
        />

        <View style={styles.inlineRow}>
          <TextInput
            value={newProduct.category}
            onChangeText={(text) => setNewProduct((current) => ({ ...current, category: text }))}
            placeholder="Category"
            placeholderTextColor={theme.textMuted}
            style={[styles.inputHalf, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
          />

          <TextInput
            value={newProduct.price}
            onChangeText={(text) => setNewProduct((current) => ({ ...current, price: text }))}
            keyboardType="numeric"
            placeholder="Price"
            placeholderTextColor={theme.textMuted}
            style={[styles.inputHalf, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
          />
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.accent }]}
          onPress={addProduct}
        >
          <Text style={styles.primaryButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Products & Pricing</Text>

        {products.map((item) => (
          <View key={item.id} style={[styles.listItem, { backgroundColor: theme.panelAlt, borderColor: theme.border }]}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: theme.text }]}>{item.name}</Text>
              <Text style={[styles.itemMeta, { color: theme.textMuted }]}>{item.category}</Text>
            </View>

            <View style={styles.priceBox}>
              <TextInput
                value={String(item.price)}
                onChangeText={(text) => updatePrice(item.id, text)}
                keyboardType="numeric"
                style={[styles.priceInput, { color: theme.text, backgroundColor: theme.input, borderColor: theme.border }]}
              />
            </View>

            <TouchableOpacity onPress={() => removeProduct(item.id)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Registered Accounts</Text>

        {accounts.map((user) => (
          <View key={user.id} style={[styles.listItem, { backgroundColor: theme.panelAlt, borderColor: theme.border }]}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: theme.text }]}>{user.name}</Text>
              <Text style={[styles.itemMeta, { color: theme.textMuted }]}>{user.email}</Text>
            </View>

            <Text style={[styles.roleText, { color: user.role === "manager" ? "#f59e0b" : "#22c55e" }]}>
              {user.role}
            </Text>

            <TouchableOpacity onPress={() => removeAccount(user.id)}>
              <Text style={styles.removeText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Order Tracking</Text>

        {orders.map((order) => (
          <View key={order.id} style={[styles.orderCard, { backgroundColor: theme.panelAlt, borderColor: theme.border }]}>
            <View style={styles.orderHeader}>
              <Text style={[styles.orderId, { color: theme.text }]}>{order.id}</Text>
              <Text style={[styles.orderCustomer, { color: theme.textMuted }]}>{order.customer}</Text>
            </View>

            <Text style={[styles.orderText, { color: theme.textMuted }]}>{order.items} items</Text>

            <View style={styles.statusRow}>
              {statusSteps.map((step) => (
                <TouchableOpacity
                  key={step}
                  onPress={() => updateOrderStatus(order.id, step)}
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor: order.status === step ? theme.accent : theme.accentSoft,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: order.status === step ? "#fff" : theme.text },
                    ]}
                  >
                    {step}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  toggleButton: {
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  toggleText: {
    fontWeight: "700",
  },
  hero: {
    borderRadius: 8,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
  },
  heroLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  heroMeta: {
    marginTop: 8,
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  statCard: {
    width: "48%",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  statLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
  card: {
    borderRadius: 8,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  inlineRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  inputHalf: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  primaryButton: {
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: "700",
    fontSize: 15,
  },
  itemMeta: {
    fontSize: 12,
    marginTop: 3,
  },
  priceBox: {
    marginHorizontal: 8,
  },
  priceInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 70,
    textAlign: "center",
  },
  removeText: {
    color: "#ef4444",
    fontWeight: "700",
  },
  roleText: {
    fontWeight: "700",
    marginRight: 10,
    textTransform: "capitalize",
  },
  orderCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  orderId: {
    fontWeight: "700",
  },
  orderCustomer: {
    fontSize: 12,
  },
  orderText: {
    fontSize: 12,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  statusButton: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 7,
    marginBottom: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
});
