import React from "react";
import { View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from 'react-native-vector-icons/EvilIcons'; // For Eva Icons
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'; // For Clarity Icons
import Icon3 from 'react-native-vector-icons/FontAwesome6'; // For Font Awesome 6

import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
import Login from "./components/Login/LoginForm";
import Register from "./components/Register";

import Group from './components/groups';
import Dashboard from './components/Dashboard';
import CreateGroup from "./components/groups/createGroup";
import ViewGroup from "./components/groups/viewGroup";
import Profile from "./components/Profile";
import AddExpense from "./components/Expense/addExpense";
import EditExpense from "./components/Expense/editExpense";
import { ViewExpense } from "./components/Expense/viewExpense";
import { EditGroup } from "./components/groups/editGroup";
import NotificationComp from "./components/notification";

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const DashboardTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => <Icon name="chart" color={color} size={size} />, 
        }}
      />
      <Tab.Screen
        name="Groups"
        component={Group}
        options={{
          tabBarLabel: "Groups",
          tabBarIcon: ({ color, size }) => <Icon2 name="account-group" color={color} size={size} />, 
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => <Icon3 name="user" solid color={color} size={size} />, 
        }}
      />
    </Tab.Navigator>
  );
};

// Main Navigation
export default function AppNavigation() {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={"LoginPage"}
          screenOptions={{ headerShown: false }}
        >
          {/* Auth Stack */}
          <Stack.Screen name="LogoOnlyLayout" component={LogoOnlyLayout} />
          <Stack.Screen name={"LoginPage"} component={Login} />
          <Stack.Screen name={"RegisterPage"} component={NotificationComp} />
          <Stack.Screen name={"DashboardHome"} component={DashboardTabs} />
          <Stack.Screen name ={"CreateGroupPage"} component={CreateGroup}/>
          <Stack.Screen name={"ViewGroupPage"} component={ViewGroup}/>
          <Stack.Screen name={"AddExpense"} component={AddExpense} />
          <Stack.Screen name={"EditExpense"} component={EditExpense} />
          <Stack.Screen name={"ViewExpense"} component={ViewExpense} />
          <Stack.Screen name={"EditGroup"} component={EditGroup} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}