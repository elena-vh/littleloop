import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProjectsScreen from '../screens/ProjectsScreen';
import ToolsScreen from '../screens/ToolsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HomeSvg from '@/assets/icons/home.svg';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Projects' component={ProjectsScreen} />
      <Tab.Screen name='Tools' component={ToolsScreen} />
      <Tab.Screen name='Settings' component={SettingsScreen} />
    </Tab.Navigator>
  );
}
