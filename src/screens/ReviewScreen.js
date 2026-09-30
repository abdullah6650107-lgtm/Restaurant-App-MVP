import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";

export default function ReviewScreen({ navigation }) {
  const { theme } = useCart();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  const submitReview = () => {
    if (!review.trim()) {
      Alert.alert("Please add a review");
      return;
    }

    Alert.alert("Thanks!", `Your ${rating}-star review was submitted.`);
    setReview("");
    setRating(5);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.eyebrow, { color: theme.accent }]}>BITE & BLISS</Text>
      <Text style={[styles.title, { color: theme.text }]}>How was your meal?</Text>
      <Text style={[styles.subtitle, { color: theme.textMuted }]}>Your feedback helps us make every order better.</Text>

      <View style={[styles.ratingPanel, { backgroundColor: theme.panel, borderColor: theme.border }]}>
        <Text style={[styles.ratingLabel, { color: theme.text }]}>Your rating</Text>
        <View style={styles.ratingRow}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity
            key={value}
            onPress={() => setRating(value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: rating === value }}
            accessibilityLabel={`${value} ${value === 1 ? "star" : "stars"}`}
            style={styles.starButton}
          >
            <Ionicons name={rating >= value ? "star" : "star-outline"} size={31} color={rating >= value ? theme.accent : theme.border} />
          </TouchableOpacity>
        ))}
        </View>
        <Text style={[styles.ratingHint, { color: theme.textMuted }]}>{rating} out of 5</Text>
      </View>

      <TextInput
        style={[styles.input, { backgroundColor: theme.panel, borderColor: theme.border, color: theme.text }]}
        value={review}
        onChangeText={setReview}
        multiline
        placeholder="What did you enjoy? Anything we could do better?"
        placeholderTextColor={theme.textMuted}
        textAlignVertical="top"
        maxLength={500}
      />
      <Text style={[styles.characterCount, { color: theme.textMuted }]}>{review.length}/500</Text>

      <TouchableOpacity style={[styles.button, { backgroundColor: theme.accent }]} onPress={submitReview}>
        <Text style={styles.buttonText}>Submit Review</Text>
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 26,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 7,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 20,
  },
  ratingPanel: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 14,
  },
  ratingLabel: {
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: "row",
    gap: 9,
  },
  starButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingHint: {
    marginTop: 8,
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 140,
    padding: 14,
    lineHeight: 20,
  },
  characterCount: {
    fontSize: 11,
    textAlign: "right",
    marginTop: 6,
    marginBottom: 18,
  },
  button: {
    minHeight: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
});
