import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const Task = ({ children, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.task}>
      {children}
    </Pressable>
  );
};
export default Task;

const styles = StyleSheet.create({
  task: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 80,
    backgroundColor: 'white',
    borderRadius: 16, // rounded corners
    padding: 24,
    marginVertical: 2,
    marginHorizontal: 16,
    justifyContent: 'flex-start',
  },
});
