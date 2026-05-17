import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Platform, View, StatusBar, TouchableHighlight, Alert, TextInput } from 'react-native';

const url = 'http://localhost:8429';

export default function Friends() {

    type Friend = {
        friendID: number;
        username: string;
    }

    type FriendRequest = {
        requesterId: number;
        requesterUsername: string;
    }

    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [recipient, onChangeRecipientText] = useState("");

    async function getFriendRequest(){
      try {
        const submit = await fetch(`${url}/request`, {
          method: 'GET',
          headers: {"Content-Type": "application/json"},
          credentials: 'include',
        });
        const response = await submit.json();
        if (response.status === "SUCCESS") {
          setRequests(response.body.friendRequests);
        } else {
          Alert.alert("Failed to retrieve friend requests");
        }
      }
      catch {
          Alert.alert("Error", "Failed to connect to server \n");
      }
  }

    async function acceptFriendRequest(requesterId:number){
      try {
        const submit = await fetch(`${url}/respondRequest`, {
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          credentials: 'include',
          body: JSON.stringify({
            "action": "ACCEPT_REQUEST",
            "response": "ACCEPT",
            "requesterId": requesterId,
          })
        });
        const response = await submit.json();
        if (response.status === "SUCCESS")
          Alert.alert("Friend request accepted");
        else         
          Alert.alert("Request failed to accept");
      }
      catch {
          Alert.alert("Error", "Failed to connect to server \n");
      }
  }

      async function declineFriendRequest(requesterId:number){
      try {
        const submit = await fetch(`${url}/respondRequest`, {
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          credentials: 'include',
          body: JSON.stringify({
            "action": "DECLINE_REQUEST",
            "response": "DECLINE",
            "requesterId": requesterId,
          })
        });
        const response = await submit.json();
        if (response.status === "SUCCESS")
          Alert.alert("Friend request declined");
        else         
          Alert.alert("Request failed to decline");
      }
      catch{
          Alert.alert("Error", "Failed to connect to server \n");
      }
  }

    async function sendFriendRequest(){
      try {
        const submit = await fetch(`${url}/request`, {
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          credentials: 'include',
          body: JSON.stringify({
            "action": "SEND_REQUEST",
            "friendUsername": recipient,
          }),
        });
        const response = await submit.json();
        if (response.status === "SUCCESS")
          Alert.alert("Friend request sent");
        else         
          Alert.alert("Failed to send friend request");
      }
      catch {
          Alert.alert("Error", "Failed to connect to server \n");
      }
  }

  async function getFriends(){
    try {
      const submit = await fetch(`${url}/friends`, {
        method: 'GET',
        headers: {"Content-Type": "application/json"},
        credentials: 'include',
      });
      const response = await submit.json();
      if (response.status === "SUCCESS") {
        setFriends(response.body.friendsList);
      } else {
        Alert.alert("Failed to retrieve friends");
      }
    } catch {
      Alert.alert("Error", "Failed to connect to server \n");
    }
  }

  useEffect(() => {
    getFriends();
    getFriendRequest();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.head}>Friends</Text>
      {friends.map((friend) => (
      <Text style={styles.acDcTxt} key={friend.friendID}>
        - {friend.username}
      </Text>
      ))}
      <Text style={styles.mainText}>Friend Request Recipient</Text>
      <TextInput maxLength={20} style={styles.inputText} onChangeText={onChangeRecipientText} value={recipient} placeholder="Enter here" />
      <TouchableHighlight onPress = {sendFriendRequest}>
        <Text style={styles.mainText}>Send Friend Request</Text>
      </TouchableHighlight>
      <Text style={styles.mainText}>Friend Requests</Text>

        {requests.map((request: FriendRequest) => (
          <View key={request.requesterId} style={styles.reqText}>
            <Text style={styles.acDcTxt}>
              - {request.requesterUsername}
            </Text>
            <TouchableHighlight onPress={() => acceptFriendRequest(request.requesterId)}>
              <Text style={styles.acDcTxt}>Accept</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => declineFriendRequest(request.requesterId)}>
              <Text style={styles.acDcTxt}>Decline</Text>
            </TouchableHighlight>
          </View>
        ))}
      </View>
    
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#0b2f42',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  mainText: {
    alignSelf: 'center',
    padding: 8,
    borderRadius: 8,
    fontWeight: '500',
    fontSize: Platform.OS === 'web'? 18 : 9,
    backgroundColor: '#0f4e70',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    textTransform: 'uppercase',
    textAlign: 'center',
    alignContent: 'center',
    margin: 10
  },
  head: {
    fontSize: Platform.OS === 'web'? 30 : 15,
    padding: 2,
    color: '#D2B80F',
    borderWidth: 4,
    borderColor: '#134e6d',
    borderRadius: 4,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '700',
    textTransform: 'uppercase',
    backgroundColor: '#0d384f',
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 8,
    marginHorizontal: 41
  },
  inputText: {
    alignSelf: 'center',
    padding: 8,
    borderRadius: 8,
    fontWeight: '500',
    fontSize: Platform.OS === 'web'? 18 : 9,
    backgroundColor: '#0f4e70',
    color: '#D2B80F',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    textTransform: 'uppercase',
    textAlign: 'center',
    margin: 10
  },
  reqText: {
    alignSelf: 'center',
    padding: 8,
    borderRadius: 8,
    fontWeight: '200',
    fontSize: Platform.OS === 'web'? 14 : 7,
    backgroundColor: '#0f4e70',
    color: '#D2B80F',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    textTransform: 'uppercase',
    textAlign: 'center',
    margin: 10
  },
  acDcTxt: {
    color: '#D2B80F',
    marginVertical: 2,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '400',
    fontSize: Platform.OS === 'web'? 18 : 9,
    textAlign: 'center'
  }

});