import React from "react";
import FoodDetailScreen from "../screens/FoodDetailScreen";
import { useRouteAdapter } from "../navigation/RouteAdapter";

export default function Route() {
  const { navigation, route } = useRouteAdapter();
  return <FoodDetailScreen navigation={navigation} route={route} />;
}