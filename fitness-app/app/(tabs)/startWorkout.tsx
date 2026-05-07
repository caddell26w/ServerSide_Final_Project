import React, { useEffect, useState} from 'react';
import { Platform, StyleSheet, View, Text} from 'react-native';

// "Start" workout tab
export default function startWorkout() {
    const [data, setData] = useState(null)

    // Connect to app.py
    useEffect(() => {
        fetch('http://127.0.0.1:8429')
        .then((response) => response.json())
        .then((json) => setData(json.body))
        .catch((error) => console.error('Connection Error:', error))
    }, []);
    return (
        <View
        style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
        <Text>{data}</Text>
        </View>
    )
}