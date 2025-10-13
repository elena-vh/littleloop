import React, { useState } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Card } from '../ui/Card';
import { Body } from '../ui/Text';
import { useTasks } from '@src/store/tasks';
import AddTaskIcon from '@assets/icons/plus.svg';
import EmptyStateCard from '../ui/EmptyStateCard';
import AddTaskModal from './AddTaskModal';
const Tasks = () => {
  const { tasks, toggle, remove } = useTasks();
  const today = new Date().toISOString().slice(0, 10);
  const todays = tasks.filter((t) => t.dueDate === today && !t.done);
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <View>
      <View style={styles.header}>
        <Body style={styles.title}>Tasks</Body>
        <Pressable
          onPress={() => setIsModalVisible(true)}
          accessibilityLabel='Add task'
          style={styles.plusButton}>
          <AddTaskIcon />
        </Pressable>
      </View>
      <View>
        {tasks.length === 0 ? (
          <EmptyStateCard message='No tasks yet - just cozy vibes.' />
        ) : (
          tasks.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => toggle(t.id)}
              onLongPress={() => remove(t.id)}>
              <Text
                style={{
                  textDecorationLine: t.done ? 'line-through' : 'none',
                }}>
                {t.text}
              </Text>
            </Pressable>
          ))
        )}
      </View>
      <AddTaskModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'Lexend_600SemiBold',
    fontSize: 20,
  },
  plusButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default Tasks;
