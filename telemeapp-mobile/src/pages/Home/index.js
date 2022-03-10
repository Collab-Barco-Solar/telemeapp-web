import React, { useEffect, useState, useContext } from "react"
import { Text, View, Button, Alert, TouchableOpacity } from "react-native"
import * as TaskManager from "expo-task-manager"
import * as Location from "expo-location"
import styles from "./styles"
import { Header } from "../../components/Header"
import socket from "../../services/socketio"
import { StatusBar } from "expo-status-bar"
import { GlobalContext } from "../../Context/GlobalContext"


const LOCATION_TASK_NAME = "LOCATION_TASK_NAME"
let foregroundSubscription = null

// Define the background task for location tracking
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error(error)
        return
    }
    if (data) {
        // Extract location coordinates from data
        const { locations } = data
        const location = locations[0]
        if (location) {
            console.log("Location in background", location.coords)
            // Send location to server
            socket.emit('updateGps', {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                speed: location.coords.speed,
            });
        }
    }
})

export default function Home({navigation}) {
    // Define position state: {latitude: number, longitude: number}
    const [position, setPosition] = useState(null)
    const [running, setRunning] = useState(false)

    const {
        setData,
    } = useContext(GlobalContext)

    // Request permissions right after starting the app
    useEffect(() => {
        const requestPermissions = async () => {
            const foreground = await Location.requestForegroundPermissionsAsync()
            if (foreground.granted) await Location.requestBackgroundPermissionsAsync()
        }
        requestPermissions()
    }, [])

    // Start location tracking in foreground
    const startForegroundUpdate = async () => {
        // Check if foreground permission is granted
        const { granted } = await Location.getForegroundPermissionsAsync()
        if (!granted) {
            console.log("location tracking denied")
            Alert.alert("Location tracking denied")
            return
        }

        // Make sure that foreground location tracking is not running
        foregroundSubscription?.remove()

        // Start watching position in real-time
        foregroundSubscription = await Location.watchPositionAsync(
            {
                // For better logs, we set the accuracy to the most sensitive option
                accuracy: Location.Accuracy.BestForNavigation
            },
            location => {
                setPosition(location.coords)
                setData(location.coords)
            }
        )
    }

    // Stop location tracking in foreground
    const stopForegroundUpdate = () => {
        foregroundSubscription?.remove()
        setPosition(null)
    }

    // Start location tracking in background
    const startBackgroundUpdate = async () => {
        // Don't track position if permission is not granted
        const { granted } = await Location.getBackgroundPermissionsAsync()
        if (!granted) {
            console.log("location tracking denied")
            return
        }

        // Make sure the task is defined otherwise do not start tracking
        const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME)
        if (!isTaskDefined) {
            console.log("Task is not defined")
            return
        }

        // Don't track if it is already running in background
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(
            LOCATION_TASK_NAME
        )
        if (hasStarted) {
            console.log("Already started")
            return
        }

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            // For better logs, we set the accuracy to the most sensitive option
            accuracy: Location.Accuracy.BestForNavigation,
            // Make sure to enable this notification if you want to consistently track in the background
            showsBackgroundLocationIndicator: true,
            foregroundService: {
                notificationTitle: "Location",
                notificationBody: "Location tracking in background",
                notificationColor: "#fff",
            },
        })
    }

    // Stop location tracking in background
    const stopBackgroundUpdate = async () => {
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(
            LOCATION_TASK_NAME
        )
        if (hasStarted) {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME)
            console.log("Location tacking stopped")
        }
    }

    function startTracking() {
        setRunning(true)
        startBackgroundUpdate()
        startForegroundUpdate()        
    }

    function stopTracking() {
        setRunning(false)
        stopBackgroundUpdate()
        stopForegroundUpdate()
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Header />
            <Text style={styles.status}>
                    {running ? "Ativado" : "Desativado"}
                </Text>
                { running ?
                    <>
                        <Text>Longitude: {position?.longitude}</Text>
                        <Text>Latitude: {position?.latitude}</Text>
                        <Text>Velocidade: {position?.speed.toFixed(3)} m/s</Text>
                    </>
                    :
                    <>
                        <Text> </Text>
                        <Text> </Text>
                        <Text> </Text>
                    </>
                }
            <View style={styles.main}>
                <TouchableOpacity 
                    style={ running ? styles.buttonDisabled : styles.buttonActive}
                    onPress={() => {
                        if (running) {
                            stopTracking()
                        } else {
                            startTracking()
                            navigation.navigate('Info')
                        }
                    }}
                >
                    <Text style={styles.buttonText}>
                        {running ? "Parar" : "Iniciar"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}