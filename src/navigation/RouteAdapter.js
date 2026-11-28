import { router, useLocalSearchParams } from "expo-router";

const routePaths = {
  Splash: "/",
  Login: "/login",
  Menu: "/menu",
  FoodDetail: "/food-detail",
  Cart: "/cart",
  Checkout: "/checkout",
  Orders: "/orders",
  Reservations: "/reservations",
  OrderTracking: "/order-tracking",
  Profile: "/profile",
  Review: "/review",
  Dashboard: "/dashboard",
};

function parseParam(value) {
  if (typeof value !== "string") return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function encodeParams(params = {}) {
  const result = {};
  if (params.item) result.item = JSON.stringify(params.item);
  if (params.order) result.order = JSON.stringify(params.order);
  return result;
}

export function useRouteAdapter() {
  const params = useLocalSearchParams();
  const navigation = {
    navigate(name, routeParams) {
      const path = routePaths[name];
      if (!path) return;
      router.navigate({ pathname: path, params: encodeParams(routeParams) });
    },
    push(name, routeParams) {
      const path = routePaths[name];
      if (!path) return;
      router.push({ pathname: path, params: encodeParams(routeParams) });
    },
    replace(name, routeParams) {
      const path = routePaths[name];
      if (path) router.replace({ pathname: path, params: encodeParams(routeParams) });
    },
    reset(state) {
      const firstRoute = state?.routes?.[0]?.name;
      const path = routePaths[firstRoute];
      if (path) router.replace(path);
    },
    goBack() {
      if (router.canGoBack()) router.back();
      else router.replace("/menu");
    },
  };

  return {
    navigation,
    route: {
      params: {
        item: parseParam(params.item),
        order: parseParam(params.order),
      },
    },
  };
}