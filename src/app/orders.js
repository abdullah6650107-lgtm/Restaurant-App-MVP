import React from "react";
import OrdersScreen from "../screens/OrdersScreen";
import { useRouteAdapter } from "../navigation/RouteAdapter";

export default function Route() {
  const { navigation, route } = useRouteAdapter();
  return <OrdersScreen navigation={navigation} route={route} />;
}