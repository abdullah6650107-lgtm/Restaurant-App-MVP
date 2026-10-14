import React from "react";
import MenuScreen from "../screens/MenuScreen";
import { useRouteAdapter } from "../navigation/RouteAdapter";

export default function Route() {
  const { navigation, route } = useRouteAdapter();
  return <MenuScreen navigation={navigation} route={route} />;
}