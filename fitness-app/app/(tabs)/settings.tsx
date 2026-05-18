import { Platform, StyleSheet, View, Text, Image, Pressable, ScrollView} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useWindowDimensions, TextInput } from 'react-native';
import { useNavigation } from 'expo-router';

export default function HomeScreen() {
    const {width, height} = useWindowDimensions();

    const navigation = useNavigation();

    const [user, setUser] = useState('')
    const [profilePicture, setProfilePicture] = useState('')
    const [goals, setGoals] = useState([''])
    const [friendsList, setFriendsList] = useState([''])
    const [goalActive, toggleGoalActive] = useState(false)
    const [goalInput, setGoalInput] = useState('')

    const boxSizing = {
        width: Platform.OS === 'web'? 0.400 * width: 0.35 * width,
        height: 0.400 * height,
    }
    const titleSizing = {
        width: Platform.OS === 'web' ? 0.400 * width : 0.35 * width
    }


    function setDataValues(userValue:string, profilePictureValue:string, goalsValue:string[], friendsListValue:string[]) {
        setUser(userValue) // username, not userid
        setProfilePicture(profilePictureValue)
        goalsValue = goalsValue.toString().replace("[", "").replace("]", "").replace(" ", "").replace("'", "").split(",")
        let goalList = []
        for (let goal of goalsValue) {
            goalList.push(goal)
        }
        setGoals(goalList)
        friendsListValue = friendsListValue.toString().replace("[", "").replace("]", "").replace(" ", "").replace("'", "").split(",")
        let friendList = []
        for (let friend of friendsListValue) {
            friendList.push(friend)
        }
        setFriendsList(friendList)
    }

    function displayGoals() {
        let goalString = ''
        for (let goal of goals) {
            goalString += `- ${goal}\n`
            if (goal === 'None') {
                goalString = `No Current Goals`
            }
            
        }
        return goalString
    }

    async function deleteAccount() {
        let url = 'http://localhost:8429/delete'
        let packet = {
            action: 'LOGIN',
            data: {
                'username':`${user}`,
            }
        }
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(packet),
            credentials: 'include',
        }).then((resp) => {return resp.json()})
        .then((json) => {
            if (json.message === 'success'){
            
            navigation.getParent()?.navigate('index')
            }
        })
        
    }

    async function addGoal(goal:string) {
        let url = 'http://localhost:8429/addGoal'
        let packet = {
            action: 'GOAL',
            data: {
                'goal':`${goal}`,
            }
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(packet),
            credentials: 'include',
        }).then((resp) => {return resp.json()})
        .then((json) => {setGoals(json.body)
        })
    }

    useEffect(() => {
        fetch('http://localhost:8429/accountSettings', {credentials: 'include'})
        .then((response) => response.json())
        .then((json) => {{json.status === 'ERROR'? (() => {throw (json.body)})(): setDataValues(json.body.user, json.body.profilePicture, json.body.goals, json.body.friendsList)}})
        .catch((error) => {
            console.error('Error:', error)
            navigation.getParent()?.navigate('index')
        })
        
    }, [goalActive])

    return (
        <View
        style={{
            flex: 1,
            backgroundColor: '#0b2f42',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <View
            style={{
                flexDirection: 'row',
                alignItems: 'center'
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
                        margin: 8
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
                    <Text style={[titleSizing, styles.dayTitle, {margin: 8, marginBottom: 0}]}>
                    Goals
                    </Text>
                    <Text style={[boxSizing, styles.exerciseDetails, {margin: 8, marginTop: 0}]}>
                        {displayGoals()}
                    </Text>
                </View>
                <View>
                    <Text style={[titleSizing, styles.dayTitle, {margin: 8, marginBottom: 0}]}>
                    Friends
                    </Text>
                    <ScrollView>
                        <Text style={[boxSizing, styles.exerciseDetails, {margin: 8, marginTop: 0, padding: 0}]}>
                            <View
                            style={{
                                flexDirection: 'column',
                                width: '100%'
                            }}>
                            {friendsList.map((friend, index) => (
                                <Text 
                                key={index}
                                style={{
                                    fontSize: Platform.OS === 'web'? 14 : 7,
                                    borderBottomWidth: 1.5,
                                    borderColor: '#0f4e70',
                                    borderStyle: 'dashed',
                                    padding: 8,
                                    width: '100%'
                                }}>
                                {friend == ''? 'No Friends Added': friend}</Text>
                            ))}
                            </View>
                        </Text>
                    </ScrollView>
                </View>
            </View>
            <Pressable>
                <Text
                style={[{margin: 8}, styles.changeButtons]}>
                    Change profile picture
                </Text>
            </Pressable>
            <Pressable>
                <Text
                style={[{margin: 8}, styles.changeButtons]}>
                    Update password
                </Text>
            </Pressable>
            <Pressable
            style={[{display: goalActive ? 'none' : 'flex'}]}
            onPress={() => toggleGoalActive(true)}>
                <Text
                style={[{margin: 8}, styles.changeButtons]}>
                    Add new goal
                </Text>
            </Pressable>
            <TextInput 
                style={[styles.inputText,{display: goalActive? 'flex' : 'none'}, {color: '#D2B80F'}, {paddingVertical: 2}]}
                placeholder='Enter a fitness goal'
                placeholderTextColor={'#D2B80F'}
                value={goalInput}
                onChangeText={NewText => setGoalInput(NewText)}
                >
            </TextInput>
            <Pressable
                style={[{display: goalActive? 'flex' : 'none'}]}
                onPress={() => {
                    addGoal(goalInput) 
                    toggleGoalActive(false)
                }
                }
                >
                <Text
                style={[{margin: 8}, styles.changeButtons]}>
                    Submit new goal
                </Text>
            </Pressable>
            <Pressable>
                <Text
                style={[{margin: 8}, styles.changeButtons, {display: goalActive ? 'none' : 'flex'}]}>
                    Remove a goal
                </Text>
            </Pressable>
            <Pressable
            onPress={() => deleteAccount()}>
                <Text
                style={[{margin: 8}, styles.changeButtons]}>
                    Delete account
                </Text>
            </Pressable>
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
    inputText: {
    alignSelf: 'center',
    padding: 8,
    borderRadius: 8,
    fontWeight: '500',
    fontSize: Platform.OS === 'web'? 13 : 6.5,
    backgroundColor: '#0f4e70',
    color: '#D2B80F',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    textTransform: 'uppercase',
    textAlign: 'center',
    margin: 10
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