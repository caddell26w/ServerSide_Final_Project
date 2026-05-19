import { Platform, StyleSheet, View, ScrollView, Text, Image, Pressable, Alert} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function FriendsScreen() {
    const {width, height} = useWindowDimensions();
    
    const navigation = useNavigation();

    const [user, setUser] = useState('')
    const [profilePicture, setProfilePicture] = useState('')
    const [friendsList, setFriendsList] = useState([''])

    const [inactiveFriendsList, setInactiveFriendsList] = useState([''])
    const [activeFriendsList, setActiveFriendsList] = useState([''])
    const [usersList, setUsersList] = useState([''])

    // Set types to avoid typescript error
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
    const [friendRequestSenders, setFriendRequestSenders] = useState([''])

    // Set the types to avoid a typescript error
    const requestRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const usersRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const boxSizing = {
        width: Platform.OS === 'web'? 0.400 * width: 0.35 * width,
        height: 0.400 * height,
    }
    const titleSizing = {
        width: Platform.OS === 'web' ? 0.400 * width : 0.35 * width
    }

    type FriendRequest = {
        requesterId: number
        requesterUsername: string
    }

    /*

    input: values from the database
    purpose: turn the strings of the values into a list to ensure mapping works
    */
    function setDataValues(userValue:string, profilePictureValue:string, friendsListValue:string[]) {
        setUser(userValue)
        setProfilePicture(profilePictureValue)
        friendsListValue = friendsListValue.toString().replace("[", "").replace("]", "").replace(" ", "").replaceAll("'", "").split(",")
        let friendList = []
        for (let friend of friendsListValue) {
            friendList.push(friend)
        }
        setFriendsList(friendList)
    }

    /*
    Input: list of users, and list of friends active
    Purpose: Sort them into inactive friends, active friends, or exclude them from the two lists
    */
    function updateActiveUsers(activeFriends: Array<string>, users: Array<string>) {
        if (activeFriends == undefined) {
            activeFriends = ['']
        }
        else if (activeFriends.length == 0) {
            activeFriends = ['']
        }
        setActiveFriendsList(activeFriends)
        let activeUsers = users.filter(account => account !== user)
        activeUsers = activeUsers.filter(account => !(friendRequestSenders.includes(account)))

        if (activeUsers == undefined) {
            activeUsers = ['']
        }
        else if (activeUsers.length == 0) {
            activeUsers = ['']
        }
        activeUsers = activeUsers.filter(a => a.trim() !== user.trim());
        setUsersList(activeUsers)
        let inactiveFriends = []
        for (let friend of friendsList) {
            if (!(activeFriends.includes(friend))) {
                inactiveFriends.push(friend)
            }
        }
        if (inactiveFriends.length == 0) {
            inactiveFriends = ['']
        }
        setInactiveFriendsList(inactiveFriends)
    }

    /*
    Get the user and friends list from the database
    */
    useEffect(() => {
        function getUsersAndFriends() {
            setTimeout(function run() {
                fetch('https://localhost:8429/activeFriends', {credentials: 'include'})
                .then((response) => response.json())
                .then((json) => {{json.status === 'ERROR'? (() => {throw (json.body)})(): updateActiveUsers(json.body.activeFriendsList, json.body.usersList)}})
                .catch((error) => {
                    console.error('Error:', error)
                    navigation.getParent()?.navigate('index')
                })
                usersRef.current = setTimeout(run, 2000) // real time updating
            }, 5000)
        }
        getUsersAndFriends()
        return () => {
            if (usersRef.current) {clearTimeout(usersRef.current)}
        }
    }, [])
    
    /*
    Send the request to the user (input)
    */
    async function sendFriendRequest(user: string) {
        try {
            const submit = await fetch(`https://localhost:8429/request`, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify({
                "action": "SEND_REQUEST",
                "friendUsername": user,
                }),
            });
            const response = await submit.json();
            let requests = []
            if (response.status === "SUCCESS") {
                Alert.alert("Friend request sent");
            }
            else {
                Alert.alert("Failed to send friend request");
            }
            }
            catch {
                Alert.alert("Error", "Failed to connect to server \n");
            }
    }

    // Accept the request from the person who requested it (the input)
    async function acceptFriendRequest(requesterId:number){
          try {
            const submit = await fetch(`https://localhost:8429/respondRequest`, {
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
    
    // Decline the request from the person who requested it (the input)
    async function declineFriendRequest(requesterId:number){
        try {
        const submit = await fetch(`https://localhost:8429/respondRequest`, {
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

    // Get the friend requests
    async function getFriendRequests(){
        try {
            const submit = await fetch(`https://localhost:8429/request`, {
            method: 'GET',
            headers: {"Content-Type": "application/json"},
            credentials: 'include',
            });
            const response = await submit.json();
            if (response.status === "SUCCESS") {
            setFriendRequests(response.body.friendRequests);
            } else {
            Alert.alert("Failed to retrieve friend requests");
            }
        }
        catch {
            Alert.alert("Error", "Failed to connect to server \n");
        }
    }

    // Every so often get the friend requests from the sqlite database
    useEffect(() => {
        function getRequests() {
            setTimeout (function run() {
                getFriendRequests()
                let requesters = []
                for (let request of friendRequests) {
                    requesters.push(request.requesterUsername)
                }
                setFriendRequestSenders(requesters)
                requestRef.current = setTimeout(run, 2000) // real time updating
            }, 5000)
        }
        getRequests()
        return () => {
            if (requestRef.current) {clearTimeout(requestRef.current)}
        }
      }, [])

    /*
    Get account info from database, which goes on the top to display the profile of the user using the page
    */
    useEffect(() => {
            fetch('https://localhost:8429/accountSettings', {credentials: 'include'})
            .then((response) => response.json())
            .then((json) => {{json.status === 'ERROR'? (() => {throw (json.body)})(): setDataValues(json.body.user, json.body.profilePicture, json.body.friendsList)}})
            .catch((error) => {
                console.error('Error:', error)
                navigation.getParent()?.navigate('index') // if not logged in or error in browser
            })
    }, [])

    return (
        <View
        style={{
            flex: 1,
            backgroundColor: '#0b2f42',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
        }}>
            <View>
                <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image 
                        source={{ uri : `https://localhost:8429/static/users/${profilePicture}`}}
                        style={{
                            width: 75,
                            height: 75,
                        }}
                    />
                    <Text
                        style={{
                            fontSize: 24,
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                            fontWeight: '700',
                            color: '#D2B80F',
                            margin: 8,
                           
                        }}
                    >
                        {user}
                    </Text>
                </View>
                <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                    }}>
                    <View>
                        <Text style={[titleSizing, styles.dayTitle, {margin: 8, marginBottom: 0, fontWeight: '500'}]}>
                        Friend Activity
                        </Text>
                        <ScrollView>
                            <Text style={[boxSizing, styles.exerciseDetails, {margin: 8, marginTop: 0, padding: 0, textAlign: 'center', display: 'flex'}]}>
                                <View
                                style={{
                                    display: 'flex',
                                    width: '50%',
                                    borderRightWidth: 1.5,
                                    borderColor: '#0f4e70',
                                }}>
                                    <Text
                                    style={{
                                        fontSize: Platform.OS === 'web'? 16: 8,
                                        display: 'flex',
                                        padding: 8,
                                        justifyContent: 'center',
                                        borderBottomWidth: 2,
                                        borderColor: '#0f4e70',
                                    }}>
                                        Active Friends
                                    </Text>
                                    <View
                                    style={{
                                        flexDirection: 'column',
                                        width: '100%',
                                    }}>
                                    {activeFriendsList.map((activeFriend, index) => (
                                        <Text 
                                        key={index}
                                        style={{
                                            fontSize: Platform.OS === 'web'? 14 : 7,
                                            borderBottomWidth: 1.5,
                                            borderColor: '#0f4e70',
                                            borderStyle: 'dashed',
                                            padding: 3,
                                            width: '100%',
                                            textAlign: 'left'
                                        }}>
                                        {activeFriend == ''? "No Active Friends": activeFriend}</Text>
                                    ))}
                                    </View>
                                </View>
                                <View
                                style={{
                                    display: 'flex',
                                    width: '50%',
                                    borderLeftWidth: 1.5,
                                    borderColor: '#0f4e70',
                                }}>
                                    <Text
                                    style={{
                                        fontSize: Platform.OS === 'web'? 16: 8,
                                        display: 'flex',
                                        padding: 8,
                                        justifyContent: 'center',
                                        borderBottomWidth: 2,
                                        borderColor: '#0f4e70',
                                    }}>
                                        Inactive Friends
                                    </Text>
                                    <View
                                    style={{
                                        flexDirection: 'column',
                                        width: '100%',
                                    }}>
                                    {inactiveFriendsList.map((inactiveFriend, index) => (
                                        <Text 
                                        key={index}
                                        style={{
                                            fontSize: Platform.OS === 'web'? 14 : 7,
                                            borderBottomWidth: 1.5,
                                            borderColor: '#0f4e70',
                                            borderStyle: 'dashed',
                                            padding: 3,
                                            width: '100%',
                                            textAlign: 'left'
                                        }}>
                                        {inactiveFriend == ''? 'No Inactive Friends' : inactiveFriend}</Text>
                                    ))}
                                    </View>
                                </View>
                            </Text>
                        </ScrollView>
                    </View>
                    <View>
                        <Text style={[titleSizing, styles.dayTitle, {margin: 8, marginBottom: 0, fontWeight: '500'}]}>
                            Friend Request
                        </Text>
                        <ScrollView>
                            <Text style={[boxSizing, styles.exerciseDetails, {margin: 8, marginTop: 0, padding: 0, textAlign: 'center', display: 'flex'}]}>
                                <View
                                style={{
                                    display: 'flex',
                                    flex: 1,
                                }}>
                                    <View
                                    style={{
                                        flexDirection: 'column',
                                        width: '100%',
                                        height: '50%',
                                    }}>
                                    {usersList.map((user, index) => (
                                        <View 
                                        style={{
                                            borderBottomWidth: 1.5,
                                            borderColor: '#0f4e70',
                                            borderStyle: 'dashed',
                                            padding: 3,
                                            width: '100%',
                                            flexDirection: 'row'
                                        }}>
                                        <Text 
                                        key={index}
                                        style={{
                                            fontSize: Platform.OS === 'web'? 14 : 7,
                                            textAlign: 'left', 
                                            width: '100%'
                                        }}>
                                        {user == ''? 'No Other Users' : user}</Text>
                                        <Text
                                        style={{
                                            display: user == ''? 'none' : 'flex'
                                        }}>
                                            <Pressable
                                                onPress={() => sendFriendRequest(user)}>
                                                <IconSymbol size={20} name="person.badge.plus" color={'#D2B80F'} />
                                            </Pressable>
                                        </Text>
                                        </View>
                                    ))}
                                    </View>
                                    <View>
                                        <Text
                                        style={{
                                            fontSize: Platform.OS === 'web'? 18 : 9,
                                            marginTop: 8,
                                            borderColor: '#0f4e70',
                                            borderTopWidth: 2,
                                            borderBottomWidth: 2,
                                            padding: 8,
                                            fontWeight: '500'
                                        }}>
                                            Active Requests
                                        </Text>
                                        <View>
                                            {friendRequests.map((request: FriendRequest, index) => (
                                            <View 
                                            style={{
                                                borderBottomWidth: 1.5,
                                                borderColor: '#0f4e70',
                                                borderStyle: 'dashed',
                                                padding: 3,
                                                width: '100%',
                                                flexDirection: 'row'
                                            }}>
                                            <Text 
                                            key={index}
                                            style={{
                                                fontSize: Platform.OS === 'web'? 14 : 7,
                                                textAlign: 'left', 
                                                width: '100%'
                                            }}>
                                            {request.requesterUsername == ''? 'No Active Requests' : request.requesterUsername}</Text>
                                            <Text
                                            style={{
                                                display: request.requesterUsername == ''? 'none' : 'flex'
                                            }}>
                                                <Pressable
                                                    onPress={() => acceptFriendRequest(request.requesterId)}>
                                                    <IconSymbol size={20} name="checkmark.square.fill" color={'#D2B80F'} />
                                                </Pressable>
                                                <Pressable
                                                    onPress={() => declineFriendRequest(request.requesterId)}>
                                                    <IconSymbol size={20} name="square.slash" color={'#D2B80F'} />
                                                </Pressable>
                                            </Text>
                                            </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewContainer: {
        margin: 10
    },
    dayTitle: {
        display: 'flex',
        fontSize: Platform.OS === 'web'? 18 : 9,
        fontWeight: '500',
        color: '#D2B80F',
        padding: 8,
        justifyContent: 'center',
        textAlign: 'center',
        borderColor: '#0f4e70',
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        borderWidth: 3,
        borderBottomWidth: 0,
        borderStyle: 'solid'
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
        textAlignVertical: 'top'
    },
    changeButtons: {
        alignSelf: 'center',
        padding: 8,
        borderRadius: 8,
        fontWeight: '500',
        fontSize: Platform.OS === 'web'? 14 : 7,
        backgroundColor: '#0f4e70',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textTransform: 'uppercase',
        textAlign: 'center'
    }
})