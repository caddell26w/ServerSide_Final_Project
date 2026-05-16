import { Platform, StyleSheet, View, ScrollView, Text, Image, Pressable} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
    const {width, height} = useWindowDimensions();
    
    const navigation = useNavigation();

    const [user, setUser] = useState('')
    const [profilePicture, setProfilePicture] = useState('')
    const [friendsList, setFriendsList] = useState([''])

    const [inactiveFriendsList, setInactiveFriendsList] = useState([''])
    const [activeFriendsList, setActiveFriendsList] = useState([''])
    const [usersList, setUsersList] = useState([''])


    const boxSizing = {
        width: Platform.OS === 'web'? 0.400 * width: 0.35 * width,
        height: 0.400 * height,
    }
    const titleSizing = {
        width: Platform.OS === 'web' ? 0.400 * width : 0.35 * width
    }

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

    function updateActiveUsers(activeFriends: Array<string>, users: Array<string>) {
        setActiveFriendsList(activeFriends)
        for (let index in users) {
            let currentIndex = Number(index)
            if (users[currentIndex] == user) {
                users.splice(currentIndex, 1)
            }
        }
        if (users.length == 0) {
            users = ['']
        }
        setUsersList(users)
        let inactiveFriends = []
        for (let friend of friendsList) {
            if (!(activeFriends.includes(friend))) {
                inactiveFriends.push(friend)
            }
        }
        setInactiveFriendsList(inactiveFriends)
    }
    
    function sendFriendRequest(user: string) {
        console.log(user)
    }

    useEffect(() => {
        fetch('http://localhost:8429/activeFriends', {credentials: 'include'})
        .then((response) => response.json())
        .then((json) => {{json.status === 'ERROR'? (() => {throw (json.body)})(): updateActiveUsers(json.body.activeFriendsList, json.body.usersList)}})
    }, [friendsList])

    useEffect(() => {
            fetch('http://localhost:8429/accountSettings', {credentials: 'include'})
            .then((response) => response.json())
            .then((json) => {{json.status === 'ERROR'? (() => {throw (json.body)})(): setDataValues(json.body.user, json.body.profilePicture, json.body.friendsList)}})
            .catch((error) => {
                console.error('Error:', error)
                navigation.getParent()?.navigate('index')
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
                        source={{ uri : `http://localhost:8429/static/users/${profilePicture}`}}
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
                                                <IconSymbol size={20} name="person.badge.plus" color={'black'} />
                                            </Pressable>
                                        </Text>
                                        </View>
                                    ))}
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