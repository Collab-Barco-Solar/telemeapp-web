import React, { useEffect, useState, useContext } from "react"
import { Text, View, TouchableOpacity, StatusBar } from "react-native"
import styles from "./styles"
// import Speedometer, {
//     Background,
//     Arc,
//     Needle,
//     Progress,
//     Marks,
//     DangerPath
// } from 'react-native-cool-speedometer';
// import * as ProgressBar from 'react-native-progress';
import { GlobalContext } from "../../Context/GlobalContext";

export default function Info({navigation}) {
    const {
        data,
        voltage
    } = useContext(GlobalContext)

    function getSpeed(speed) {
        let speed_ = 0
        isNaN(speed) ? speed_ = 0 : speed_ = speed
        return parseFloat(speed_) * 1.94384
    }

    function getPercentage(value) {
        let percentage = 0
        isNaN(value) ? percentage = 0 : percentage = value / 4
        
        // 12.70+  -->  100%
        // 12.40   -->  75%
        // 12.20   -->  50%
        // 12.00   -->  25%
        // 11.80   -->  0%
        // with the voltage value, and the table above, we can estimate the percentage
        if (percentage >= 12.70) {
            return 100
        }
        else if (percentage >= 12.40) {
            // 12.40 --> 75%
            // 12.70 --> 100%
            return 75 + (percentage - 12.40) * (100 - 75) / (12.70 - 12.40)
        }
        else if (percentage >= 12.20) {
            return 50 + (percentage - 12.20) * (75 - 50) / (12.40 - 12.20)
        }
        else if (percentage >= 12.00) {
            return 25 + (percentage - 12.00) * (50 - 25) / (12.20 - 12.00)
        }
        else if (percentage >= 11.80) {
            return 0 + (percentage - 11.80) * (25 - 0) / (12.00 - 11.80)
        }
        else {
            return 0
        }
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#000" />

            <TouchableOpacity style={styles.buttonBack} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonBackText}>Voltar</Text>
            </TouchableOpacity>

            <View style={styles.main}>
                <Text style={styles.title}>
                    {getSpeed(data?.speed).toFixed(3)}
                </Text>
                {/* <Speedometer
                    value={getSpeed(data?.speed)}
                    max={14}
                    rotation={-120}
                    fontFamily='squada-one'
                    width={350}
                >
                    <Background />
                    <Arc arcWidth={4} />
                    <Needle
                        baseOffset={40}
                        circleRadius={20}
                    />
                    <DangerPath />
                    <Progress arcWidth={10} />
                    <Marks step={0.5} />
                </Speedometer> */}

                <View style={styles.percentageArea}>
                    {/* <ProgressBar.Bar
                        progress={getPercentage(voltage) / 100}
                        width={300}
                        height={40}
                        color={'#32CD32'}
                    /> */}
                    <Text style={styles.percentageText}>{getPercentage(voltage).toFixed(2)}%</Text>
                    {console.log(getPercentage(voltage).toFixed(2))}
                </View>
            </View>

        </View>
    )
}