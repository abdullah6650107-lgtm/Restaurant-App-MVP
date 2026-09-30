import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNav from "../components/BottomNav";
import { useCart } from "../context/CartContext";

const timeSlots = ["12:00 PM", "1:30 PM", "3:00 PM", "6:00 PM", "7:30 PM", "9:00 PM"];

export default function ReservationScreen({ navigation }) {
  const { reservations, addReservation, cancelReservation, theme } = useCart();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(timeSlots[0]);
  const [guests, setGuests] = useState(2);

  const bookTable = () => {
    const reservationDate = new Date(`${date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!name.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(reservationDate.getTime())) {
      Alert.alert("Check your details", "Enter your name and a date in YYYY-MM-DD format.");
      return;
    }

    if (reservationDate < today) {
      Alert.alert("Choose a future date", "Reservations cannot be made for a past date.");
      return;
    }

    addReservation({ name: name.trim(), date, time, guests });
    setName("");
    Alert.alert("Table reserved", `Your table for ${guests} is booked for ${date} at ${time}.`);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Reserve a Table</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>Choose a date and dining time.</Text>

        <View style={[styles.form, { backgroundColor: theme.panel, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.text }]}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={theme.textMuted}
            style={[styles.input, { color: theme.text, backgroundColor: theme.input, borderColor: theme.border }]}
          />

          <Text style={[styles.label, { color: theme.text }]}>Date</Text>
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD, e.g. 2026-10-12"
            placeholderTextColor={theme.textMuted}
            keyboardType="numbers-and-punctuation"
            style={[styles.input, { color: theme.text, backgroundColor: theme.input, borderColor: theme.border }]}
          />

          <Text style={[styles.label, { color: theme.text }]}>Time</Text>
          <View style={styles.slots}>
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot}
                onPress={() => setTime(slot)}
                accessibilityRole="radio"
                accessibilityState={{ selected: time === slot }}
                style={[
                  styles.slot,
                  { backgroundColor: theme.panelAlt, borderColor: theme.border },
                  time === slot && { backgroundColor: theme.accent, borderColor: theme.accent },
                ]}
              >
                <Text style={[styles.slotText, { color: time === slot ? "#fff" : theme.text }]}>{slot}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, { color: theme.text }]}>Guests</Text>
          <View style={styles.guestRow}>
            <TouchableOpacity
              accessibilityLabel="Remove one guest"
              style={[styles.guestButton, { backgroundColor: theme.panelAlt }]}
              onPress={() => setGuests((count) => Math.max(1, count - 1))}
              accessibilityRole="button"
            >
              <Text style={[styles.guestButtonText, { color: theme.text }]}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.guestCount, { color: theme.text }]}>{guests}</Text>
            <TouchableOpacity
              accessibilityLabel="Add one guest"
              style={[styles.guestButton, { backgroundColor: theme.panelAlt }]}
              onPress={() => setGuests((count) => Math.min(12, count + 1))}
              accessibilityRole="button"
            >
              <Text style={[styles.guestButtonText, { color: theme.text }]}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.bookButton, { backgroundColor: theme.accent }]} onPress={bookTable}>
            <Text style={styles.bookButtonText}>Confirm Reservation</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Reservations</Text>
        {reservations.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>No reservations yet.</Text>
        ) : (
          reservations.map((reservation) => (
            <View
              key={reservation.id}
              style={[styles.reservation, { backgroundColor: theme.panel, borderColor: theme.border }]}
            >
              <View style={styles.reservationInfo}>
                <Text style={[styles.reservationName, { color: theme.text }]}>{reservation.name}</Text>
                <Text style={[styles.reservationMeta, { color: theme.textMuted }]}>
                  {reservation.date} at {reservation.time} · {reservation.guests} guests
                </Text>
              </View>
              <TouchableOpacity onPress={() => cancelReservation(reservation.id)}>
                <Text style={[styles.cancelText, { color: theme.danger }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      <BottomNav navigation={navigation} activeTab="Reservations" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 18, paddingBottom: 28 },
  title: { fontSize: 28, fontWeight: "bold" },
  subtitle: { marginTop: 4, marginBottom: 18 },
  form: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 24 },
  label: { fontWeight: "700", marginBottom: 8, marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12 },
  slots: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slot: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 9 },
  slotText: { fontSize: 12, fontWeight: "700" },
  guestRow: { flexDirection: "row", alignItems: "center", gap: 18 },
  guestButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 8 },
  guestButtonText: { fontSize: 22, fontWeight: "700" },
  guestCount: { fontSize: 18, fontWeight: "700", minWidth: 20, textAlign: "center" },
  bookButton: { marginTop: 20, padding: 14, alignItems: "center", borderRadius: 8 },
  bookButtonText: { color: "#fff", fontWeight: "700" },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  emptyText: { marginBottom: 18 },
  reservation: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 10, padding: 14, marginBottom: 10 },
  reservationInfo: { flex: 1, paddingRight: 8 },
  reservationName: { fontWeight: "700", marginBottom: 4 },
  reservationMeta: { fontSize: 12 },
  cancelText: { color: "#dc2626", fontWeight: "700" },
});