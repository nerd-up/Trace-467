import { StyleSheet } from "react-native";
import Colors from "../theme/ScholarColors";
import { Fonts } from "../theme/Fonts";

const formStyles = StyleSheet.create({
    submitContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    submitBtn: {
        backgroundColor: Colors.secondary,
        padding: 10,
        width: 300,
        alignItems: 'center',
        borderRadius: 10,
        margin: 10,
    },
    submitBtnContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap:10
    },
    btnText: {
        fontSize: 15,
        color: Colors.linkColor,
        fontFamily: Fonts.regular
    },
    container: {
        margin: 10,
        padding: 10,
        alignItems: 'center',
        width: '90%',
        height: 'auto',
        borderRadius: 10,
        paddingBottom: 20,
    },
});

export default formStyles;