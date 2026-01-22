import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useEffect } from 'react';
import {
  useFonts,
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';
import {
  Mulish_400Regular,
  Mulish_600SemiBold,
  Mulish_700Bold,
  Mulish_800ExtraBold,
} from '@expo-google-fonts/mulish';
import {
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_600SemiBold,
  Lexend_500Medium,
} from '@expo-google-fonts/lexend';

import {
  Fraunces_300Light,
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
  Fraunces_800ExtraBold,
  Fraunces_900Black,
} from '@expo-google-fonts/fraunces';
import { ThemeProvider } from '@src/theme/ThemeProvider';
import { migrate } from '@src/db/migrate';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    migrate();
  }, []);

  const [loaded] = useFonts({
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
    Fraunces_300Light,
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Fraunces_800ExtraBold,
    Fraunces_900Black,
    Lexend_400Regular,
    Lexend_600SemiBold,
    Lexend_700Bold,
    Lexend_500Medium,
    Mulish_400Regular,
    Mulish_600SemiBold,
    Mulish_700Bold,
    Mulish_800ExtraBold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null; // 👈 prevents flash/mis-style

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              headerTitleStyle: { fontFamily: 'Quicksand_600SemiBold' },
              headerLargeTitleStyle: { fontFamily: 'Quicksand_700Bold' },
            }}
          />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
