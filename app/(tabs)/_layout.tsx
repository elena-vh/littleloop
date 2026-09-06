import { Stack } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StyleSheet, View, Text } from 'react-native';

import HomeActive from '../../assets/home.svg';
import HomeInactive from '../../assets/icons/homeinactive.svg';

import ProjectsActive from '../../assets/icons/projectsactive.svg';
import ProjectsInactive from '../../assets/icons/projectsinactive.svg';

import YarnActive from '../../assets/icons/yarnactive.svg';
import YarnInactive from '../../assets/icons/yarninactive.svg';

import ProfileActive from '../../assets/icons/profileactive.svg';
import ProfileInactive from '../../assets/icons/profileinactive.svg';

import Yarn from '../../assets/icons/yarn.svg';
// import Profile from '../../assets/icons/profile.svg';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@src/theme/ThemeProvider';
import { colors } from '@src/theme/tokens';

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.terracotta,
          tabBarInactiveTintColor: 'none', // ← gray
          tabBarLabelStyle: {
            color: '#6a6a6a',
            fontFamily: 'Quicksand', // pick the weight you like
            fontSize: 12, // tweak as needed
            letterSpacing: 0.2, // optional, Quicksand looks nice with a touch of spacing
          },
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'white',
            borderTopWidth: 0,
            // iOS shadow (casts upward)
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: -6 },
            elevation: 12,
            height: 80,
            paddingTop: 6,
          },
        }}>
        <Tabs.Screen
          name='index'
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <HomeActive
                  width={size}
                  height={size}
                  color={color}
                  stroke={color}
                />
              ) : (
                <HomeInactive
                  width={size}
                  height={size}
                  color={color}
                  stroke={color}
                />
              ),
          }}
        />
        <Tabs.Screen
          name='projects'
          options={{
            title: 'Projects',
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <ProjectsActive
                  width={size}
                  height={size}
                  color={color}
                  stroke={color}
                />
              ) : (
                <ProjectsInactive
                  width={size}
                  height={size}
                  color={color}
                  stroke={color}
                />
              ),
          }}
        />
        <Tabs.Screen
          name='yarn'
          options={{
            title: 'Yarn',
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <YarnActive
                  width={size}
                  height={size}
                  color={color}
                  stroke={color}
                />
              ) : (
                <YarnInactive
                  width={size}
                  height={size}
                  color={color}
                  stroke={color}
                />
              ),
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <ProfileActive
                  width={size}
                  height={size}
                  color={color}
                  stroke={color}
                />
              ) : (
                <ProfileInactive
                  width={size}
                  height={size}
                  color={color}
                  stroke={color}
                />
              ),
          }}
        />
      </Tabs>
      {/* <BottomInsetBackground /> */}
    </>
  );
}
