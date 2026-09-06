import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Check, Plus } from 'lucide-react-native';
import { color, font, radius } from '@src/theme/theme';
import { Task, useTasks } from '@src/store/tasks';
import AddTaskInput from './AddTaskInput';
import AddTaskModal from './AddTaskModal';

function TaskPill({
  task,
  onToggle,
  onOpen,
}: {
  task: Task;
  onToggle: () => void;
  onOpen: () => void;
}) {
  return (
    <View style={styles.pill}>
      <Pressable
        onPress={onToggle}
        hitSlop={12}
        accessibilityRole='checkbox'
        accessibilityState={{ checked: task.done }}
        style={[styles.box, task.done ? styles.boxDone : styles.boxOpen]}>
        {task.done && (
          <Check size={13} strokeWidth={3.4} color={color.bg} />
        )}
      </Pressable>
      <Pressable style={styles.textWrap} onPress={onOpen}>
        <Text
          style={[styles.text, task.done && styles.textDone]}
          numberOfLines={2}>
          {task.text}
        </Text>
      </Pressable>
    </View>
  );
}

export default function TodayTasks() {
  const tasks = useTasks((s) => s.tasks);
  const toggle = useTasks((s) => s.toggle);
  const remove = useTasks((s) => s.remove);

  const [inputVisible, setInputVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selected, setSelected] = useState<Task | null>(null);
  const [text, setText] = useState('');

  const openAdd = () => {
    setSelected(null);
    setText('');
    setInputVisible(true);
  };
  const openEdit = (task: Task) => {
    setSelected(task);
    setText(task.text);
    setEditVisible(true);
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.heading}>Today</Text>
        <Pressable
          onPress={openAdd}
          style={styles.addBtn}
          accessibilityRole='button'
          accessibilityLabel='Add task'>
          <Plus size={19} strokeWidth={2.75} color={color.acc[800]} />
        </Pressable>
      </View>

      {tasks.length === 0 ? (
        <View style={styles.emptyPill}>
          <Text style={styles.emptyText}>No tasks yet — just cozy vibes.</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {tasks.map((t) => (
            <TaskPill
              key={t.id}
              task={t}
              onToggle={() => toggle(t.id)}
              onOpen={() => openEdit(t)}
            />
          ))}
        </View>
      )}

      <AddTaskInput
        visible={inputVisible}
        onClose={() => setInputVisible(false)}
        openModal={() => setEditVisible(true)}
        defaultText={selected?.text}
        setText={setText}
        text={text}
      />
      <AddTaskModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        onDelete={() => selected && remove(selected.id)}
        defaultText={selected?.text ?? ''}
        setText={setText}
        text={text}
        selectedTask={selected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  heading: { fontFamily: font.heading, fontSize: 19, color: color.text },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: color.acc[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { gap: 10 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 52,
    paddingVertical: 15,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOpen: { borderWidth: 2, borderColor: color.neutral[400] },
  boxDone: { backgroundColor: color.acc2[600] },
  textWrap: { flex: 1 },
  text: { fontFamily: font.body, fontSize: 14.5, color: color.text },
  textDone: {
    color: color.neutral[600],
    textDecorationLine: 'line-through',
  },
  emptyPill: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    backgroundColor: color.surface,
  },
  emptyText: { fontFamily: font.body, fontSize: 14.5, color: color.neutral[600] },
});
