import React from "react";
import CartScreen from "../screens/CartScreen";
import { useRouteAdapter } from "../navigation/RouteAdapter";

export default function Route() {
  const { navigation, route } = useRouteAdapter();
  return <CartScreen navigation={navigation} route={route} />;
}