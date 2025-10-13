import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
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
} from '@expo-google-fonts/mulish';
import {
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_600SemiBold,
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

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
    Mulish_400Regular,
    Mulish_600SemiBold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null; // 👈 prevents flash/mis-style

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerTitleStyle: { fontFamily: 'Quicksand_600SemiBold' },
          headerLargeTitleStyle: { fontFamily: 'Quicksand_700Bold' },
        }}
      />
    </ThemeProvider>
  );
}
