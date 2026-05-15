import { IconSymbol } from '@/components/ui/icon-symbol';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';
import React, {useState} from 'react';
import {Platform, StyleSheet, View, Text, TextInput, Button, Pressable} from 'react-native';
import { useWindowDimensions } from 'react-native';

export default function RegisterScreen() {
    const {width, height} = useWindowDimensions();

    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');

    const [visiblePasswordText, setVisiblePasswordText] = useState('');
    const [visibleConfirmedPasswordText, setVisibleConfirmedPasswordText] = useState('');

    const [isPasswordLockToggled, setIsPasswordLockToggled] = useState(true);
    const [isConfirmedPasswordLockToggled, setIsConfirmedPasswordLockToggled] = useState(true);

    function registerUser() {
        let url = 'http://localhost:8429/register'
        let packet = {
            action: 'REGISTER',
            data: {
                'username' : `${username}`,
                'password' : `${password}`,
                'confirmedPassword' : `${confirmedPassword}`
            }
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(packet),
            credentials: 'include'
        })
        setUsername('')
        setPassword('')
        setVisiblePasswordText('')
        setConfirmedPassword('')
        setVisibleConfirmedPasswordText('')
        router.navigate('/(tabs)') // IF WORKS ROUTE
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

    function hideConfirmedPassword(confirmedPasswordText:string) {
        let hiddenString = ''
        let confirmedPasswordLen = confirmedPasswordText.length
        for (let char of confirmedPasswordText) {
            hiddenString += '*'
            if ((char != '*') && (confirmedPasswordLen > confirmedPassword.length)) {
                setConfirmedPassword(confirmedPassword + char)
            }
        }
        if ((confirmedPasswordLen) < confirmedPassword.length) {
            setConfirmedPassword(confirmedPassword.substring(0, confirmedPasswordLen))
            hiddenString = (hiddenString.substring(0, confirmedPasswordLen))
        }
        setVisibleConfirmedPasswordText(hiddenString)
    }

    function showConfirmedPassword(confirmedPasswordText:string) {
        if (confirmedPasswordText.includes('*')) {
            setVisibleConfirmedPasswordText(confirmedPassword)
        }
        else {
            setVisibleConfirmedPasswordText(confirmedPasswordText)
            setPassword(confirmedPasswordText)
        }
    }

    function confirmedPasswordLockPressed() {
        !isConfirmedPasswordLockToggled? hideConfirmedPassword(visibleConfirmedPasswordText) : showConfirmedPassword(visibleConfirmedPasswordText)
        setIsConfirmedPasswordLockToggled(!isConfirmedPasswordLockToggled)
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
            Register
            </Text>
            <TextInput
                placeholder="Username"
                placeholderTextColor={'black'}
                value={username}
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
                    onChangeText={(newText) => {isPasswordLockToggled? hidePassword(newText) : showPassword(newText)}}
                    style={{
                        height: 40,
                        width: Platform.OS === 'web' ? 0.35 * width : 0.55 * width,
                        padding: 5,
                        margin: 8,
                        marginLeft: 36, //margin + size of icon
                        borderWidth: 1
                    }}
                />
                <Pressable
                    onPress={() => 
                        passwordLockPressed()
                    }>
                    <IconSymbol size={28} name={isPasswordLockToggled? 'lock' : 'lock.open'} color={"#000000"}/>
                </Pressable>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor={'black'}
                    value={visibleConfirmedPasswordText}
                    onChangeText={(newText) => {isConfirmedPasswordLockToggled? hideConfirmedPassword(newText) : showConfirmedPassword(newText)}}
                    style={{
                        height: 40,
                        width: Platform.OS === 'web' ? 0.35 * width : 0.55 * width,
                        padding: 5,
                        margin: 8,
                        marginLeft: 36,
                        borderWidth: 1,
                    }}
                />
                <Pressable
                    onPress={() => 
                        confirmedPasswordLockPressed()
                    }>
                    <IconSymbol size={28} name={isConfirmedPasswordLockToggled? 'lock' : 'lock.open'} color={'#000000'}/>
                </Pressable>
            </View>
            <Link href='/login' 
                style={{
                    marginVertical: 4, 
                    marginLeft: 0.2575 * width
                }}>
                <Text>
                    Already have an account?
                </Text>
            </Link>
            <Pressable
                onPress={() => registerUser()}>
                    <Text style={[styles.changeButtons, {backgroundColor: 'blue', margin: 8}]}>Submit</Text>
                </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
    viewContainer: {
        margin: 10
    },
    dayTitle: {
        fontSize: Platform.OS === 'web'? 18 : 9,
        padding: 8,
        textAlign: 'center',
        borderColor: 'black',
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        borderWidth: 3,
        borderBottomWidth: 0,
        borderStyle: 'solid'
    },
    exerciseDetails: {
        fontSize: Platform.OS === 'web'? 14 : 7,
        borderColor: 'black',
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
        backgroundColor: 'black',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        textTransform: 'uppercase',
        textAlign: 'center'
    }
})