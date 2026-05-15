import React, { useState, useEffect } from 'react';
import { useNavigation } from 'expo-router';
import { Platform, StyleSheet, View, Text, useWindowDimensions, Pressable, TextInput} from 'react-native';

export default function startWorkout() {
    const {width, height} = useWindowDimensions();

    const navigation = useNavigation()

    const [day, setDay] = useState('')
    const [dailyWorkout, setDailyWorkout] = useState('')

    const [showTimeButtons, setShowTimeButtons] = useState(false)
    const [isStopwatchActive, setIsStopwatchActive] = useState(false)
    const [isTimerActive, setIsTimerActive] = useState(false)
    const [hideStopwatchDisplay, setHideStopwatchDisplay] = useState(true)
    const [hideTimerLengthDisplay, setHideTimerLengthDisplay] = useState(true)

    const [hours, setHours] = useState(0)
    const [mins, setMins] = useState(0)
    const [secs, setSecs] = useState(0)

    const [timerInput, setTimerInput] = useState('')
    const [timeInMs, setTimeInMs] = useState(0)

    const exerciseDetailsSizing = {
        width: Platform.OS === 'web'? 0.25 * width: 0.70 * width,
        height: 0.25 * height,
    }

    function setDataValues(dayValue:string, workoutValue:string) {
        setDay(dayValue)
        setDailyWorkout(workoutValue)
    }

    function startTimer() {
        setHideTimerLengthDisplay(true)
        setTimerInput('')
        let input = timerInput.split(' ')
        if (input.length != 2) {
            throw new Error("String must be in the format [value] [measurement]")
        }
        let timeLength = Number(input[0])
        if (Number.isNaN(timeLength)) {
            throw new Error("Value for time length in the format [value] [measurement] could not be parsed as a Number")
        }
        let secondsList = ['s', 'sec', 'secs', 'second', 'seconds']
        let minutesList = ['min', 'mins', 'minute', 'minutes']
        let hoursList = ['hr', 'hrs', 'hour', 'hours']
        let validMeasurements = [secondsList, minutesList, hoursList].flat()
        let measurement = input[1]
        if (!(validMeasurements.includes(measurement))) {
            throw new Error("Measurement for time length in the format [value] [measurement] is not a valid measurement")
        }
        if (secondsList.includes(measurement)) {
            setTimeInMs(timeLength * 1000)
            setSecs(timeLength)
        }
        else if (minutesList.includes(measurement)) {
            setTimeInMs(timeLength * (1000 * 60))
            setMins(timeLength)
        }
        else if (hoursList.includes(measurement)) {
            setTimeInMs(timeLength * (1000 * 60 * 60))
            setHours(timeLength)
        }
        setIsTimerActive(true)
    }

    useEffect(() => {
        if (isTimerActive == true) {
            let startTime = Date.now() 
            startTime += timeInMs
            let timer = setInterval(() => {
                let currentTime = Date.now()
                let newHours = Math.floor((startTime - currentTime) / (1000 * 60 * 60))
                let newMins = Math.floor((startTime - currentTime) / (1000 * 60))
                let newSecs = Math.round(((startTime - currentTime) / 1000) % 60)
                setHours(newHours)
                setMins(newMins)
                setSecs(newSecs)
                if (newSecs == 0) {
                    setIsTimerActive(false)
                }
            }, 1000)
            return () => clearInterval(timer)
        }}, [isTimerActive])

    useEffect(() => {
        if (isStopwatchActive == true) {
            let startTime = Date.now()
            let stopwatch = setInterval(() => {
                let currentTime = Date.now()
                let newHours = Math.floor((currentTime - startTime) / (1000 * 60 * 60))
                let newMins = Math.floor((currentTime - startTime) / (1000 * 60))
                let newSecs = Math.round(((currentTime - startTime) / 1000) % 60)
                setHours(newHours)
                setMins(newMins)
                setSecs(newSecs)
            }, 1000)
            return () => clearInterval(stopwatch)
        }}, [isStopwatchActive])
    
    useEffect(() => {
        fetch('http://127.0.0.1:8429/getDailyWorkout', {credentials: 'include'})
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
                onPress={() => {
                    setShowTimeButtons(true)
                }}>
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
            }}>   
                <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    display: showTimeButtons? 'flex': 'none'
                }}>
                    <Pressable
                    onPress={() => {
                        setHideTimerLengthDisplay(false)
                        setHideStopwatchDisplay(true)
                        setIsStopwatchActive(false)
                    }}>
                        <Text
                        style={[styles.changeButtons, {marginRight: 8, padding: 10}]}>
                            Timer
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            setIsStopwatchActive(true)
                            setHideStopwatchDisplay(false)
                            setHideTimerLengthDisplay(true)
                        }}>
                        <Text
                        style={[styles.changeButtons, {marginLeft: 8}]}>
                            Stopwatch
                        </Text>
                    </Pressable>
                </View>
                <Text 
                style={{
                    display: hideStopwatchDisplay? 'none' : 'flex',
                    fontSize: Platform.OS === 'web'? 18 : 9
                }}>
                    Stopwatch:
                </Text>
                <Text
                style={{
                    display: hideStopwatchDisplay? 'none' : 'flex',
                    fontSize: Platform.OS === 'web'? 18 : 9
                }}>
                    {hours}:{mins < 10? '0' + mins: mins}:{secs < 10? '0' + secs: secs}
                </Text>
                <Text
                style={{
                    display: hideTimerLengthDisplay? 'none' : 'flex',
                    fontSize: Platform.OS === 'web'? 18 : 9,
                    marginTop: 8
                }}>
                    Timer Length:
                </Text>
                <TextInput
                placeholder='Ex. 30 secs, 20 mins, 1 hr'
                value={timerInput}
                onChangeText={NewText => setTimerInput(NewText)}
                style={{
                    display: hideTimerLengthDisplay? 'none' : 'flex',
                    fontSize: Platform.OS === 'web'? 12 : 6,
                    padding: 2,
                    borderWidth: 2,
                    borderColor: 'black',
                    borderRadius: 4,
                    margin: 8
                }}/>
                <Pressable
                onPress={() => startTimer()}>
                    <Text
                    style={[styles.changeButtons, {display: hideTimerLengthDisplay? 'none' : 'flex'}]}>
                        Submit
                    </Text>
                </Pressable>
                <Text 
                style={{
                    display: isTimerActive? 'flex' : 'none',
                    fontSize: Platform.OS === 'web'? 18 : 9
                }}>
                    Timer:
                </Text>
                <Text
                style={{
                    display: isTimerActive? 'flex' : 'none',
                    fontSize: Platform.OS === 'web'? 18 : 9
                }}>
                    {hours}:{mins < 10? '0' + mins: mins}:{secs < 10? '0' + secs: secs}
                </Text>
            </View>
            <Pressable
                onPress={() => {
                    setIsStopwatchActive(false)
                }}>
                <Text 
                style={[
                    styles.changeButtons, 
                    {backgroundColor: 'red', 
                    display: isStopwatchActive? 'flex' : 'none'
                }]}>
                    Stop
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