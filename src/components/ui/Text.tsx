import { Text, TextProps } from 'react-native';
import { typography } from '@src/theme/typography';

export function Heading(props: TextProps) {
  return <Text {...props} style={[typography.heading, props.style]} />;
}

export function Body(props: TextProps) {
  return <Text {...props} style={[typography.body, props.style]} />;
}
