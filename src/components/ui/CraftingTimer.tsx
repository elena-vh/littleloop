import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type SoftPulseTimerProps = {
  initialSeconds?: number; // restore later per project
};

const COLORS = {
  pink: '#FFB3DC',
  pinkGlow: '#FFB3DC',
  text: '#2B2B2F',
  blackPill: '#171415',
  white: '#FFFFFF',
};

const FONTS = {
  serif: 'Fraunces_400Regular',
  uiBold: 'Quicksand_700Bold',
};

function pad2(n: number) {
  return String(n).padStart(2, '0');
}
function formatHMMSS(totalSeconds: number) {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return h > 0 ? `${h}:${pad2(m)}:${pad2(r)}` : `${m}:${pad2(r)}`;
}

export function SoftPulseTimer({ initialSeconds = 0 }: SoftPulseTimerProps) {
  const [elapsed, setElapsed] = React.useState(initialSeconds);
  const [running, setRunning] = React.useState(false);

  // Tick
  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  return (
    <View style={styles.wrap}>
      <SoftPulseCircle running={running} label={formatHMMSS(elapsed)} />

      <View style={styles.controls}>
        <Pressable
          onPress={() => setElapsed((s) => s + 60)}
          hitSlop={10}
          style={styles.textBtn}>
          <Text style={styles.textBtnText}>+1 min</Text>
        </Pressable>

        <Pressable
          onPress={() => setRunning((r) => !r)}
          hitSlop={10}
          style={styles.controlPill}>
          <Text style={styles.controlIcon}>{running ? 'Ⅱ' : '▶'}</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            setRunning(false);
            setElapsed(0);
          }}
          hitSlop={10}
          style={styles.textBtn}>
          <Text style={[styles.textBtnText, { opacity: 0.6 }]}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SoftPulseCircle({
  running,
  label,
}: {
  running: boolean;
  label: string;
}) {
  // gentle pulse (slow + subtle)
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);
  const PULSE_MS = 2100;

  React.useEffect(() => {
    if (!running) {
      cancelAnimation(scale);
      cancelAnimation(glow);
      scale.value = 1;
      glow.value = 0;
      return;
    }

    scale.value = withRepeat(
      withSequence(
        withTiming(1.035, {
          duration: PULSE_MS,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(1.0, {
          duration: PULSE_MS,
          easing: Easing.inOut(Easing.quad),
        })
      ),
      -1,
      true
    );

    glow.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: PULSE_MS,
          easing: Easing.inOut(Easing.quad),
        }),
        withTiming(0, { duration: PULSE_MS, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      true
    );
  }, [running, scale, glow]);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // We’ll “breathe” the blur halo too (opacity + slight scale)
  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.45 * glow.value, // stronger than before because blur softens it
    transform: [{ scale: 1.02 + glow.value * 0.05 }],
  }));

  return (
    <View style={circleStyles.wrap}>
      <BlurView intensity={100} tint='light' style={circleStyles.haloBlur} />
      {/* Real blurred halo */}
      <Animated.View
        style={[circleStyles.haloWrap, haloStyle]}
        pointerEvents='none'>
        {/* tint layer so the blur actually looks pink, not gray */}
        <View style={circleStyles.haloTint} />
      </Animated.View>
      <Animated.View
        style={[circleStyles.halo1, haloStyle]}
        pointerEvents='none'
      />
      <Animated.View
        style={[circleStyles.halo2, haloStyle]}
        pointerEvents='none'
      />
      <Animated.View
        style={[circleStyles.halo3, haloStyle]}
        pointerEvents='none'
      />
      <Animated.View
        style={[circleStyles.halo4, haloStyle]}
        pointerEvents='none'
      />
      {/* main circle */}
      <Animated.View style={[circleStyles.circle, circleStyle]}>
        <Text style={circleStyles.time}>{label}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  controls: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  textBtn: {
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  textBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 18,
    color: COLORS.text,
  },
  controlPill: {
    width: 124,
    height: 56,
    borderRadius: 999,
    backgroundColor: COLORS.blackPill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: FONTS.uiBold,
    marginTop: -1,
  },
});

const circleStyles = StyleSheet.create({
  wrap: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo1: {
    position: 'absolute',
    width: 206,
    height: 206,
    borderRadius: 999,
    backgroundColor: 'rgba(255,179,220,0.20)',
  },
  halo2: {
    position: 'absolute',
    width: 222,
    height: 222,
    borderRadius: 999,
    backgroundColor: 'rgba(255,179,220,0.14)',
  },
  halo3: {
    position: 'absolute',
    width: 242,
    height: 242,
    borderRadius: 999,
    backgroundColor: 'rgba(255,179,220,0.10)',
  },
  halo4: {
    position: 'absolute',
    width: 268,
    height: 268,
    borderRadius: 999,
    backgroundColor: 'rgba(255,179,220,0.07)',
  },
  // Blurred “soft margin” halo container
  haloWrap: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    overflow: 'hidden', // important for blur edge to stay circular
  },
  haloBlur: {
    ...StyleSheet.absoluteFill,
  },
  haloTint: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,179,220,0.55)', // pink wash
  },

  circle: {
    width: 190,
    height: 190,
    borderRadius: 999,
    backgroundColor: 'rgba(255,179,220,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontFamily: FONTS.serif,
    fontSize: 52,
    color: COLORS.text,
    letterSpacing: 0.4,
  },
});
