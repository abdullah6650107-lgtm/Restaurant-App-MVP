import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";

export default function BottomNav({ navigation, activeTab }) {
  const { theme, totalItems } = useCart();
  const items = [
    { label: "Menu", name: "Menu", icon: "restaurant-outline", activeIcon: "restaurant" },
    { label: "Book", name: "Reservations", icon: "calendar-outline", activeIcon: "calendar" },
    { label: "Cart", name: "Cart", icon: "bag-handle-outline", activeIcon: "bag-handle" },
    { label: "Orders", name: "Orders", icon: "receipt-outline", activeIcon: "receipt" },
    { label: "Profile", name: "Profile", icon: "person-outline", activeIcon: "person" },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.panel, borderTopColor: theme.border },
      ]}
    >
      {items.map((item) => {
        const isActive = activeTab === item.name;
        const badgeCount = item.name === "Cart" ? totalItems : 0;

        return (
          <TouchableOpacity
            key={item.name}
            style={styles.tab}
            onPress={() => navigation.navigate(item.name)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${item.label}${badgeCount ? `, ${badgeCount} items` : ""}`}
          >
            <View style={styles.iconWrap}>
              <Ionicons
                name={isActive ? item.activeIcon : item.icon}
                size={21}
                color={isActive ? theme.accent : theme.textMuted}
              />
              {badgeCount > 0 && (
                <View style={[styles.badge, { backgroundColor: theme.accent }]}>
                  <Text style={styles.badgeText}>{badgeCount > 9 ? "9+" : badgeCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabText,
                { color: isActive ? theme.accent : theme.textMuted },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 7,
    paddingBottom: 5,
    paddingHorizontal: 5,
    gap: 2,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    paddingVertical: 3,
  },
  iconWrap: {
    height: 25,
    minWidth: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -3,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: "#fff",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
  },
  tabText: {
    fontWeight: "700",
    fontSize: 10,
    marginTop: 2,
  },
});
