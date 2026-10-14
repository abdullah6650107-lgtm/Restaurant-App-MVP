import React from "react";
import LoginScreen from "../screens/LoginScreen";
import { useRouteAdapter } from "../navigation/RouteAdapter";

export default function Route() {
  const { navigation, route } = useRouteAdapter();
  return <LoginScreen navigation={navigation} route={route} />;
}