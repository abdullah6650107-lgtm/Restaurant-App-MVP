import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import { useCart } from "../context/CartContext";
import { api } from "../data/api";
import { useUsers } from "../data/users";

const statusSteps = ["Confirmed", "Preparing", "On the Way", "Delivered", "Cancelled"];

export default function DashboardScreen({ navigation }) {
  const { theme, darkMode, toggleDarkMode, token } = useCart();
  const [products, setProducts] = useState([]);
  const [productNotification, setProductNotification] = useState("");
  const {
    users,
    loading: usersLoading,
    error: usersError,
    deleteUser,
  } = useUsers(token);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    revenue: 0,
    pendingOrders: 0,
    averageRating: null,
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
  });
  const categoryOptions = useMemo(
    () => [...new Set(products.map((product) => product.category?.trim()).filter(Boolean))],
    [products]
  );
  const selectedCategory = categoryOptions.includes(newProduct.category)
    ? newProduct.category
    : categoryOptions[0] || "";

  useEffect(() => {
    if (!productNotification) return undefined;
    const timeout = setTimeout(() => setProductNotification(""), 3000);
    return () => clearTimeout(timeout);
  }, [productNotification]);

  useEffect(() => {
    if (!token) return undefined;
    let active = true;
    Promise.all([
      api.getMenu(),
      api.getOrders(token),
      api.getDashboard(token),
    ])
      .then(([menuResponse, ordersResponse, dashboard]) => {
        if (!active) return;
        setProducts(menuResponse.items);
        setOrders(ordersResponse.orders);
        setSummary(dashboard);
      })
      .catch((error) => {
        if (active) Alert.alert("Dashboard Unavailable", error.message);
      });
    return () => {
      active = false;
    };
  }, [token]);

  useEffect(() => {
    if (token && usersError) Alert.alert("Accounts Unavailable", usersError);
  }, [token, usersError]);

  const addProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price) return;
    if (!categoryOptions.includes(selectedCategory)) {
      Alert.alert("Select a Category", "Choose one of the existing product categories.");
      return;
    }

    try {
      const { item } = await api.createMenuItem({
        name: newProduct.name.trim(),
        category: selectedCategory,
        price: Number(newProduct.price),
        image: newProduct.image.trim(),
      }, token);
      setProducts((current) => [item, ...current]);
      setProductNotification("Product added successfully");
      setNewProduct({
        name: "",
        category: selectedCategory,
        price: "",
        image: "",
      });
    } catch (error) {
      Alert.alert("Could Not Add Product", error.message);
    }
  };

  const removeProduct = async (productId) => {
    try {
      await api.deleteMenuItem(productId, token);
      setProducts((current) => current.filter((item) => item.id !== productId));
    } catch (error) {
      Alert.alert("Could Not Remove Product", error.message);
    }
  };

  const updatePrice = async (productId, value) => {
    const price = Number(value);
    if (!Number.isFinite(price) || price <= 0) {
      setProducts((current) => current.map(({ priceDraft, ...item }) => item));
      return;
    }
    try {
      const { item: updatedItem } = await api.updateMenuItem(productId, { price }, token);
      setProducts((current) =>
        current.map((item) => item.id === productId ? updatedItem : item)
      );
    } catch (error) {
      setProducts((current) => current.map(({ priceDraft, ...item }) => item));
      Alert.alert("Could Not Update Price", error.message);
    }
  };

  const removeAccount = async (accountId) => {
    try {
      await deleteUser(accountId);
    } catch (error) {
      Alert.alert("Could Not Delete Account", error.message);
    }
  };

  const updateOrderStatus = async (orderId, nextStatus) => {
    try {
      const { order: updatedOrder } = await api.updateOrderStatus(orderId, nextStatus, token);
      setOrders((current) =>
        current.map((order) => order.id === orderId ? updatedOrder : order)
      );
      const dashboard = await api.getDashboard(token);
      setSummary(dashboard);
    } catch (error) {
      Alert.alert("Could Not Update Order", error.message);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.topBar}>
        <Text style={[styles.title, { color: theme.text }]}>Manager Dashboard</Text>

        <View style={styles.topActions}>
          <TouchableOpacity
            style={[styles.accountButton, { backgroundColor: theme.panel, borderColor: theme.border }]}
            onPress={() => navigation.navigate("Profile")}
            accessibilityRole="button"
          >
            <Text style={[styles.toggleText, { color: theme.text }]}>Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, { backgroundColor: theme.panel, borderColor: theme.border }]}
            onPress={toggleDarkMode}
          >
            <Text style={[styles.toggleText, { color: theme.text }]}>
              {darkMode ? "Light" : "Dark"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {productNotification ? (
        <View
          accessibilityRole="alert"
          style={[
            styles.successNotification,
            { backgroundColor: theme.panel, borderColor: theme.success },
          ]}
        >
          <Text style={[styles.successNotificationText, { color: theme.success }]}>
            {productNotification}
          </Text>
        </View>
      ) : null}

      <View style={[styles.hero, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <Text style={[styles.heroLabel, { color: theme.textMuted }]}>Operational Summary</Text>
        <Text style={[styles.heroTitle, { color: theme.text }]}>Restaurant is running smoothly</Text>
        <Text style={[styles.heroMeta, { color: theme.textMuted }]}>
          {summary.pendingOrders} orders awaiting completion
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Orders</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{orders.length}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Revenue</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>Rs. {summary.revenue}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Accounts</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>
            {usersLoading ? "..." : users.length}
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>Rating</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{summary.averageRating ?? "--"}/5</Text>
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

        <Text style={[styles.fieldLabel, { color: theme.text }]}>Select category</Text>
        {categoryOptions.length ? (
          <View style={styles.categoryOptions}>
            {categoryOptions.map((category) => {
              const selected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryOption,
                    {
                      backgroundColor: selected ? theme.accentSoft : theme.input,
                      borderColor: selected ? theme.accent : theme.border,
                    },
                  ]}
                  onPress={() => setNewProduct((current) => ({ ...current, category }))}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.categoryOptionText, { color: selected ? theme.accent : theme.text }]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text style={[styles.categoryHint, { color: theme.textMuted }]}>
            No existing categories are available yet.
          </Text>
        )}

        <View style={styles.inlineRow}>
          <TextInput
            value={newProduct.price}
            onChangeText={(text) => setNewProduct((current) => ({ ...current, price: text }))}
            keyboardType="numeric"
            placeholder="Price"
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { flex: 1, backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
          />
        </View>

        <TextInput
          value={newProduct.image}
          onChangeText={(text) => setNewProduct((current) => ({ ...current, image: text }))}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Image URL (optional)"
          placeholderTextColor={theme.textMuted}
          style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
        />

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.accent, opacity: categoryOptions.length ? 1 : 0.6 }]}
          onPress={addProduct}
          disabled={!categoryOptions.length}
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
                value={item.priceDraft ?? String(item.price)}
                onChangeText={(text) => setProducts((current) =>
                  current.map((product) => product.id === item.id
                    ? { ...product, priceDraft: text }
                    : product)
                )}
                onEndEditing={(event) => {
                  void updatePrice(item.id, event.nativeEvent.text);
                }}
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

        {users.map((user) => (
          <View key={user.id} style={[styles.listItem, { backgroundColor: theme.panelAlt, borderColor: theme.border }]}>
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: theme.text }]}>{user.name}</Text>
              <Text style={[styles.itemMeta, { color: theme.textMuted }]}>{user.email}</Text>
            </View>

            <Text style={[styles.roleText, { color: user.role === "manager" ? "#f59e0b" : "#22c55e" }]}>
              {user.role}
            </Text>

            {user.role === "customer" ? (
              <TouchableOpacity onPress={() => removeAccount(user.id)}>
                <Text style={styles.removeText}>Delete</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Order Tracking</Text>

        {orders.map((order) => (
          <View key={order.id} style={[styles.orderCard, { backgroundColor: theme.panelAlt, borderColor: theme.border }]}>
            <View style={styles.orderHeader}>
              <Text
                style={[styles.orderId, { color: theme.text }]}
                numberOfLines={1}
                ellipsizeMode="tail"
                accessibilityLabel={`Order number ${order.id}`}
              >
                Order #{order.id.length > 12 ? `${order.id.slice(0, 8)}…` : order.id}
              </Text>
              <Text
                style={[styles.orderCustomer, { color: theme.textMuted }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {order.customerName}
              </Text>
            </View>

            <Text style={[styles.orderText, { color: theme.textMuted }]}>{order.items?.reduce((count, item) => count + item.quantity, 0) || 0} items · Rs. {order.total}</Text>

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
  successNotification: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  successNotificationText: {
    fontWeight: "700",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  topActions: {
    flexDirection: "row",
    gap: 8,
  },
  accountButton: {
    minHeight: 40,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
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
  fieldLabel: {
    fontWeight: "700",
    marginBottom: 8,
  },
  categoryOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  categoryOption: {
    minHeight: 40,
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryOptionText: {
    fontWeight: "700",
  },
  categoryHint: {
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
    alignItems: "flex-start",
    marginBottom: 4,
  },
  orderId: {
    maxWidth: "100%",
    fontWeight: "700",
  },
  orderCustomer: {
    fontSize: 12,
    marginTop: 3,
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
