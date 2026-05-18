import { Link } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, {useState} from 'react';
import {Platform,  StyleSheet, View, Text, TextInput, Button, Pressable} from 'react-native';
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';

export default function LoginScreen() {
    const {width, height} = useWindowDimensions();

    const router = useRouter();
    

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [visiblePasswordText, setVisiblePasswordText] = useState('');
    const [isPasswordLockToggled, setIsPasswordLockToggled] = useState(true);

    async function login() {
        let url = 'https://localhost:8429/login'
        let packet = {
            action: 'LOGIN',
            data: {
                'username':`${username}`,
                'password':`${password}`
            }
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify(packet),
            credentials: 'include',
        })
        setUsername('')
        setPassword('')
        setVisiblePasswordText('')
        router.navigate('/(tabs)') // IF USER LOGS IN
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
                backgroundColor: '#0b2f42',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
            <Text
                style={{
                    color: '#D2B80F',
                    fontWeight: 'bold',
                    fontSize: 20
                }}>
            Login
            </Text>
            <TextInput
                placeholder="Username"
                placeholderTextColor={'#D2B80F'}
                value={username}
                onChangeText={newText => setUsername(newText)}
                style={{
                    height: 40,
                    width: Platform.OS === 'web' ? 0.35 * width : 0.55 * width,
                    padding: 5,
                    margin: 8,
                    borderWidth: 1,
                    borderColor: '#0f4e70',
                    color: '#D2B80F'
                }}
            />
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                <TextInput
                    placeholder="Password"
                    placeholderTextColor={'#D2B80F'}
                    value={visiblePasswordText}
                    onChangeText={newText => {isPasswordLockToggled? hidePassword(newText) : showPassword(newText)}}
                    style={{
                        height: 40,
                        width: Platform.OS === 'web' ? 0.35 * width : 0.55 * width,
                        padding: 5,
                        marginTop: 8,
                        marginLeft: 36,
                        marginHorizontal: 8,
                        borderWidth: 1,
                        borderColor: '#0f4e70',
                        color: '#D2B80F'
                    }}
                />
                <Pressable
                    onPress={() => 
                        passwordLockPressed()
                    }>
                    <IconSymbol size={28} name={isPasswordLockToggled? 'lock' : 'lock.open'} color={"#D2B80F"}
                    style={{
                        marginTop: 8
                    }}
                    />
                </Pressable>
            </View>
            <Link href='/' 
                style={{
                    marginVertical: 4, 
                    marginLeft: 0.30 * width,
                    color: '#D2B80F'
                }}>
                <Text>
                    Don't have an account?
                </Text>
            </Link>
            <Pressable
                onPress={() => login()}>
                <Text style={[styles.changeButtons, {backgroundColor: 'blue'}]}>Submit</Text>
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