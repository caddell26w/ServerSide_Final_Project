import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Platform, View, StatusBar, TouchableHighlight, Alert, TextInput } from 'react-native';

const url = 'https://localhost:8429';

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
      <Text style={{fontSize: 24}}>Friends</Text>
      {friends.map((friend) => (
      <Text key={friend.friendID}>
        {friend.username}
      </Text>
      ))}
      <Text style={{fontSize: 20}}>Friend Request Recipient</Text>
      <TextInput maxLength={20} onChangeText={onChangeRecipientText} value={recipient} placeholder="Enter here" />
      <TouchableHighlight onPress = {sendFriendRequest}>
        <Text style={{fontSize: 20}}>Send Friend Request</Text>
      </TouchableHighlight>
      <Text style={{fontSize: 24}}>Friend Requests</Text>

        {requests.map((request: FriendRequest) => (
          <View key={request.requesterId}>
            <Text>
              {request.requesterUsername}
            </Text>
            <TouchableHighlight onPress={() => acceptFriendRequest(request.requesterId)}>
              <Text>Accept</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => declineFriendRequest(request.requesterId)}>
              <Text>Decline</Text>
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
    paddingTop: Platform.OS === "web" ? 0: StatusBar.currentHeight,
  },

});