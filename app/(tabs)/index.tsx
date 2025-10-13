import { useGreeting } from '@src/hooks/useGreeting';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import HeaderShape from '@assets/header.svg';
import { Body } from '@src/components/ui/Text';
import { Card } from '@src/components/ui/Card';
import { Button } from '@src/components/ui/Button';
import { usePrefs } from '@src/store/prefs';
import { useTasks } from '@src/store/tasks';
import Screen from '@src/components/ui/Screen';
import { spacing } from '@src/theme/tokens';
import KnittingTodayCard from '@src/components/home/KnittingTodayCard';
import Tasks from '@src/components/home/Tasks';
import { useState } from 'react';
export default function Home() {
  const name = usePrefs((s) => s.name);
  const greeting = useGreeting(name);
  return (
    <Screen>
      <View style={styles.header}>
        <HeaderShape
          width='100%' // make it stretch to screen width
          height={240} // or whatever height fits your design
          preserveAspectRatio='xMidYMid slice'
        />
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>{greeting}</Text>
        </View>
        <KnittingTodayCard />
      </View>
      <Tasks />
      {/* <Card>
        <Body>Today's tasks</Body>
        <View style={{ height: 8 }} />
        {todays.length === 0 ? (
          <Text style={{ opacity: 0.6 }}>Nothing for today.</Text>
        ) : (
          todays.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => toggle(t.id)}
              style={{ paddingVertical: 6 }}>
              <Text
                style={{
                  textDecorationLine: t.done ? 'line-through' : 'none',
                }}>
                {t.text}
              </Text>
            </Pressable>
          ))
        )}
      </Card> */}
    </Screen>
  );
}
const styles = StyleSheet.create({
  header: {
    position: 'relative',
  },
  headerContent: {
    position: 'absolute',
    top: 60,
    left: spacing.xl,
  },

  greeting: {
    fontFamily: 'Fraunces_700Bold',
    fontSize: 22,
    color: 'white',
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});
