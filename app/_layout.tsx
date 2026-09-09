import '../global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import {
  Fraunces_400Regular,
  Fraunces_700Bold,
  Fraunces_900Black,
} from '@expo-google-fonts/fraunces';
import {
  Figtree_400Regular,
  Figtree_600SemiBold,
  Figtree_700Bold,
} from '@expo-google-fonts/figtree';

import { ThemeProvider } from '@src/theme/ThemeProvider';
import { font } from '@src/theme/theme';
import { migrate } from '@src/db/migrate';
import { useTasks } from '@src/store/tasks';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    migrate();
    useTasks.getState().load();
  }, []);

  const [loaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_700Bold,
    Fraunces_900Black,
    Figtree_400Regular,
    Figtree_600SemiBold,
    Figtree_700Bold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              headerTitleStyle: { fontFamily: font.bodySemi },
              headerLargeTitleStyle: { fontFamily: font.heading },
            }}
          />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
