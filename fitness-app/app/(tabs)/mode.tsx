import { Platform, StyleSheet, View, Text, TextInput, Button, Pressable} from 'react-native';
import { cloneElement, useState} from 'react';
import { useWindowDimensions } from 'react-native';

export default function changeWorkoutScreen() {
    const {width, height} = useWindowDimensions();

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
        height: 0.125 * height,
    }
    const titleSizing = {
        width: Platform.OS === 'web' ? 0.125 * width : 0.35 * width
    }

    function changeWorkout() {
        let weeklyPlan = [sundayWorkout, mondayWorkout, tuesdayWorkout, wednesdayWorkout, thursdayWorkout, fridayWorkout, saturdayWorkout]
        let url = 'http://127.0.0.1:8429/changeWorkout'
        let packet = {
            action: 'CHANGE',
            data: {
                'weeklyPlan': weeklyPlan,
            }
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(packet)
        })
    }

    return (
        <View
        style={{
                flex: 1,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Text
            style={{
                margin: 16
            }}
            >Workout Plan</Text>
            <View
            style={{
                flexDirection: Platform.OS === 'web'? 'column' : 'row',
                backgroundColor: 'white',
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
                            placeholderTextColor={'black'}
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
                            placeholderTextColor={'black'}
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
                            placeholderTextColor={'black'}
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
                            placeholderTextColor={'black'}
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
                                placeholderTextColor={'black'}
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
                                placeholderTextColor={'black'}
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
                                placeholderTextColor={'black'}
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