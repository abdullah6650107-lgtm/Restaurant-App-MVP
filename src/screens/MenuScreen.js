import React from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useCart } from "../context/CartContext";
import BottomNav from "../components/BottomNav";
import { useMenu } from "../hooks/useMenu";

export default function MenuScreen({ navigation }) {
  const { addItem, favorites, toggleFavorite, totalItems, theme } = useCart();
  const {
    selectedCategory,
    setSelectedCategory,
    searchText,
    setSearchText,
    menuError,
    menuLoading,
    categories,
    filteredMenu,
    loadMenu,
  } = useMenu(favorites);

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.panel, borderColor: theme.border }]}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity
          style={[styles.favoriteButton, { backgroundColor: theme.panel }]}
          onPress={() => toggleFavorite(item.id)}
          accessibilityRole="button"
          accessibilityState={{ selected: favorites.includes(item.id) }}
          accessibilityLabel={`${favorites.includes(item.id) ? "Remove" : "Add"} ${item.name} ${favorites.includes(item.id) ? "from" : "to"} favorites`}
          hitSlop={8}
        >
          <Ionicons
            name={favorites.includes(item.id) ? "heart" : "heart-outline"}
            size={19}
            color={favorites.includes(item.id) ? theme.accent : theme.textMuted}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.category, { color: theme.textMuted }]}>{item.category}</Text>
        <Text style={[styles.price, { color: theme.text }]}>Rs. {item.price}</Text>

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
            <Text style={[styles.title, { color: theme.text }]}>What are you craving?</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>
              Made fresh, just the way you like it.
            </Text>
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
            placeholder="Search dishes or categories"
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

        <ScrollView
          horizontal
          style={styles.categoryList}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {categories.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[
                styles.categoryButton,
                { backgroundColor: theme.panel, borderColor: theme.border },
                selectedCategory === item.key && { backgroundColor: theme.accentSoft, borderColor: theme.accent },
              ]}
              onPress={() => setSelectedCategory(item.key)}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: selectedCategory === item.key ? theme.accent : theme.textMuted },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <FlatList
          data={filteredMenu}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={(
            <View style={styles.listHeading}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {selectedCategory === "favorites"
                  ? "Your favorites"
                  : selectedCategory === "all"
                    ? "Popular picks"
                    : categories.find((category) => category.key === selectedCategory)?.label}
              </Text>
              <Text style={[styles.resultCount, { color: theme.textMuted }]}>
                {filteredMenu.length} {filteredMenu.length === 1 ? "item" : "items"}
              </Text>
            </View>
          )}
          ListEmptyComponent={(
            <View style={styles.emptyState}>
              {menuLoading ? (
                <ActivityIndicator size="large" color={theme.accent} />
              ) : (
                <Ionicons
                  name={menuError ? "cloud-offline-outline" : selectedCategory === "favorites" ? "heart-outline" : "search-outline"}
                  size={30}
                  color={theme.textMuted}
                />
              )}
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                {menuLoading
                  ? "Fresh flavors are on the way"
                  : menuError
                    ? "Menu unavailable"
                    : selectedCategory === "favorites"
                      ? "No favorites yet"
                      : "No dishes found"}
              </Text>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                {menuLoading
                  ? "Loading today's menu…"
                  : menuError || (selectedCategory === "favorites"
                    ? "Tap the heart on a dish to save it here."
                    : "Try another name or category.")}
              </Text>
              {!!menuError && !menuLoading && (
                <TouchableOpacity
                  style={[styles.retryButton, { backgroundColor: theme.accent }]}
                  onPress={loadMenu}
                  accessibilityRole="button"
                >
                  <Text style={styles.retryText}>Try again</Text>
                </TouchableOpacity>
              )}
              {!menuLoading && !menuError && filteredMenu.length === 0 && (
                <TouchableOpacity
                  style={[styles.retryButton, { backgroundColor: theme.accent }]}
                  onPress={() => {
                    setSearchText("");
                    setSelectedCategory("all");
                  }}
                  accessibilityRole="button"
                >
                  <Text style={styles.retryText}>Browse all dishes</Text>
                </TouchableOpacity>
              )}
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
  subtitle: {
    marginTop: 4,
    fontSize: 12,
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
  categoryList: {
    flexGrow: 0,
    flexShrink: 0,
    height: 58,
  },
  categories: {
    paddingVertical: 10,
    paddingRight: 2,
    alignItems: "center",
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 7,
    marginRight: 8,
    borderWidth: 1,
    height: 38,
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
    alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 14,
    marginTop: 12,
    overflow: "hidden",
    minHeight: 144,
  },
  imageWrap: {
    width: 116,
    height: 144,
    minHeight: 144,
    flexShrink: 0,
    position: "relative",
  },
  image: {
    width: 116,
    height: 144,
  },
  favoriteButton: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    padding: 13,
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
  retryButton: {
    minHeight: 42,
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 16,
  },
  retryText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
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