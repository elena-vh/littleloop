import React, { useCallback, useState } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Card } from '../ui/Card';
import { Body } from '../ui/Text';
import { Task, useTasks } from '@src/store/tasks';
import AddTaskIcon from '@assets/icons/plus.svg';
import TrashIcon from '@assets/icons/trash.svg';
import EmptyStateCard from '../ui/EmptyStateCard';
import AddTaskModal from './AddTaskInput';
import AddTaskInput from './AddTaskInput';
import SwipeableTaskRow from './Task';
import { spacing } from '@src/theme/tokens';
import { Project, listProjects } from '@src/db/projectsRepo';
import { useFocusEffect } from 'expo-router';
import ProjectsList from './ProjectsList';

const CurrentProjects = ({ onPressPlus }) => {
  const { tasks, toggle, remove } = useTasks();
  const today = new Date().toISOString().slice(0, 10);
  const todays = tasks.filter((t) => t.dueDate === today && !t.done);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTaskInputVisible, setIsTaskInputVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [text, setText] = useState(selectedTask?.text || '');
  console.log('ALL PROJECTS:', listProjects());
  console.log({ text });

  return (
    <View>
      <View style={styles.header}>
        <Body style={styles.title}>Current Projects</Body>
        <Pressable
          onPress={onPressPlus}
          accessibilityLabel='Add project'
          style={styles.plusButton}>
          <AddTaskIcon />
        </Pressable>
      </View>
      <View>
        <ProjectsList />
      </View>
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
  },
});
export default CurrentProjects;
