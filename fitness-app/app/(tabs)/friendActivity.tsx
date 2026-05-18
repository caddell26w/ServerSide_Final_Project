import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';

import { useLocalSearchParams } from 'expo-router';

const url = 'http://192.168.0.108:8429';

type ActivityItem = {
  workoutName: string;
  workoutDate: string;
};

export default function FriendActivity() {

  const { friendUsername } = useLocalSearchParams();
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  async function getFriendActivity() {
    try {
      const response = await fetch(
        `${url}/friendActivity/${friendUsername}`,
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      const json = await response.json();

      if (json.status === 'SUCCESS') {
        setActivity(json.body.workoutsList);
      }

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getFriendActivity();
  }, [friendUsername]);

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        {friendUsername}'s Activity
      </Text>

      {activity.map((item, index) => (
        <Text
          key={index}
          style={styles.activityText}
        >
          {item.workoutName} - {item.workoutDate}
        </Text>
      ))}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b2f42',
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight
        : 0,
    padding: 20
  },

  title: {
    color: '#D2B80F',
    fontSize: 24,
    marginBottom: 20
  },

  activityText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10
  }
});