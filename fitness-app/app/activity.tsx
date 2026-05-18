import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, Platform, View, StatusBar, Alert } from 'react-native';

const url = 'http://192.168.0.108:8429';

export default function Activity() {

  type activity = {
    workoutName: string;
    workoutDate: string;
  }

  const [activity, setActivity] = useState([]);

  async function getActivity(){
    try {
      const submit = await fetch(`${url}/activity`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
      });
      const response = await submit.json();
      if (response.status === "SUCCESS")
        setActivity(response.body.workoutsList);
      else 
        Alert.alert("Failed to retrieve activity");
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  }

  useEffect(() => {
    getActivity();
  }, []);

  return (
    <View style={styles.container}>
      {activity.map((item: activity) => (
        <Text key={item.workoutName + item.workoutDate}>
          {item.workoutName} - {item.workoutDate}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

});