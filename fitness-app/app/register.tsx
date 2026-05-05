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
            />
            <Button
                title="Submit"
                onPress={() => alert('Button pressed')}
            />
        </View>
    )
}