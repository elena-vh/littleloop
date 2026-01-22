import { Project } from '@src/db/projectsRepo';
import { spacing } from '@src/theme/tokens';
import { Pressable, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

export default function ProjectRow({
  project,
  onDelete,
}: {
  project: Project;
  onDelete: (id: string) => void;
}) {
  const renderRightActions = () => (
    <Pressable
      onPress={() => onDelete(project.id)}
      style={{
        width: 90,
        backgroundColor: '#E33',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ color: 'white', fontWeight: '800' }}>Delete</Text>
    </Pressable>
  );
  return (
    <View style={{ marginHorizontal: spacing.md, marginTop: spacing.sm }}>
      <Swipeable renderRightActions={renderRightActions} overshootRight={false}>
        <Pressable
          style={{
            padding: 14,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: '#eee',
          }}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>
            {project.name}
          </Text>

          <Text style={{ color: '#777', marginTop: 4 }}>
            {project.craft} · {project.tags?.join(', ') || 'No tags'}
          </Text>

          {project.targetMeasurement ? (
            <Text style={{ color: '#777', marginTop: 4 }}>
              Target: {project.targetMeasurement}
            </Text>
          ) : null}
        </Pressable>
      </Swipeable>
    </View>
  );
}
