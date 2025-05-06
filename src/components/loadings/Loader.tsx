import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
import { screenHeight, screenWidth } from '../../utils/utitlity'
import { ActivityIndicator } from 'react-native-paper'
import Colors from '../../theme/ScholarColors'

const Loader = ({loading}:any) => {
   if (loading==true)
  return (
    <View style={{position:'absolute',height:screenHeight,width:screenWidth,alignItems:'center',justifyContent:'center'}}>
    <ActivityIndicator color={Colors.primary} size={'large'} />
    </View>
  )
  else return <></>
}

export default Loader

const styles = StyleSheet.create({})