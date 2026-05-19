import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Text, Pressable} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';


import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
    const router = useRouter();
  
  const navigation = useNavigation()

  const [user, setUser] = useState('')

  useEffect(() => {
    fetch('https://localhost:8429/getUser', {credentials: 'include'})
    .then((response) => response.json())
    .then((json) => {{json.status === 'ERROR'? (() => {throw (json.body)})(): setUser(json.body.user)}})
    .catch((error) => {
        console.error('Error:', error)
        navigation.getParent()?.navigate('index')
    })
  })
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0b2f42',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text 
      style={{
        fontSize: 24,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontWeight: '700',
        color: '#D2B80F',
        margin: 8, 
        }}>
        Welcome {user} to your fitness app experience!</Text>
        <View
        style={{
          flex: 1,
          width: '100%',
          flexDirection: 'column'
        }}>
          <View
          style={{
            flex: 1,
            flexDirection: 'row',
            width: '100%'
          }}>
            <Pressable
            onPress={() => router.navigate('/startWorkout')}
            style={{
              width: '50%'
            }}>
              <Text style={styles.homeButtons}>
                Begin your daily workout
              </Text>
            </Pressable>
            <Pressable
            onPress={() => router.navigate('/friends')}
            style={{
              width: '50%'
            }}>
              <Text style={styles.homeButtons}>
                View your current friends or send friend requests
              </Text>
            </Pressable>
          </View>
          <View
          style={{
            flexDirection: 'row',
            flex: 1,
          }}>
            <Pressable
            onPress={() => router.navigate('/mode')}
            style={{
              width: '50%',
            }}>
              <Text style={styles.homeButtons}>
              Edit your workouts for this week
              </Text>
            </Pressable>
            <Pressable
            onPress={() => router.navigate('/activity')}
            style={{
              width: '50%'
            }}>
              <Text style={styles.homeButtons}>
              View your recent activity
              </Text>
            </Pressable>
          </View>
          <View
          style={{
            flex: 1,
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center'
          }}>
            <Pressable
            onPress={() => router.navigate('/settings')}
            style={{
              width: '50%'
            }}>
              <Text style={styles.homeButtons}>
              Update your account settings
              </Text>
            </Pressable>
          </View>
        </View>
    </View>

  //   <ParallaxScrollView
  //     headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
  //     headerImage={
  //       <Image
  //         source={require('@/assets/images/partial-react-logo.png')}
  //         style={styles.reactLogo}
  //       />
  //     }>
  //     <ThemedView style={styles.titleContainer}>
  //       <ThemedText type="title">Welcome!</ThemedText>
  //       <HelloWave />
  //     </ThemedView>
  //     <ThemedView style={styles.stepContainer}>
  //       <ThemedText type="subtitle">Step 1: Try it</ThemedText>
  //       <ThemedText>
  //         Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
  //         Press{' '}
  //         <ThemedText type="defaultSemiBold">
  //           {Platform.select({
  //             ios: 'cmd + d',
  //             android: 'cmd + m',
  //             web: 'F12',
  //           })}
  //         </ThemedText>{' '}
  //         to open developer tools.
  //       </ThemedText>
  //     </ThemedView>
  //     <ThemedView style={styles.stepContainer}>
  //       <Link href="/modal">
  //         <Link.Trigger>
  //           <ThemedText type="subtitle">Step 2: Explore</ThemedText>
  //         </Link.Trigger>
  //         <Link.Preview />
  //         <Link.Menu>
  //           <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
  //           <Link.MenuAction
  //             title="Share"
  //             icon="square.and.arrow.up"
  //             onPress={() => alert('Share pressed')}
  //           />
  //           <Link.Menu title="More" icon="ellipsis">
  //             <Link.MenuAction
  //               title="Delete"
  //               icon="trash"
  //               destructive
  //               onPress={() => alert('Delete pressed')}
  //             />
  //           </Link.Menu>
  //         </Link.Menu>
  //       </Link>

  //       <ThemedText>
  //         {`Tap the Explore tab to learn more about what's included in this starter app.`}
  //       </ThemedText>
  //     </ThemedView>
  //     <ThemedView style={styles.stepContainer}>
  //       <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
  //       <ThemedText>
  //         {`When you're ready, run `}
  //         <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
  //         <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
  //         <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
  //         <ThemedText type="defaultSemiBold">app-example</ThemedText>.
  //       </ThemedText>
  //     </ThemedView>
  //   </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  homeButtons: {
    display: 'flex',
    flex: 1,
    margin: 24,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontSize: Platform.OS === 'web'? 28: 14,
    fontWeight: '500',
    color: '#D2B80F',
    textAlign: 'center',
    textTransform: 'uppercase',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 48, 
    borderColor: '#0f4e70',
    backgroundColor: '#054161',
  },
});