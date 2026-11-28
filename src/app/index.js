import React from "react";
import SplashScreen from "../screens/SplashScreen";
import { useRouteAdapter } from "../navigation/RouteAdapter";

export default function Route() {
  const { navigation, route } = useRouteAdapter();
  return <SplashScreen navigation={navigation} route={route} />;
}