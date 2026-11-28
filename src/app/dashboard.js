import React from "react";
import DashboardScreen from "../screens/DashboardScreen";
import { useRouteAdapter } from "../navigation/RouteAdapter";

export default function Route() {
  const { navigation, route } = useRouteAdapter();
  return <DashboardScreen navigation={navigation} route={route} />;
}