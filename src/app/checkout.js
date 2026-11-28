import React from "react";
import CheckoutScreen from "../screens/CheckoutScreen";
import { useRouteAdapter } from "../navigation/RouteAdapter";

export default function Route() {
  const { navigation, route } = useRouteAdapter();
  return <CheckoutScreen navigation={navigation} route={route} />;
}