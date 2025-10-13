import React from 'react';
import { View, Text, Button } from 'react-native';
import usePrefs from '../store/usePrefs';

export default function HomeScreen() {
  const showLogTime = usePrefs((s) => s.showLogTime);
  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: 'center' }}>
      {showLogTime ? <Button title='+ Log time' onPress={() => {}} /> : null}
      <Text>Welcome! Start a project or open Tools.</Text>
    </View>
  );
}
