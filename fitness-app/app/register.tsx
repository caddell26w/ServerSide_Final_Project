import { Link } from 'expo-router';
import React, {useState} from 'react';
import {Platform, View, Text, TextInput, Button} from 'react-native';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Text
                style={{
                    color: 'black',
                    fontWeight: 'bold',
                    fontSize: 20
                }}>
            Register
            </Text>
            <TextInput
                placeholder="Username"
                placeholderTextColor={'black'}
                onChangeText={newText => setUsername(newText)}
                style={{
                    height: 40,
                    width: Platform.OS === 'web' ? '35%' : '55%',
                    padding: 5,
                    margin: 8,
                    borderWidth: 1
                }}
                value={username}
            />
            <TextInput
                placeholder="Password"
                placeholderTextColor={'black'}
                onChangeText={newText => setPassword(newText)}
                style={{
                    height: 40,
                    width: Platform.OS === 'web' ? '35%' : '55%',
                    padding: 5,
                    margin: 8,
                    borderWidth: 1
                }}
                value={password}
            />
            <TextInput
                placeholder="Confirm Password"
                placeholderTextColor={'black'}
                onChangeText={newText => setConfirmedPassword(newText)}
                style={{
                    height: 40,
                    width: Platform.OS === 'web' ? '35%' : '55%',
                    padding: 5,
                    margin: 8,
                    borderWidth: 1,
                }}
                value={confirmedPassword}
            />
            <Button
                title="Submit"
                onPress={() => {
                    // Confirm user has matching passwords before moving on to complete registration
                    if (password === confirmedPassword) {alert(`Register Potential Success`)} 
                    else {alert(`Register Potential Failure`)}
                }
            }
                //onPress={() => }
            />
        </View>
    )
}