import { Platform, StyleSheet, View, Text, TextInput, Button, Pressable} from 'react-native';
import React, { cloneElement, useState} from 'react';
import { useNavigation } from 'expo-router';
import { useWindowDimensions } from 'react-native';

export default function changeWorkoutScreen() {
    const {width, height} = useWindowDimensions();

    const navigation = useNavigation();

    const [isSundayWorkoutToggled, setIsSundayWorkoutToggled] = useState(false)
    const [isMondayWorkoutToggled, setIsMondayWorkoutToggled] = useState(false)
    const [isTuesdayWorkoutToggled, setIsTuesdayWorkoutToggled] = useState(false)
    const [isWednesdayWorkoutToggled, setIsWednesdayWorkoutToggled] = useState(false)
    const [isThursdayWorkoutToggled, setIsThursdayWorkoutToggled] = useState(false)
    const [isFridayWorkoutToggled, setIsFridayWorkoutToggled] = useState(false)
    const [isSaturdayWorkoutToggled, setIsSaturdayWorkoutToggled] = useState(false)

    const [sundayWorkout, setSundayWorkout] = useState('')
    const [mondayWorkout, setMondayWorkout] = useState('')
    const [tuesdayWorkout, setTuesdayWorkout] = useState('')
    const [wednesdayWorkout, setWednesdayWorkout] = useState('')
    const [thursdayWorkout, setThursdayWorkout] = useState('')
    const [fridayWorkout, setFridayWorkout] = useState('')
    const [saturdayWorkout, setSaturdayWorkout] = useState('')

    const exerciseDetailsSizing = {
        width: Platform.OS === 'web'? 0.125 * width: 0.35 * width,
        height: Platform.OS === 'web'? 0.125 * height: 0.095 * height,
    }
    const titleSizing = {
        width: Platform.OS === 'web' ? 0.125 * width : 0.35 * width
    }

    // Retrieve day of the week and workout for that day from Flask backend
    async function changeWorkout() {
        let weeklyPlan = [sundayWorkout, mondayWorkout, tuesdayWorkout, wednesdayWorkout, thursdayWorkout, fridayWorkout, saturdayWorkout]
        let url = 'https://localhost:8429/changeWorkout'
        let packet = {
            action: 'CHANGE',
            data: {
                'weeklyPlan': weeklyPlan,
            }
        }
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(packet),
            credentials: 'include'
        }).then((resp) => {return resp.json()})
        if (response.status === 'ERROR') {
            console.error("Error:", response.body)
            navigation.getParent()?.navigate('index')
        }
    }

    return (
        <View
        style={{
                flex: 1,
                backgroundColor: '#0b2f42',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Text
            style={{
                margin: 16,
                color: '#D2B80F',
                fontSize: Platform.OS === 'web'? 24 : 12,
                fontWeight: '700'
            }}
            >Workout Plan</Text>
            <View
            style={{
                flexDirection: Platform.OS === 'web'? 'column' : 'row',
                backgroundColor: '#0b2f42',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View style={{flexDirection: Platform.OS === 'web'? 'row' : 'column'}}>
                    <View
                    style={styles.viewContainer}>
                        <Text
                        style={styles.dayTitle}>Sunday</Text>
                        <TextInput
                            style={[{
                                pointerEvents: isSundayWorkoutToggled? 'auto' : 'none',
                            }, 
                                styles.exerciseDetails, 
                                exerciseDetailsSizing]}
                            placeholder='Exercise Name'
                            placeholderTextColor={'#D2B80F'}
                            multiline={true}
                            onChangeText={NewText => setSundayWorkout(NewText)}
                        />
                        <Pressable
                            onPress={() => setIsSundayWorkoutToggled(!isSundayWorkoutToggled)}>
                            <Text
                            style={[styles.changeButtons, titleSizing]}
                            >Change Workout</Text>
                        </Pressable>
                    </View>
                    <View 
                    style={styles.viewContainer}>
                        <Text
                        style={styles.dayTitle}>Monday</Text>
                        <TextInput
                            style={[{
                                textAlignVertical: 'top',
                                pointerEvents: isMondayWorkoutToggled? 'auto' : 'none',
                            }, 
                                styles.exerciseDetails, 
                                exerciseDetailsSizing]}
                            placeholder='Exercise Name'
                            placeholderTextColor={'#D2B80F'}
                            multiline={true}
                            onChangeText={NewText => setMondayWorkout(NewText)}
                        />
                        <Pressable
                            onPress={() => setIsMondayWorkoutToggled(!isMondayWorkoutToggled)}>
                            <Text
                            style={[styles.changeButtons, titleSizing]}
                            >Change Workout</Text>
                        </Pressable>
                    </View>
                    <View
                    style={styles.viewContainer}>
                        <Text
                        style={styles.dayTitle}>Tuesday</Text>
                        <TextInput
                            style={[{
                                textAlignVertical: 'top',
                                pointerEvents: isTuesdayWorkoutToggled? 'auto' : 'none',
                            }, 
                                styles.exerciseDetails, 
                                exerciseDetailsSizing]}
                            placeholder='Exercise Name'
                            placeholderTextColor={'#D2B80F'}
                            multiline={true}
                            onChangeText={NewText => setTuesdayWorkout(NewText)}
                        />
                        <Pressable
                            onPress={() => setIsTuesdayWorkoutToggled(!isTuesdayWorkoutToggled)}>
                            <Text
                            style={[styles.changeButtons, titleSizing]}
                            >Change Workout</Text>
                        </Pressable>
                    </View>
                    <View
                    style={{
                        margin: 10
                    }}>
                        <Text
                        style={styles.dayTitle}>Wednesday</Text>
                        <TextInput
                            style={[{
                                textAlignVertical: 'top',
                                pointerEvents: isWednesdayWorkoutToggled? 'auto' : 'none',
                            }, 
                                styles.exerciseDetails, 
                                exerciseDetailsSizing]}
                            placeholder='Exercise Name'
                            placeholderTextColor={'#D2B80F'}
                            multiline={true}
                            onChangeText={NewText => setWednesdayWorkout(NewText)}
                        />
                        <Pressable
                            onPress={() => setIsWednesdayWorkoutToggled(!isWednesdayWorkoutToggled)}>
                            <Text
                            style={[styles.changeButtons, titleSizing]}
                            >Change Workout</Text>
                        </Pressable>
                    </View>
                </View>
                <View style={{flexDirection: 'column'}}>
                    <View style={{flexDirection: Platform.OS === 'web'? 'row' : 'column'}}>
                        <View
                        style={{
                            margin: 10
                        }}>
                            <Text
                            style={[styles.dayTitle, titleSizing]}>Thursday</Text>
                            <TextInput
                                style={[{
                                    textAlignVertical: 'top',
                                    pointerEvents: isThursdayWorkoutToggled? 'auto' : 'none',
                                }, 
                                    styles.exerciseDetails, 
                                    exerciseDetailsSizing]}
                                placeholder='Exercise Name'
                                placeholderTextColor={'#D2B80F'}
                                multiline={true}
                                onChangeText={NewText => setThursdayWorkout(NewText)}
                            />
                            <Pressable
                                onPress={() => setIsThursdayWorkoutToggled(!isThursdayWorkoutToggled)}>
                                <Text
                                style={[styles.changeButtons, titleSizing]}
                                >Change Workout</Text>
                            </Pressable>
                        </View>
                        <View
                            style={{
                                margin: 10
                            }}
                            >
                            <Text
                            style={styles.dayTitle}>Friday</Text>
                            <TextInput
                                style={[{
                                    textAlignVertical: 'top',
                                    pointerEvents: isFridayWorkoutToggled? 'auto' : 'none',
                                }, 
                                    styles.exerciseDetails, 
                                    exerciseDetailsSizing]}
                                placeholder='Exercise Name'
                                placeholderTextColor={'#D2B80F'}
                                multiline={true}
                                onChangeText={NewText => setFridayWorkout(NewText)}
                            />
                            <Pressable
                                onPress={() => setIsFridayWorkoutToggled(!isFridayWorkoutToggled)}>
                                <Text
                                style={[styles.changeButtons, titleSizing]}
                                >Change Workout</Text>
                            </Pressable>
                        </View>
                        <View
                        style={styles.viewContainer}>
                            <Text
                            style={styles.dayTitle}>Saturday</Text>
                            <TextInput
                                style={[{
                                    textAlignVertical: 'top',
                                    pointerEvents: isSaturdayWorkoutToggled? 'auto' : 'none',
                                }, 
                                    styles.exerciseDetails, 
                                    exerciseDetailsSizing]}
                                placeholder='Exercise Name'
                                placeholderTextColor={'#D2B80F'}
                                multiline={true}
                                onChangeText={NewText => setSaturdayWorkout(NewText)}
                            />
                            <Pressable
                                onPress={() => setIsSaturdayWorkoutToggled(!isSaturdayWorkoutToggled)}>
                                <Text
                                style={[styles.changeButtons, titleSizing]}
                                >Change Workout</Text>
                            </Pressable>
                        </View>
                    </View>
                    <Pressable
                        onPress={() => changeWorkout()}>
                        <Text
                        style={[styles.changeButtons, {backgroundColor: 'blue'}]}
                        >Submit</Text>
                    </Pressable>
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
        borderColor: '#0f4e70',
        color: '#D2B80F',
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