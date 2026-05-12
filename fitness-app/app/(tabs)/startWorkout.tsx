import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { Platform, StyleSheet, View, Text, useWindowDimensions, Pressable} from 'react-native';

export default function startWorkout() {
    const {width, height} = useWindowDimensions();

    const navigation = useNavigation()

    const [day, setDay] = useState('')
    const [dailyWorkout, setDailyWorkout] = useState('')

    const [isTimerActive, setIsTimerActive] = useState(false)

    const [mins, setMins] = useState(0)
    const [secs, setSecs] = useState(0)

    const exerciseDetailsSizing = {
        width: Platform.OS === 'web'? 0.25 * width: 0.70 * width,
        height: 0.25 * height,
    }

    function setDataValues(dayValue:string, workoutValue:string) {
        setDay(dayValue)
        setDailyWorkout(workoutValue)
    }

    useEffect(() => {
        if (isTimerActive == true) {
            let startTime = Date.now()
            let timer = setInterval(() => {
                let currentTime = Date.now()
                let newMins = Math.floor((currentTime - startTime) / (1000 * 60))
                let newSecs = Math.round(((currentTime - startTime) / 1000) % 60)
                setMins(newMins)
                setSecs(newSecs)
            }, 1000)
            return () => clearInterval(timer)
        }}, [isTimerActive])
    
    useFocusEffect(() => {
        fetch('http://localhost:8429/getDailyWorkout', {credentials: 'include'})
        .then((response) => response.json())
        .then((json) => {{json.status === 'ERROR'? (() => {throw (json.body)})(): setDataValues(json.body.day, json.body.workout)}})
        .catch((error) => {
            console.error('Error:', error)
            navigation.getParent()?.navigate('index')
        })
    })

    return (
        <View
        style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            }}>
            <View
            style={styles.viewContainer}>
                <Text
                style={styles.dayTitle}>{day}</Text>
                <Text
                style={[
                    styles.exerciseDetails,
                    exerciseDetailsSizing
                ]}
                >{dailyWorkout}</Text>
            </View>
            <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: Platform.OS === 'web'? 0.25 * width: 0.70 * width,
            }}>
                <Pressable>
                    <Text
                    style={
                        styles.changeButtons
                    }>Skip</Text>
                </Pressable>
                <Pressable
                onPress={() => setIsTimerActive(true)}
                >
                    <Text
                    style={
                        styles.changeButtons
                    }>Complete a set</Text>
                </Pressable>
                <Pressable>
                    <Text
                    style={[
                        styles.changeButtons,
                        {backgroundColor: 'red'}
                    ]}>Exit</Text>
                </Pressable>
            </View>
            <View
            style={{
                flexDirection: 'column',
                alignItems: 'center',
                margin: 12
            }}
            >
                <Text 
                style={{
                    display: isTimerActive? 'flex' : 'none',
                    fontSize: Platform.OS === 'web'? 18 : 9
                }}
                >
                    Timer:
                </Text>
                <Text
                style={{
                    display: isTimerActive? 'flex' : 'none',
                    fontSize: Platform.OS === 'web'? 18 : 9
                }}
                >
                    {mins}:{secs < 10? '0' + secs: secs}
                </Text>
            </View>
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