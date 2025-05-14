import { View, Text, Image } from 'react-native'
import React from 'react'
// import Icon from 'react-native-vector-icons/Entypo'
import FastImage from "@d11/react-native-fast-image"

export default function ThreeDots() {
  return (
    <View>
      <FastImage source={require('../assets/icons/three.png')}/>
    </View>
  )
}