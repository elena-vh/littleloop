import { Pressable, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { spacing } from '@src/theme/tokens';

export default function TaskRow({
  task,
  onDelete,
  onToggle,

  openTask,
}: {
  task: { id: string; text: string; done: boolean };
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  openTask: (task: { id: string; text: string; done: boolean }) => void;
}) {
  const R = 20;

  const renderRightActions = () => (
    <Pressable
      onPress={() => onDelete(task.id)}
      style={{
        width: 90,
        backgroundColor: '#E33',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 0, // ✅ flat shared edge
      }}>
      <Text style={{ color: 'white', fontWeight: '800' }}>Delete</Text>
    </Pressable>
  );

  return (
    <View style={{ marginHorizontal: 12, marginBottom: 8 }}>
      <View
        style={{
          borderRadius: R,
          overflow: 'hidden',
          //   borderColor: '#DDDDD',

          // iOS shadow
          shadowColor: 'red',
          shadowOpacity: 1,
          shadowRadius: 18,
          shadowOffset: { width: 10, height: 10 },

          // Android shadow
          elevation: 30,
        }}>
        <Swipeable
          renderRightActions={renderRightActions}
          overshootRight={false}>
          <View
            style={{
              backgroundColor: '#fff',
              padding: spacing.lg,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 0,
            }}>
            <Pressable
              onPress={() => onToggle(task.id)}
              hitSlop={12}
              style={{
                width: 20,
                height: 20,
                borderRadius: 17,
                borderWidth: 1,
                borderColor: task.done ? '#111' : '#111',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: task.done ? '#111' : 'transparent',
              }}
              accessibilityRole='checkbox'
              accessibilityState={{ checked: task.done }}
              accessibilityLabel={
                task.done ? 'Mark as not done' : 'Mark as done'
              }>
              <Text
                style={{
                  color: task.done ? 'white' : 'transparent',
                  fontSize: 18,
                }}>
                ✓
              </Text>
            </Pressable>
            <Pressable
              onPress={() => openTask(task)}
              style={{ flex: 1, paddingLeft: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Mulish_600SemiBold',
                  color: task.done ? '#6B7280' : '#5C5C5C',
                  opacity: task.done ? 0.6 : 1,
                  textDecorationLine: task.done ? 'line-through' : 'none',
                }}>
                {task.text}
              </Text>
            </Pressable>

            {/* Right: checkbox */}
          </View>
        </Swipeable>
      </View>
    </View>
  );
}
