import { View, Text, StyleSheet, Alert } from 'react-native'
import React from 'react'
import Colors from '../theme/ScholarColors'
import { TouchableOpacity } from 'react-native'
import { useRoute } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import Toast from 'react-native-toast-message'
import useUserProfileStore from '../zustand/UserProfileStore'

const Report = ({navigation}:any) => {
   const route=useRoute();
	const userProfile: any = useUserProfileStore(store => store)
   const {postDetails}=route?.params;
  
   
    const reportReasons = [
        { id: 1, text: 'Spam' },
        { id: 2, text: 'Harassment or Bullying' },
        { id: 3, text: 'Hate Speech' },
        { id: 4, text: 'False Information' },
        { id: 5, text: 'Violence' },
        { id: 6, text: 'Nudity or Sexual Content' },
        { id: 7, text: 'Self-harm or Suicide' },
        { id: 8, text: 'Privacy Violation' },
        { id: 9, text: 'Illegal Activity' },
        { id: 10, text: 'Inappropriate Content' },
        { id: 11, text: 'Other' },
      ];

      const sendReport=async(report:string)=>{
        firestore()
        .collection('AllPosts')
        .doc(postDetails?.userID)
        .collection('Posts')
        .doc(postDetails?.postID)
        .collection('Reports')
        .add({reason:report,userID:userProfile?.userID})
        .then(()=>{
            Alert.alert("success","Reported Successfully");
          Toast.show({
            type:'success',
            text1:'Thanks for the report we will check it!',
          })
        })
        .catch((err)=>{
          Toast.show({
            type:'error',
            text1:'Failed to report',
          })
        });
      }
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Report Post</Text>
      <View style={styles.reasons}>
        { reportReasons.map((item:any,index:number)=>{
            
    return  <TouchableOpacity onPress={()=>sendReport(item.text)} key={item.id} style={styles.reason}>
      <Text style={styles.reasonTxt}>{item.text}</Text>
      </TouchableOpacity>
        })
}
      </View>
    </View>
  )
}

export default Report
const styles = StyleSheet.create({
 container:{
    backgroundColor:Colors.background,
    flex:1,
 },
 heading:{
    fontSize:18,
    fontWeight:'700',
    marginHorizontal:'2%',
 },
 reasons:{
  marginTop:'3%',
 },
 reason:{
   padding:5,
   borderBottomColor:Colors.lightBackground,
   borderBottomWidth:1,
 },
 reasonTxt:{
  fontSize:15,
  padding:2,
  marginHorizontal:'1%',
 }
})