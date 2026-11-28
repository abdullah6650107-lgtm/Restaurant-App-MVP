import { useCallback, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFERENCES_STORAGE_KEY = "restaurantapp.preferences";

export function useTheme() {
  const systemTheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(systemTheme === "dark");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    async function restorePreferences() {
      try {
        const storedPreferences = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);
        const preferences = storedPreferences ? JSON.parse(storedPreferences) : null;
        if (active && typeof preferences?.darkMode === "boolean") {
          setDarkMode(preferences.darkMode);
        }
      } catch {
        // Invalid local cache should not prevent the menu or account screens from opening.
      } finally {
        if (active) setIsHydrated(true);
      }
    }

    restorePreferences();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify({ darkMode })
    ).catch(() => {
      // Persistence is best effort; the active session remains usable.
    });
  }, [darkMode, isHydrated]);

  const theme = useMemo(
    () =>
      darkMode
        ? {
            background: "#121916",
            panel: "#1B2420",
            panelAlt: "#25302B",
            text: "#f8fafc",
            textMuted: "#B7C2BB",
            border: "#35423B",
            input: "#121916",
            accent: "#E47B5D",
            accentSoft: "#3B2B27",
            success: "#69B99A",
            danger: "#E87878",
          }
        : {
            background: "#F4F5F1",
            panel: "#ffffff",
            panelAlt: "#F7F8F5",
            text: "#202923",
            textMuted: "#68736C",
            border: "#DDE3DD",
            input: "#ffffff",
            accent: "#C8563F",
            accentSoft: "#FBEAE6",
            success: "#2F8064",
            danger: "#C94747",
          },
    [darkMode]
  );

  const toggleDarkMode = useCallback(
    () => setDarkMode((current) => !current),
    []
  );

  return { darkMode, setDarkMode, theme, toggleDarkMode };
}
