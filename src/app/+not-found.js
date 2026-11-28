import React from "react";
import { View, Text } from "react-native";
import { Link } from "expo-router";

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 8 }}>Page not found</Text>
      <Text style={{ marginBottom: 16 }}>This page is not available.</Text>
      <Link href="/menu" replace>
        <Text style={{ color: "#C8563F", fontWeight: "700" }}>Return to menu</Text>
      </Link>
    </View>
  );
}