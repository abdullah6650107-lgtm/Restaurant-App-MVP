import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import menu from "../data/menu";
import { useCart } from "../context/CartContext";
import BottomNav from "../components/BottomNav";

export default function MenuScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const { addItem, totalItems, theme } = useCart();

  const categories = ["All", "Burgers", "Pizza", "Sides", "Desserts", "Drinks"];

  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const categoryMatch =
        selectedCategory === "All" || item.category === selectedCategory;

      const searchMatch = item.name
        .toLowerCase()
        .includes(searchText.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchText]);

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.panel, borderColor: theme.border }]}>
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.category, { color: theme.textMuted }]}>{item.category}</Text>
        <Text style={[styles.price, { color: theme.text }]}>Rs {item.price}</Text>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.detailButton, { borderColor: theme.border }]}
            onPress={() => navigation.navigate("FoodDetail", { item })}
            accessibilityLabel={`View ${item.name} details`}
          >
            <Text style={[styles.detailText, { color: theme.text }]}>Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.accent }]}
            onPress={() => addItem(item)}
            accessibilityLabel={`Add ${item.name} to cart`}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.eyebrow, { color: theme.accent }]}>BITE & BLISS  ·  FRESH DAILY</Text>
            <Text style={[styles.title, { color: theme.text }]}>What sounds good?</Text>
          </View>

          <TouchableOpacity
            style={[styles.cartButton, { backgroundColor: theme.panel, borderColor: theme.border }]}
            onPress={() => navigation.navigate("Cart")}
            accessibilityLabel={`Open cart, ${totalItems} items`}
          >
            <Ionicons name="bag-handle-outline" size={19} color={theme.accent} />
            <Text style={[styles.cartText, { color: theme.text }]}>{totalItems}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionHeader}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.accentSoft }]}
            onPress={() => navigation.navigate("Reservations")}
          >
            <Ionicons name="calendar-outline" size={17} color={theme.accent} />
            <Text style={[styles.quickActionText, { color: theme.accent }]}>Book a table</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: theme.panel, borderColor: theme.border }]}
            onPress={() => navigation.navigate("Orders")}
          >
            <Ionicons name="receipt-outline" size={17} color={theme.textMuted} />
            <Text style={[styles.quickActionText, { color: theme.text }]}>Your orders</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.searchWrap, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={19} color={theme.textMuted} />
          <TextInput
            style={[styles.search, { color: theme.text }]}
            placeholder="Search the menu"
            placeholderTextColor={theme.textMuted}
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            accessibilityLabel="Search menu"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")} accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={19} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                { backgroundColor: theme.panel, borderColor: theme.border },
                selectedCategory === item && { backgroundColor: theme.accentSoft, borderColor: theme.accent },
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: selectedCategory === item ? theme.accent : theme.textMuted },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />

        <FlatList
          data={filteredMenu}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={(
            <View style={styles.listHeading}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Popular picks</Text>
              <Text style={[styles.resultCount, { color: theme.textMuted }]}>
                {filteredMenu.length} {filteredMenu.length === 1 ? "item" : "items"}
              </Text>
            </View>
          )}
          ListEmptyComponent={(
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={28} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No dishes found</Text>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>Try another name or category.</Text>
            </View>
          )}
        />
      </View>

      <BottomNav navigation={navigation} activeTab="Menu" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 17,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 6,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
  },
  cartButton: {
    width: 48,
    height: 44,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
  },
  cartText: {
    fontWeight: "800",
  },
  searchWrap: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 13,
    marginBottom: 4,
  },
  search: {
    flex: 1,
    minHeight: 46,
    paddingVertical: 8,
  },
  categories: {
    paddingVertical: 10,
    paddingRight: 2,
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 7,
    marginRight: 8,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: "center",
  },
  categoryText: {
    fontWeight: "700",
    fontSize: 12,
  },
  list: {
    paddingBottom: 14,
    flexGrow: 1,
  },
  listHeading: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingTop: 6,
    paddingBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  resultCount: {
    fontSize: 12,
  },
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 9,
    marginTop: 12,
    overflow: "hidden",
    minHeight: 132,
  },
  image: {
    width: 112,
    minHeight: 132,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
  },
  category: {
    marginTop: 3,
    fontSize: 12,
  },
  price: {
    fontSize: 15,
    fontWeight: "800",
    marginTop: 7,
  },
  actionRow: {
    flexDirection: "row",
    gap: 7,
    marginTop: 8,
  },
  detailButton: {
    flex: 0.85,
    minHeight: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  detailText: {
    fontWeight: "700",
    fontSize: 11,
  },
  button: {
    flex: 1,
    minHeight: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 11,
  },
  actionHeader: {
    flexDirection: "row",
    gap: 9,
    marginBottom: 12,
  },
  quickAction: {
    flex: 1,
    minHeight: 42,
    flexDirection: "row",
    gap: 7,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  quickActionText: {
    fontWeight: "700",
    fontSize: 11,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 44,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "800",
  },
  emptyText: {
    marginTop: 5,
    fontSize: 13,
  },
});