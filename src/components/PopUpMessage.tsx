import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from 'react'

interface Props{
    title?:string;
    text: string,
    style?:ViewStyle,
    visible?:boolean
}
const PopUpMessage = ({text,title,style,visible}:Props) => {
  if (visible) return (
    <View style={[styles.container,style]}>
        <View style={styles.popup}>
            <View style={styles.rowTitle}>
      <Text style={styles.title}>{title}</Text>
      <Image style={{height:30,width:30,resizeMode:'contain'}} 
      source={require('../assets/icons/accept.png')} />
            </View>
      <Text style={styles.text}>{text}</Text>
        </View>
    </View>
  )
  else null
}

export default PopUpMessage

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        zIndex:99,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // elevation:8,
    },
    popup:{
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        maxWidth: 300,
        elevation: 2,
        zIndex:90,
    },
    text:{
        color: 'black',
        fontSize: 18,
        marginBottom: 10,
    },
    title:{
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
    },
    rowTitle:{
    flexDirection:'row',alignItems:'center',
    marginVertical:'2%',
    gap:10,
    }
})