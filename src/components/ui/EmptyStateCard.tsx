import { View, Text, StyleSheet } from 'react-native';

const EmptyStateCard = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 3.5,
    borderColor: '#DDDDDD', // light gray from your mock
    borderStyle: 'dashed',
    borderRadius: 16, // rounded corners
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 16,
    color: '#555',
  },
});
export default EmptyStateCard;
