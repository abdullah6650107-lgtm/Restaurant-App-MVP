import React from "react";
import OrderTrackingScreen from "../screens/OrderTrackingScreen";
import { useRouteAdapter } from "../navigation/RouteAdapter";

export default function Route() {
  const { navigation, route } = useRouteAdapter();
  return <OrderTrackingScreen navigation={navigation} route={route} />;
}