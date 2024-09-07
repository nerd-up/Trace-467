import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native-paper'
import Colors from '../../theme/ScholarColors'
import useLoadingStore from '../../zustand/UseLoadingStore'
interface Props{
    loading?:boolean,
    
}
const Loading = ({loading}:Props) => {
    const { isLoading} = useLoadingStore();
  return (
    <>{ (loading===true || isLoading===true)&&
    <View style={styles.loadingContainer}>
        <ActivityIndicator style={styles.loader} animating color={Colors.primary}  size={65} />
      <Image style={styles.loadingImage} source={require('../../assets/Trace467.jpg')} />
    </View>
}
    </>
  )
}

export default Loading

const styles = StyleSheet.create({
  loadingContainer:{
   flex:1,
   position:'absolute',
   backgroundColor:'#b4f5a956',
   height:'100%',
   width:'100%',
   alignItems: 'center',
   justifyContent: 'center',

  },
  loadingImage:{
    height:45,
    width:45,
    borderRadius:50,
  },
  loader:{
    padding:5,
    position: 'absolute',
  }
})