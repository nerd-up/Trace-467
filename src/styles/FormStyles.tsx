import { StyleSheet } from "react-native";
import Colors from "../theme/ScholarColors";
import { Fonts } from "../theme/Fonts";

const formStyles = StyleSheet.create({
    submitContainer: {
        flex: 1,
        width:'100%',
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    submitBtn: {
        backgroundColor: Colors.secondary,
        padding: 10,
        
        width: '90%',
        alignItems: 'center',
        borderRadius: 10,
        marginVertical: 10,
    },
    submitBtnContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap:10,
        width:'100%',
    },
    btnText: {
        fontSize: 15,
        color: Colors.linkColor,
        fontFamily: Fonts.regular
    },
    container: {
        // margin: 10,
        // padding: 10,
        alignItems: 'center',
        justifyContent:'center',
        width: '100%',
        borderRadius: 10,
        paddingBottom: 20,
    },
});

export default formStyles;