import React, { useCallback, useState } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { Card } from '../ui/Card';
import { Body } from '../ui/Text';
import { Task, useTasks } from '@src/store/tasks';
import AddTaskIcon from '@assets/icons/fi-br-plus.svg';
import TrashIcon from '@assets/icons/trash.svg';
import EmptyStateCard from '../ui/EmptyStateCard';
import AddTaskModal from './AddTaskModal';
import AddTaskInput from './AddTaskInput';
import { spacing } from '@src/theme/tokens';
import { listProjects, deleteProject } from '@src/db/projectsRepo';
import TaskRow from './TaskRow';
import { useFocusEffect } from 'expo-router';

const Tasks = () => {
  const { tasks } = useTasks();
  const today = new Date().toISOString().slice(0, 10);
  const todays = tasks.filter((t) => t.dueDate === today && !t.done);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTaskInputVisible, setIsTaskInputVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [text, setText] = useState('');

  // const refresh = useCallback(() => {
  //   setProjects(listProjects());
  // }, []);
  const handleDelete = (id: string) => {
    Alert.alert('Delete project?', 'This will remove it from your list.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          remove(id);
          //  refresh();
        },
      },
    ]);
  };
  console.log({ text });
  const openAdd = () => {
    setSelectedTask(null);
    setText(''); // ✅ reset draft
    setIsTaskInputVisible(true);
  };
  const openEdit = (task: Task) => {
    setSelectedTask(task);
    setText(task.text); // ✅ load draft from saved task
    setIsModalVisible(true);
  };
  const toggle = useTasks((s) => s.toggle);
  const remove = useTasks((s) => s.remove);

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Body style={styles.title}>Tasks</Body>
        <Pressable
          onPress={openAdd}
          accessibilityLabel='Add task'
          style={styles.plusButton}>
          <AddTaskIcon width={20} />
        </Pressable>
      </View>
      <View>
        {tasks.length === 0 ? (
          <EmptyStateCard message='No tasks yet - just cozy vibes.' />
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TaskRow
                onToggle={toggle}
                task={item}
                openTask={openEdit}
                onDelete={handleDelete}
              />
            )}
          />
        )}
      </View>
      <AddTaskModal
        onDelete={() => selectedTask && remove(selectedTask.id)}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        defaultText={selectedTask?.text ?? ''}
        setText={setText}
        text={text}
        selectedTask={selectedTask}
      />
      <AddTaskInput
        openModal={() => setIsModalVisible(true)}
        visible={isTaskInputVisible}
        onClose={() => setIsTaskInputVisible(false)}
        defaultText={selectedTask?.text}
        setText={setText}
        text={text}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    display: 'flex',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Fraunces_600SemiBold',
    fontSize: 20,
  },
  plusButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
});
export default Tasks;
