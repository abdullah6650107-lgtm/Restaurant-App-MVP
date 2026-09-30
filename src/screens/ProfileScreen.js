import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import BottomNav from "../components/BottomNav";

export default function ProfileScreen({ navigation }) {
  const { theme, darkMode, toggleDarkMode } = useCart();
  const accountLinks = [
    { label: "Order history", detail: "Track recent deliveries", icon: "receipt-outline", screen: "Orders" },
    { label: "Reservations", detail: "Manage your table bookings", icon: "calendar-outline", screen: "Reservations" },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Your account</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>Profile and preferences</Text>

      <View style={[styles.profileCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <View style={[styles.avatar, { backgroundColor: theme.accentSoft }]}>
          <Text style={[styles.avatarText, { color: theme.accent }]}>A</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.name, { color: theme.text }]}>Abdullah</Text>
          <Text style={[styles.info, { color: theme.textMuted }]}>customer@example.com</Text>
          <Text style={[styles.role, { color: theme.accent }]}>CUSTOMER</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Your activity</Text>
      <View style={[styles.linkGroup, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        {accountLinks.map((link, index) => (
          <TouchableOpacity
            key={link.screen}
            style={[styles.linkRow, index > 0 && { borderTopColor: theme.border, borderTopWidth: 1 }]}
            onPress={() => navigation.navigate(link.screen)}
            accessibilityRole="button"
          >
            <View style={[styles.linkIcon, { backgroundColor: theme.accentSoft }]}>
              <Ionicons name={link.icon} size={19} color={theme.accent} />
            </View>
            <View style={styles.linkCopy}>
              <Text style={[styles.item, { color: theme.text }]}>{link.label}</Text>
              <Text style={[styles.detail, { color: theme.textMuted }]}>{link.detail}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>
      <View style={[styles.settingRow, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <View style={[styles.linkIcon, { backgroundColor: theme.accentSoft }]}>
          <Ionicons name={darkMode ? "moon-outline" : "sunny-outline"} size={19} color={theme.accent} />
        </View>
        <View style={styles.linkCopy}>
          <Text style={[styles.item, { color: theme.text }]}>Dark appearance</Text>
          <Text style={[styles.detail, { color: theme.textMuted }]}>{darkMode ? "On" : "Off"}</Text>
        </View>
        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: theme.border, true: theme.accent }}
          thumbColor="#fff"
          accessibilityLabel="Toggle dark appearance"
        />
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: theme.danger }]}
        onPress={() => navigation.navigate("Login")}
      >
        <Ionicons name="log-out-outline" size={18} color={theme.danger} />
        <Text style={[styles.logoutText, { color: theme.danger }]}>Log out</Text>
      </TouchableOpacity>
      </ScrollView>
      <BottomNav navigation={navigation} activeTab="Profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    padding: 18,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 25,
    fontWeight: "800",
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
  },
  info: {
    marginTop: 3,
    fontSize: 13,
  },
  role: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: 7,
  },
  linkGroup: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 10,
  },
  item: {
    fontSize: 14,
    fontWeight: "700",
  },
  linkRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },
  linkIcon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  linkCopy: {
    flex: 1,
  },
  detail: {
    fontSize: 12,
    marginTop: 3,
  },
  settingRow: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 22,
  },
  logoutButton: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoutText: {
    fontWeight: "800",
    fontSize: 14,
  },
});
