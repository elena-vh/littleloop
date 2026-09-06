import { View, Text } from 'react-native';
import { color, font } from '@src/theme/theme';

// Placeholder — rebuilt in Step 3.6 (avatar, stat tiles, Settings section).
// The old light/dark switcher lived here and was removed with the theme collapse.
export default function Profile() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.bg,
        paddingTop: 64,
        paddingHorizontal: 22,
      }}>
      <Text style={{ fontFamily: font.heading, fontSize: 30, color: color.text }}>
        Profile
      </Text>
    </View>
  );
}
