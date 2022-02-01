import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    main: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    status: {
        fontSize: 35,
        fontWeight: "bold",
        marginTop: 30,
    },
    buttonActive: {
        backgroundColor: "#228B22",
        width: 300,
        height: 300,
        borderRadius: 150,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonDisabled: {
        backgroundColor: "#B22222",
        width: 300,
        height: 300,
        borderRadius: 150,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 60,
        fontWeight: "bold",
        color: "#fff",
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        marginTop: 15,
    },
    separator: {
        marginVertical: 8,
    },
})

export default styles;