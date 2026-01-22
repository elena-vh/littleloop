import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './Tabs';
import ProjectBasicsScreen from '@app/screens/CreateProject/ProjectBasicsScreen';
import Home from '@app/(tabs)';
import MaterialsScreen from '@app/screens/CreateProject/MaterialsScreen';
import PlanTrackScreen from '@app/screens/CreateProject/PlanTrackScreen';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Tabs: undefined;
  ProjectBasics: { craft?: 'crochet' | 'knitting' } | undefined;
  Materials: { craft?: 'crochet' | 'knitting' } | undefined;
};
export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name='create-project/project-basics'
          component={ProjectBasicsScreen}
        />
        <Stack.Screen
          name='create-project/materials'
          component={MaterialsScreen}
        />
        <Stack.Screen
          name='create-project/plan-track'
          component={PlanTrackScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
