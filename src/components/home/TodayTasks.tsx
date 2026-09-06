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
    <View style={styles.row}>
      <Pressable
        onPress={onToggle}
        hitSlop={12}
        accessibilityRole='checkbox'
        accessibilityState={{ checked: task.done }}
        style={[styles.box, task.done ? styles.boxDone : styles.boxOpen]}>
        {task.done && (
          <Check size={12} strokeWidth={3.4} color={color.bg} />
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
        <Text style={styles.emptyText}>Nothing today.</Text>
      ) : (
        <View style={styles.list}>
          {tasks.map((t, i) => (
            <View key={t.id}>
              {i > 0 && <View style={styles.divider} />}
              <TaskPill
                task={t}
                onToggle={() => toggle(t.id)}
                onOpen={() => openEdit(t)}
              />
            </View>
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
  heading: { fontFamily: font.heading, fontSize: 17, color: color.text },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: color.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 48,
    paddingVertical: 12,
  },
  divider: { height: 1, backgroundColor: color.divider },
  box: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOpen: { borderWidth: 1.5, borderColor: color.neutral[400] },
  boxDone: { backgroundColor: color.acc2[600], borderColor: color.acc2[600] },
  textWrap: { flex: 1 },
  text: { fontFamily: font.body, fontSize: 14, color: color.text },
  textDone: {
    color: color.neutral[600],
    textDecorationLine: 'line-through',
  },
  emptyText: {
    fontFamily: font.serif,
    fontSize: 14,
    color: color.neutral[600],
  },
});
