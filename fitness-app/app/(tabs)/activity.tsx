import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, Platform, View, StatusBar, Alert } from 'react-native';

const url = 'https://localhost:8429';

export default function Activity() {

  type Activity = {
    workoutName: string;
    workoutDate: string;
  } // in future works, this allows us to better make use of each variable such as ordering

  const [activity, setActivity] = useState<string []>([]);

  /*

  Retrieves the workoutLog from python
  */
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
        setAct(response.body); // python list of dictionaries, which turn to arrays we map over
      else 
        Alert.alert("Failed to retrieve activity");
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  }

  function setAct(activity: string) {
            let activityList = []
            activityList = activity.toString().replace("[", "").replace("]", "").replace(" ", "").replaceAll("'", "").split(",")
            let friendList = []
            for (let friend of activity) {
                friendList.push(friend)
        }
        setActivity(friendList)
  }

  useEffect(() => {
    getActivity();
  }, []);

  return (
    <View style={styles.container}>
      {activity.map((item: string) => (
        <Text style={styles.exerciseDetails} >
          {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b2f42',
    paddingTop: Platform.OS === "web" ? 0 : StatusBar.currentHeight,
  },
    exerciseDetails: {
        fontSize: Platform.OS === 'web'? 14 : 7,
        color: '#D2B80F',
        borderColor: '#0f4e70',
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderWidth: 3,
        borderStyle: 'solid',
        marginBottom: 8,
        padding: 8,
        textAlignVertical: 'top',
        marginHorizontal: 20,
        textAlign: 'center',
        alignContent:'center'
    }

});