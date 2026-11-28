import React from "react";
import ReviewScreen from "../screens/ReviewScreen";
import { useRouteAdapter } from "../navigation/RouteAdapter";

export default function Route() {
  const { navigation, route } = useRouteAdapter();
  return <ReviewScreen navigation={navigation} route={route} />;
}