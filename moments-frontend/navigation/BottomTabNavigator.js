import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import LinksScreen from "../screens/LinksScreen";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = "Home";

export default function BottomTabNavigator({ navigation, route }) {
  navigation.setOptions({ headerTitle: "Moments" });
  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        color="red"
        name="Home"
        component={HomeScreen}
        options={{
          title: "Upload a Photo",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-add" />
        }}
      />
      <BottomTab.Screen
        name="Links"
        component={LinksScreen}
        options={{
          title: "Albums",
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />
        }}
      />
    </BottomTab.Navigator>
  );
}
