import { useGreeting } from '@src/hooks/useGreeting';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';

import HeaderShape from '@assets/header.svg';

import { usePrefs } from '@src/store/prefs';
import Screen from '@src/components/ui/Screen';
import { spacing } from '@src/theme/tokens';
import KnittingStreakCard from '@src/components/home/KnittingTodayCard';
import Tasks from '@src/components/home/Tasks';
import { useState } from 'react';
import CurrentProjects from '@src/components/home/CurrentProjects';
import { DailyCheckInMinimalCard } from '@src/components/home/DailyCheckInCard';

export default function Home() {
  const name = usePrefs((s) => s.name);

  const greeting = useGreeting(name);

  const [projectsMenuOpen, setProjectsMenuOpen] = useState(false);

  return (
    <>
      <FlatList
        data={[]}
        keyExtractor={() => 'noop'}
        renderItem={null}
        keyboardShouldPersistTaps='handled'
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <HeaderShape
                width='100%'
                height={240}
                style={{ top: -50 }}
                preserveAspectRatio='xMidYMid slice'
              />
              {/* <View style={{ height: 160 }} /> */}
              {/* <View style={styles.headerContent}>
                <Text style={styles.greeting}>{greeting}</Text>
              </View> */}
              {/* <KnittingStreakCard /> */}
              <DailyCheckInMinimalCard
                greeting={greeting}
                streakCount={1}
                selectedDayLabel='Mo'
                checkedInToday={true}
                onPressBegin={() => {
                  // navigate to check-in flow / modal
                  console.log('Begin check-in');
                }}
                onPressProfile={() => {
                  console.log('Open profile');
                }}
                onPressStreak={() => {
                  console.log('Open streak / stats');
                }}
              />
            </View>

            <CurrentProjects onPressPlus={() => setProjectsMenuOpen(true)} />
            <Tasks />
          </>
        }
      />

      <ProjectsMenuModal
        visible={projectsMenuOpen}
        onClose={() => setProjectsMenuOpen(false)}
      />
    </>
  );
}
function ProjectsMenuModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const go = (craft: 'crochet' | 'knitting') => {
    onClose();
    requestAnimationFrame(() => {
      router.push({
        pathname: '/create-project/project-basics',
        params: { craft },
      });
    });
  };

  // onPress:
  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      // onRequestClose={onClose}>
    >
      <View style={styles.backdrop}>
        <View style={styles.menuSurface}>
          <View style={styles.cardsRow}>
            <Pressable style={styles.card} onPress={() => go('crochet')}>
              <Text style={styles.cardTitle}>Crochet</Text>
            </Pressable>

            <Pressable style={styles.card}>
              <Text style={styles.cardTitle}>Knitting</Text>
              {/* image here */}
            </Pressable>
          </View>

          <Pressable style={styles.primaryButton}>
            {/* <RoundedButton /> */}
            <Text style={styles.primaryButtonText}>New Counter</Text>
          </Pressable>

          <Pressable onPress={onClose} style={styles.closeFab} hitSlop={12}>
            <Text style={{ fontSize: 22 }}>✕</Text>
          </Pressable>
        </View>

        {/* Optional: tap outside to close.
            Remove this Pressable block if you *only* want the X to close. */}
        {/* <Pressable style={StyleSheet.absoluteFill} onPress={onClose} /> */}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  kittyCrochet: { bottom: 20 },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 18,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 22, fontWeight: '700' },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // this is your “menu open” screen area
  menuSurface: {
    width: 800,
    marginTop: 200,
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 450,
    borderTopRightRadius: 450,
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },

  cardsRow: { flexDirection: 'row', gap: 16, marginBottom: 26 },
  card: {
    width: 130,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 14,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // shadow-ish
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardTitle: {
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 10,
    // fontFamily: 'Lexend_500Medium',
    // fontFamily: 'Fraunces_700Bold',
    fontFamily: 'Quicksand_600SemiBold',
    color: '#707070',
  },

  primaryButton: {
    width: '25%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#282929',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Quicksand_700Bold',
  },

  closeFab: {
    position: 'absolute',
    bottom: 30,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuRoot: {
    flex: 1,
    backgroundColor: '#f3f4f6', // your light bg
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuCardsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  bigButton: {
    width: 280,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#111',
  },

  closeFabInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ddd',
  },
  header: {
    position: 'relative',
    marginBottom: -40,
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
