import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import LinksScreen from "../screens/LinksScreen";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator({ navigation }) {
  navigation.setOptions({
    headerTitle: "Moments",
    headerStyle: styles.nav,
    headerTitleStyle: {
      color: "white",
      fontWeight: "bold",
      fontSize: 30
    }
  });
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ activeTintColor: "black", style: styles.nav }}
    >
      <BottomTab.Screen
        color="red"
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-add" />,
          title: "Upload a Photo",
          unmountOnBlur: false
        }}
      />
      <BottomTab.Screen
        name="Links"
        component={LinksScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
          title: "Albums",
          unmountOnBlur: true
        }}
      />
    </BottomTab.Navigator>
  );
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: "#3EC4CA",
    borderWidth: 0
  }
});
