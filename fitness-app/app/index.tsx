import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, {useState} from 'react';
import {Platform, View, Text, TextInput, Button, Pressable} from 'react-native';
import { useWindowDimensions } from 'react-native';

export default function LoginScreen() {
    const {width, height} = useWindowDimensions();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [visiblePasswordText, setVisiblePasswordText] = useState('');
    const [isPasswordLockToggled, setIsPasswordLockToggled] = useState(true);

    function login() {
        let url = 'http://127.0.0.1:8429/login'
        let packet = {
            action: 'LOGIN',
            data: {
                'username':`${username}`,
                'password':`${password}`
            }
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(packet)
        })
        setUsername('')
        setPassword('')
        setVisiblePasswordText('')
    }

    function hidePassword(passwordText:string) {
        let hiddenString = ''
        let passwordLen = passwordText.length
        for (let char of passwordText) {
            hiddenString += '*'
            if ((char != '*') && (passwordLen > password.length)) {
                setPassword(password + char)
            }
        }
        if ((passwordLen) < password.length) {
            setPassword(password.substring(0, passwordLen))
            hiddenString = (hiddenString.substring(0, passwordLen))
        }
        setVisiblePasswordText(hiddenString)
    }

    function showPassword(passwordText:string) {
        if (passwordText.includes('*')) {
            setVisiblePasswordText(password)
        }
        else {
            setVisiblePasswordText(passwordText)
            setPassword(passwordText)
        }
    }

    function passwordLockPressed() {
        !isPasswordLockToggled? hidePassword(visiblePasswordText) : showPassword(visiblePasswordText)
        setIsPasswordLockToggled(!isPasswordLockToggled)
    }

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
                    width: Platform.OS === 'web' ? 0.35 * width : 0.55 * width,
                    padding: 5,
                    margin: 8,
                    borderWidth: 1
                }}
            />
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                <TextInput
                    placeholder="Password"
                    placeholderTextColor={'black'}
                    value={visiblePasswordText}
                    onChangeText={newText => {isPasswordLockToggled? hidePassword(newText) : showPassword(newText)}}
                    style={{
                        height: 40,
                        width: Platform.OS === 'web' ? 0.35 * width : 0.55 * width,
                        padding: 5,
                        marginTop: 8,
                        marginLeft: 36,
                        marginHorizontal: 8,
                        borderWidth: 1
                    }}
                />
                <Pressable
                    onPress={() => 
                        passwordLockPressed()
                    }>
                    <IconSymbol size={28} name={isPasswordLockToggled? 'lock' : 'lock.open'} color={"#000000"}
                    style={{
                        marginTop: 8
                    }}
                    />
                </Pressable>
            </View>
            <Link href='/register' 
                style={{
                    marginVertical: 4, 
                    marginLeft: 0.30 * width
                }}>
                <Text>
                    Register Here!
                </Text>
            </Link>
            <Button
                title="Submit"
                onPress={() => login()}
            />
        </View>
    )
}