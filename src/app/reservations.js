import React from "react";
import ReservationScreen from "../screens/ReservationScreen";
import { useRouteAdapter } from "../navigation/RouteAdapter";

export default function Route() {
  const { navigation, route } = useRouteAdapter();
  return <ReservationScreen navigation={navigation} route={route} />;
}