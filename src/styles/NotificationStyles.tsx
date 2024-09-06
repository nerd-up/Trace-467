import { StyleSheet } from "react-native";
import Colors from "../theme/ScholarColors";
import { Fonts } from "../theme/Fonts";

const notificationStyles = StyleSheet.create({
    notificationContainer:{
        margin:1,
        padding:2,
        backgroundColor: Colors.lightBackground,
        
    },
    notificationBox:{
        margin:3,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth:1/2,
        marginBottom:5,
        borderColor:'gray'


    },
    nIcon:{
        borderRadius: 50,
    },
    nText:{
        color: Colors.text,
        marginLeft:5,
        width: 240,
    },
    nDots:{
        marginLeft: 49,
    }
})

export default notificationStyles