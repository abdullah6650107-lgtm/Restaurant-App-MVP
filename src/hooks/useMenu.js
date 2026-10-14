import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../data/api";

export function useMenu(favorites) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [menu, setMenu] = useState([]);
  const [menuError, setMenuError] = useState("");
  const [menuLoading, setMenuLoading] = useState(true);

  const categories = useMemo(() => {
    const menuCategories = new Map();
    menu.forEach((item) => {
      const label = item.category?.trim();
      const key = label?.toLowerCase();
      if (key && key !== "all" && !menuCategories.has(key)) {
        menuCategories.set(key, label);
      }
    });

    return [
      { key: "all", label: "All" },
      ...Array.from(menuCategories, ([categoryKey, label]) => ({
        key: `category:${categoryKey}`,
        label,
      })),
      { key: "favorites", label: "Favorites" },
    ];
  }, [menu]);

  const loadMenu = useCallback(async () => {
    setMenuLoading(true);
    setMenuError("");
    try {
      const { items } = await api.getMenu();
      setMenu(items);
    } catch (error) {
      setMenuError(error.message);
    } finally {
      setMenuLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.getMenu()
      .then(({ items }) => {
        if (active) setMenu(items);
      })
      .catch((error) => {
        if (active) setMenuError(error.message);
      })
      .finally(() => {
        if (active) setMenuLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredMenu = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    return menu.filter((item) => {
      const categoryMatch =
        selectedCategory === "all" ||
        (selectedCategory === "favorites"
          ? favorites.includes(item.id)
          : `category:${item.category?.trim().toLowerCase()}` === selectedCategory);

      const searchMatch =
        !normalizedSearch ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch);

      return categoryMatch && searchMatch;
    });
  }, [favorites, menu, selectedCategory, searchText]);

  return {
    selectedCategory,
    setSelectedCategory,
    searchText,
    setSearchText,
    menu,
    menuError,
    menuLoading,
    categories,
    filteredMenu,
    loadMenu,
  };
}
