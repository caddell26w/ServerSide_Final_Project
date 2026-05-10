import { Platform, StyleSheet, View, Text} from 'react-native';

export default function HomeScreen() {
    return (
        <View
        style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
        <Text>Friends</Text>
        </View>
    )
}