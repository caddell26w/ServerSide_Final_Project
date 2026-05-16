import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: "modal"}}/>
        <Stack.Screen name="index" options={{ title: 'Welcome! Please register an account with us below.', 
                                              headerStyle: { backgroundColor: '#042130'}, 
                                              headerTitleStyle: {color: '#CCB414'},
                                              headerLeft: () => null}}/>
        <Stack.Screen name="login" options={{ title: 'Welcome! Please log in to your account.', 
                                              headerStyle: { backgroundColor: '#042130'}, 
                                              headerTitleStyle: {color: '#CCB414'},
                                              headerLeft: () => null}}/>
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}