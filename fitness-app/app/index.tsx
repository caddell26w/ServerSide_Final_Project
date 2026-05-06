import { Link } from 'expo-router';
import React, {useState} from 'react';
import {Platform, View, Text, TextInput, Button} from 'react-native';

export default function LoginScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
            Login
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
                    marginTop: 8,
                    marginHorizontal: 8,
                    borderWidth: 1
                }}
            />
            <Link href='/register' 
                style={{
                    marginVertical: 4, 
                    marginLeft: '30%'
                }}>
                <Text>
                    Register Here!
                </Text>
            </Link>
            <Button
                title="Submit"
                onPress={() => alert('Login button pressed')}
            />
        </View>
    )
}