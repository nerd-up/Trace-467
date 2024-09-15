import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserId } from '../utils/Auth';
import { showError, showSucess } from '../utils/utitlity';
import useLoadingStore from '../zustand/UseLoadingStore';
import useUserProfileStore from '../zustand/UserProfileStore';
import Toast from 'react-native-toast-message';
import PopUp from '../components/PopUp';
import PopUpMessage from '../components/PopUpMessage';
const Settings = ({navigation}:any) => {
    const { allowLoading,disableLoading} = useLoadingStore();
    const [visiblMsg,setvisibleMsg]=useState(false);
    const userProfile: any = useUserProfileStore(store => store)
    const signOut = () => {
        Alert.alert(
            "Logout Confirmation",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                   
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => {
                        auth().signOut().then(() => {
                            AsyncStorage.removeItem('userID');
                            navigation.navigate('Login');
                        }).catch(error => {
                            console.error("Sign out error: ", error);
                        });
                    }
                }
            ],
            { cancelable: false }
        );
    }

    const passwordReset=async()=>{
        auth().sendPasswordResetEmail(auth().currentUser?.email)
        .then((res)=>{
            setvisibleMsg(true);
setTimeout(() => {
     setvisibleMsg(false);
}, 2500);
       
        })
        .catch((error) => {
            showError('Error sending email: '+error?.code);
        })
    }
    const deleteUser = async() => {
        allowLoading();
        const userId=getUserId();
        Alert.alert(
            "Account Deletion Confirmation",
            "Are you sure you want to Delete your account? You will not be able to login again...",
            [
                {
                    text: "Cancel",
                   
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: () => {
                        auth().currentUser?.delete().then(() => {
                            firestore().collection('Users')
                            .doc(userId).get()
                            .then(()=>{
                                const userRef=firestore()
                                .collection("Users");
                                const friendRef=firestore()
                                .collection("Users")
                                .doc(userId)
                                .collection("Friends")
                                const friendSnapshot = friendRef
                                .get()
                                .then((snapshot:any)=>{
                                    disableLoading();
                                     AsyncStorage.removeItem('userID');
                            navigation.navigate('Login');
                            showSucess('Account Deleted!');
                                    snapshot?._docs?.map((friend:any)=>{
                                   userRef.doc(friend?._data?.friend)
                                   .collection('Friends')
                                   .doc(userId)
                                   .delete();
                                    })
                                    try {
                                        const querySnapshot:any =  friendRef.get();
                                        const batch = firestore().batch();
                                        querySnapshot?.forEach((doc :any)=> {
                                            batch.delete(doc.ref);
                                        });
                                
                                         batch.commit();
                                       
                                    } catch (error) {
                                    disableLoading();

                                  
                                    }
                                    try {
                                        const querySnapshot:any =  firestore()
                                        .collection('AllPosts')
                                        .doc(userId)
                                        .collection('Posts').get();
                                        const batch = firestore().batch();
                                        querySnapshot?.forEach((doc :any)=> {
                                            batch.delete(doc.ref);
                                        });
                                
                                         batch.commit();
                                       
                                    } catch (error) {
                                    disableLoading();
                                     
                                    }
                                    
                                })
                           
                            })
                            .catch((error:any)=>{
                                disableLoading();

                        Alert.alert("Account Deletion Error error: ", error?.code);
                            })
                            // AsyncStorage.removeItem('userID');
                            // navigation.navigate('Login');
                        }).catch(error => {
                            disableLoading();
                        Alert.alert("Account Deletion Error error: ", error?.code);
                        });
                    }
                }
            ], 
            { cancelable: false }
        );
    }
  return (
    <View  style={styles.container}>
        <PopUpMessage visible={visiblMsg} title='Email Sent' text='Reset password email sent successfully. Please check your inbox.' />
      <TouchableOpacity onPress={passwordReset} style={styles.btn}>
         <Text style={styles.title}>Password Reset</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => signOut()} style={styles.btn}>
         <Text style={styles.title}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => deleteUser()}>
         <Text style={[styles.title,{color:'red'}]}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#f2f2f2',
    padding:20,
  },
  btn:{
    padding:10,
    alignItems: 'center',
  },
  title:{
    fontSize:18,
    fontWeight:'bold',
  }
})