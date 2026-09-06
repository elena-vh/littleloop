import { Pressable } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import KittyOnButton from '@assets/kitty_on_button.svg';

export default function NoProjects() {
  return (
    <View
      style={{
        // backgroundColor: '#81A6D1',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {/* <LinearGradient
        colors={colors}
        locations={locations}
        // style={styles.overlay}
      /> */}
      <LinearGradient
        style={StyleSheet.absoluteFill}
        colors={['#ECEEDF', '#81A6D1']}
      />
      <Text style={styles.title}>You are a star knitter.</Text>
      <Text style={styles.sublabel}>
        Tap the + button below to start your first project.
      </Text>
      <View style={styles.buttonWrapper}>
        <KittyOnButton width={150} style={styles.kitty} />
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Start a new project +</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  buttonWrapper: {
    position: 'relative',
    top: 100,
    width: '80%',
  },
  kitty: { top: 55, zIndex: 1, left: 45 },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#282929',
    fontSize: 16,
    fontFamily: 'Quicksand_700Bold',
  },

  title: {
    fontFamily: 'Fraunces_600SemiBold',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
    position: 'absolute',
    width: '90%',
    fontSize: 24,
    // backgroundColor: 'linear-gradient(#ECEEDF, #81A6D1)', // your light bg
    top: 280,
    color: 'white',
  },
  sublabel: {
    textAlign: 'center',
    fontFamily: 'Fraunces_600SemiBold',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    width: '90%',
    fontSize: 18,
    // backgroundColor: 'linear-gradient(#ECEEDF, #81A6D1)', // your light bg
    top: 350,
    color: 'white',
  },
});
