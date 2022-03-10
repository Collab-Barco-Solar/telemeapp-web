import { StyleSheet } from "react-native"
import Constants from 'expo-constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    main: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: Constants.statusBarHeight + 20,
    },
    title: {
        fontSize: 80,
        fontWeight: "bold",
        color: "#000",
    },
    percentageArea: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    percentageText: {
        fontSize: 50,
        fontWeight: "bold",
        color: "#006400",
    },
    buttonBack: {
        position: "absolute",
        top: Constants.statusBarHeight + 20,
        left: 10,
        backgroundColor: "#FF0000",
        padding: 10,
        borderRadius: 10,
    },
    buttonBackText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFF",
    },
})

export default styles;