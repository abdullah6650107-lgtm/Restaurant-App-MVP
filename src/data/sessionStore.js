import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "restaurantapp.session";

export async function getSessionToken() {
  if (Platform.OS === "web") {
    return AsyncStorage.getItem(SESSION_KEY);
  }

  try {
    const secureToken = await SecureStore.getItemAsync(SESSION_KEY);
    if (secureToken) return secureToken;
  } catch {
    // Continue with the legacy token so users are not unexpectedly signed out.
  }

  const legacyToken = await AsyncStorage.getItem(SESSION_KEY);
  if (!legacyToken) return null;

  try {
    await SecureStore.setItemAsync(SESSION_KEY, legacyToken);
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch {
    // Keep the legacy value if secure migration is unavailable on this device.
  }
  return legacyToken;
}

export async function saveSessionToken(token) {
  if (Platform.OS === "web") {
    await AsyncStorage.setItem(SESSION_KEY, token);
    return;
  }

  await SecureStore.setItemAsync(SESSION_KEY, token);
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function clearSessionToken() {
  await AsyncStorage.removeItem(SESSION_KEY);
  if (Platform.OS !== "web") {
    try {
      await SecureStore.deleteItemAsync(SESSION_KEY);
    } catch {
      // The key may not exist on this installation.
    }
  }
}