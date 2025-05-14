import { Platform, StyleSheet,Image, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import React from 'react'
import { GestureResponderEvent } from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import FastImage  from 'react-native-fast-image';

interface Props{
    style?:ViewStyle;
    onPress?: ((e: GestureResponderEvent) => void) | undefined;

}
const BackBtn = ({style,onPress}:Props) => {
    const navigation=useNavigation();
    function goBack(){
        navigation.goBack();
    }
  return (
    <TouchableOpacity style={[styles.container,style]} onPress={onPress || goBack}>
        <Image style={styles.icon} source={require('../assets/icons/back.png')} />
    </TouchableOpacity>
  )
}
export default BackBtn
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 20,
        top: Platform.OS === 'ios' ? 60 : 30, // Move down slightly
        zIndex: 999,
    },
    icon: {
        width: 35,  // Increase the size of the back arrow
        height: 35, // Increase the size of the back arrow
        resizeMode: 'contain',
        tintColor: 'grey',
    },
});
