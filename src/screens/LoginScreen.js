import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import users from "../data/users";
import { useCart } from "../context/CartContext";

export default function LoginScreen({ navigation }) {
  const { theme } = useCart();
  const [mode, setMode] = useState("login");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer");

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearError = (field) => {
    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (
      password.length < 8 ||
      !/\d/.test(password)
    ) {
      newErrors.password =
        "Password must be 8+ characters and contain a digit";
    }

    if (mode === "signup") {
      if (!fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }

      if (!confirmPassword) {
        newErrors.confirmPassword =
          "Confirm password is required";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword =
          "Passwords do not match";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (mode === "login") {
        const user = users.find(
          (item) =>
            item.email.toLowerCase() === email.trim().toLowerCase() &&
            item.password === password
        );

        setIsSubmitting(false);

        if (!user) {
          Alert.alert(
            "Login Failed",
            "Invalid email or password."
          );
          return;
        }

        if (user.role === "customer") {
          navigation.navigate("Menu");
        } else {
          navigation.navigate("Dashboard");
        }
      } else {
        setIsSubmitting(false);

        Alert.alert(
          "Signup Successful",
          `Account created for ${fullName}.`
        );

        setMode("login");
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
      }
    }, 1000);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.brandMark, { backgroundColor: theme.accentSoft }]}>
        <Ionicons name="restaurant" size={27} color={theme.accent} />
      </View>
      <Text style={[styles.title, { color: theme.text }]}>Bite & Bliss</Text>

      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
        {mode === "login" ? "Welcome Back!" : "Create Account"}
      </Text>

      {mode === "signup" && (
        <>
          <TextInput
            style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
            placeholder="Full Name"
            placeholderTextColor={theme.textMuted}
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              clearError("fullName");
            }}
          />

          {errors.fullName ? (
            <Text style={[styles.error, { color: theme.danger }]}>{errors.fullName}</Text>
          ) : null}
        </>
      )}

      <TextInput
        style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
        placeholder="Email"
        placeholderTextColor={theme.textMuted}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          clearError("email");
        }}
      />

      {errors.email ? (
        <Text style={[styles.error, { color: theme.danger }]}>{errors.email}</Text>
      ) : null}

      <View style={[styles.passwordContainer, { backgroundColor: theme.input, borderColor: theme.border }]}>
        <TextInput
          style={[styles.passwordInput, { color: theme.text }]}
          placeholder="Password"
          placeholderTextColor={theme.textMuted}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            clearError("password");
          }}
        />

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          accessibilityLabel={showPassword ? "Hide password" : "Show password"}
        >
          <Text style={[styles.showButton, { color: theme.accent }]}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      </View>

      {errors.password ? (
        <Text style={[styles.error, { color: theme.danger }]}>{errors.password}</Text>
      ) : null}

      {mode === "signup" && (
        <>
          <TextInput
            style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
            placeholder="Confirm Password"
            placeholderTextColor={theme.textMuted}
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              clearError("confirmPassword");
            }}
          />

          {errors.confirmPassword ? (
            <Text style={[styles.error, { color: theme.danger }]}>
              {errors.confirmPassword}
            </Text>
          ) : null}

          <Text style={[styles.roleTitle, { color: theme.text }]}>
            Select Role
          </Text>

          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                { backgroundColor: theme.panel, borderColor: theme.border },
                role === "customer" && styles.selectedRole,
              ]}
              onPress={() => setRole("customer")}
            >
              <Text style={{ color: theme.text }}>Customer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                { backgroundColor: theme.panel, borderColor: theme.border },
                role === "manager" && styles.selectedRole,
              ]}
              onPress={() => setRole("manager")}
            >
              <Text style={{ color: theme.text }}>Manager</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton,
          { backgroundColor: theme.accent },
          isSubmitting && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitText}>
            {mode === "login" ? "Login" : "Create Account"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setMode(mode === "login" ? "signup" : "login");
          setErrors({});
        }}
      >
          <Text style={[styles.switchText, { color: theme.accent }]}>
          {mode === "login"
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingBottom: 36,
  },

  brandMark: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 14,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 17,
    textAlign: "center",
    marginBottom: 25,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    minHeight: 50,
    marginTop: 10,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 50,
    marginTop: 10,
  },

  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
  },

  showButton: {
    paddingHorizontal: 12,
    fontWeight: "bold",
  },

  error: {
    color: "red",
    marginTop: 5,
    marginLeft: 3,
  },

  roleTitle: {
    marginTop: 18,
    fontWeight: "bold",
  },

  roleContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  roleButton: {
    flex: 1,
    padding: 14,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
  },

  selectedRole: {
    borderWidth: 2,
  },

  submitButton: {
    backgroundColor: "#222222",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 22,
    minHeight: 50,
    justifyContent: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
  },

  switchText: {
    textAlign: "center",
    marginTop: 20,
    fontWeight: "bold",
  },
});