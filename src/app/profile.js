import React from "react";
import ProfileScreen from "../screens/ProfileScreen";
import { useRouteAdapter } from "../navigation/RouteAdapter";

export default function Route() {
  const { navigation, route } = useRouteAdapter();
  return <ProfileScreen navigation={navigation} route={route} />;
}