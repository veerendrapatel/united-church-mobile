import React from "react";
import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";
import IntroScreen from "./IntroScreen";
import NotificationsScreen from "./NotificationsScreen";
import AddPostScreen from "./AddPostScreen";
import AccountScreen from "./AccountScreen";
import HomeScreen from "./HomeScreen";
import NewsFeedScreen from "./NewsFeedScreen";

const AppStack = createBottomTabNavigator({
  NewsFeed: NewsFeedScreen,
  Notifications: NotificationsScreen,
  AddPost: AddPostScreen,
  Account: AccountScreen
});
const AuthStack = createStackNavigator({
  Intro: IntroScreen
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: HomeScreen,
      App: AppStack,
      Auth: AuthStack
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
