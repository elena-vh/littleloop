import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, LayoutGrid, Spool, User } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import { color, font } from '@src/theme/theme';

const ACTIVE = color.acc[700];
const INACTIVE = color.neutral[600];

function TabItem({
  Icon,
  label,
  focused,
}: {
  Icon: LucideIcon;
  label: string;
  focused: boolean;
}) {
  const tint = focused ? ACTIVE : INACTIVE;
  return (
    <View style={styles.item}>
      <Icon size={24} strokeWidth={2.75} color={tint} />
      <Text style={[styles.label, { color: tint }]}>{label}</Text>
      <View
        style={[
          styles.dot,
          { backgroundColor: focused ? color.accent : 'transparent' },
        ]}
      />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: color.neutral[100],
          borderTopWidth: 1,
          borderTopColor: color.divider,
          elevation: 0,
          shadowOpacity: 0,
          height: 58 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom || 12,
        },
        tabBarIconStyle: { flex: 1 },
      }}>
      <Tabs.Screen
        name='index'
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabItem Icon={House} label='Home' focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='projects'
        options={{
          title: 'Projects',
          tabBarIcon: ({ focused }) => (
            <TabItem Icon={LayoutGrid} label='Projects' focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='yarn'
        options={{
          title: 'Yarn',
          tabBarIcon: ({ focused }) => (
            <TabItem Icon={Spool} label='Yarn' focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabItem Icon={User} label='Profile' focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minWidth: 66,
    minHeight: 44,
  },
  label: {
    fontFamily: font.bodySemi,
    fontSize: 11,
    lineHeight: 12,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
});
