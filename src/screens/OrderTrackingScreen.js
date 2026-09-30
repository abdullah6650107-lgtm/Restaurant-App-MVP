import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useCart } from "../context/CartContext";

const statusSteps = ["Confirmed", "Preparing", "On the Way", "Delivered"];

export default function OrderTrackingScreen({ route, navigation }) {
  const { orderHistory, theme } = useCart();
  const routeOrder = route.params?.order;
  const order = orderHistory.find((item) => item.id === routeOrder?.id) || routeOrder;
  const currentStatus = order?.status || "Confirmed";
  const statusIndex = statusSteps.indexOf(currentStatus);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.eyebrow, { color: theme.accent }]}>LIVE ORDER UPDATE</Text>
      <Text style={[styles.title, { color: theme.text }]}>On its way to you</Text>

      <View style={[styles.summaryCard, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>Current status</Text>
        <Text style={[styles.summaryValue, { color: theme.accent }]}>{currentStatus}</Text>
        <Text style={[styles.summaryMeta, { color: theme.textMuted }]}>Order #{order?.id || "--"}</Text>
        <Text style={[styles.summaryMeta, { color: theme.textMuted }]}>Total: Rs {order?.total || 0}</Text>
        <Text style={[styles.summaryMeta, { color: theme.textMuted }]}>{order?.items?.length || 0} dishes</Text>
      </View>

      <View style={styles.timeline}>
        {statusSteps.map((step, index) => {
          const isDone = index <= statusIndex;

          return (
            <View
              key={step}
              style={[
                styles.step,
                {
                  backgroundColor: isDone ? theme.accentSoft : theme.panel,
                  borderColor: isDone ? theme.accent : theme.border,
                },
              ]}
            >
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: isDone ? theme.accent : theme.panel,
                    borderColor: isDone ? theme.accent : theme.border,
                  },
                ]}
              />
              <View style={styles.stepTextWrap}>
                <Text style={[styles.stepTitle, { color: theme.text }]}>{step}</Text>
                <Text style={[styles.stepHint, { color: theme.textMuted }]}>
                  {index === statusIndex ? "In progress" : isDone ? "Completed" : "Pending"}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: theme.accent }]}
        onPress={() => navigation.navigate("Orders")}
      >
        <Text style={styles.backButtonText}>Back to orders</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    marginBottom: 18,
  },
  summaryCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
  },
  summaryLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 25,
    fontWeight: "800",
  },
  summaryMeta: {
    fontSize: 13,
    marginTop: 6,
  },
  timeline: {
    gap: 10,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  dot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    marginRight: 12,
    borderWidth: 2,
  },
  stepTextWrap: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "800",
  },
  stepHint: {
    fontSize: 12,
    marginTop: 2,
  },
  backButton: {
    marginTop: 20,
    minHeight: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
});
