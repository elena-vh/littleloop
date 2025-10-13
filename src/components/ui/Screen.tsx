import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@src/theme/ThemeProvider';

type Props = {
  scroll?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: any;
};

export default function Screen({ scroll, children, className, style }: Props) {
  const { theme, isDark } = useTheme();
  const Wrap = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Wrap
        className={`${isDark ? 'dark' : ''} ${className ?? ''}`}
        style={[{ flex: 1 }, style]}
        contentContainerStyle={scroll ? { paddingBottom: 24 } : undefined}>
        {children}
      </Wrap>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  backgroundTop: {
    backgroundColor: 'hsla(212, 47%, 66%, 1)',

    // background: 'linear-gradient(180deg, hsla(212, 47%, 66%, 1) 0%, hsla(0, 0%, 100%, 1) 7%)',

    // background: '-moz-linear-gradient(180deg, hsla(212, 47%, 66%, 1) 0%, hsla(0, 0%, 100%, 1) 7%)',

    // background: '-webkit-linear-gradient(180deg, hsla(212, 47%, 66%, 1) 0%, hsla(0, 0%, 100%, 1) 7%)',

    filter:
      'progid: DXImageTransform.Microsoft.gradient( startColorstr="#81A6D1", endColorstr="#FFFFFF", GradientType=1 )',
  },
});
