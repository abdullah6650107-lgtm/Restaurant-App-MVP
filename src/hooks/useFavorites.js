import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_STORAGE_KEY = "restaurantapp.favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    async function restoreFavorites() {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
        if (active && Array.isArray(parsedFavorites)) setFavorites(parsedFavorites);
      } catch {
        // Invalid local cache should not prevent the menu or account screens from opening.
      } finally {
        if (active) setIsHydrated(true);
      }
    }

    restoreFavorites();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites)).catch(() => {
      // Persistence is best effort; the active session remains usable.
    });
  }, [favorites, isHydrated]);

  const toggleFavorite = useCallback((productId) => {
    setFavorites((currentFavorites) =>
      currentFavorites.includes(productId)
        ? currentFavorites.filter((id) => id !== productId)
        : [...currentFavorites, productId]
    );
  }, []);

  return { favorites, setFavorites, toggleFavorite };
}
