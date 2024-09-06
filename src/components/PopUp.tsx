import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
// import Icon from 'react-native-vector-icons/Entypo'
import Colors from '../theme/ScholarColors'
const PopUp = (props: any) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.crossButtonStyle} onPress={props.func}>
                {/* <Icon name="circle-with-cross" color={Colors.text} size={30} /> */}
            </TouchableOpacity>
            <View style={styles.messageBoxStyle}>
                <View style={styles.textContainer}>
                <Text>Message Classmate</Text>
                    {/* <Icon name="message" color={Colors.text} size={30} /> */}
                </View>
                <View style={styles.textContainer}>
                    <Text>Remove Classmate</Text>
                    {/* <Icon name="remove-user" color={Colors.text} size={30} /> */}
                </View>
            </View>
        </View>
    )
}
const styles=StyleSheet.create({
    container:{
        position: 'absolute',
            zIndex: 99,//shan work on scholars
            alignSelf: 'center',
            backgroundColor: 'white',
            alignItems: 'center',
            height: 150,
            width: 200,
            margin: 250,
            borderRadius: 10,
            flexDirection: 'column'
    },
    crossButtonStyle:{
        position: 'absolute',right:2 
    },
    messageBoxStyle:{
        flex:1, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', alignContent: 'center'
    },
    textContainer:{
        marginTop: 20, flexDirection: 'row', alignSelf: 'center', alignContent: 'space-between' 
    }

})
export default PopUp;