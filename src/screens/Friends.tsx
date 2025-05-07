/**
 * @file Friends.tsx
 * @description ?
 * @ownership ?
 * @last modified 9/20/2023
 */
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';

import styles from '../styles/Styles';
import { ScholarMiniBanner } from '../components/UnifyBanner';
import Divider from '../components/Divider';
import Colors from '../theme/ScholarColors';
import PopUp from '../components/PopUp';
import Modal from "react-native-modal";
import AllFriends from '../components/AllFriends';
import FriendRequests from '../components/FriendRequests';
import firestore from '@react-native-firebase/firestore';
import FindFriends from '../components/FindFriends';
import { useRoute } from '@react-navigation/native';
import useUserProfileStore from '../zustand/UserProfileStore';
import Toast from 'react-native-toast-message';
import { getUserId } from '../utils/Auth';
const Friends = ({ navigation}: any,props:any ) => {
    const router:any=useRoute();
    const userProfile: any = useUserProfileStore(store => store)
    const [selectedOption,setSelectedOption] =useState(router.params?.selectedOption==="Your Buddies"?router.params?.selectedOption:"Suggestions");
    const [search, setSearch] = useState('');
    const [allUsers,setAllUsers]=useState([]);
    const [popUpVisibility, setPopUpVisibility] = useState(false);
    const toggleVisibility = () => {
        if (popUpVisibility == false) {
            setPopUpVisibility(true);
        } else {
            setPopUpVisibility(false);
        }
    }
    const getBlockedUsers=async()=>{
       const blockedUsers=  await firestore()
        .collection("Users")
        .doc(getUserId())
        .collection('BlockedUsers')
        .get()
            let users:any=[];
         blockedUsers?.docs.map(doc =>
                users.push(doc.data())
            );

            const blockedByUsers=  await firestore()
            .collection("Users")
            .doc(getUserId())
            .collection('BlockedByUsers')
            .get()
            blockedByUsers?.docs.map(doc =>
                users.push(doc.data())
            );

            setAllUsers(users || []);
    }

    useEffect(() =>{
        getBlockedUsers();
      },[])

      
    return (
        <View style={styles.container}>
            
            { 
                popUpVisibility ? <PopUp func={toggleVisibility}/>
                    : null
            } 
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <ScholarMiniBanner text="Friends" size={49} />
            </View>
            <Divider />
            <View style={{flexDirection:'row',justifyContent:'space-between',margin:10,padding:10}}>
                <TouchableOpacity onPress={()=>setSelectedOption("Friend Requests")}>
                    <View style={selectedOption==="Friend Requests"?{backgroundColor:Colors.primary,padding:10,borderRadius:20}:{backgroundColor:"gray",padding:10,borderRadius:20}}>
                        <Text style={{color:"black"}}>
                            Friend Requests
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setSelectedOption("Suggestions")}>
                <View style={selectedOption==="Suggestions"?{backgroundColor:Colors.primary,padding:10,borderRadius:20}:{backgroundColor:"gray",padding:10,borderRadius:20}}>
                        <Text style={{color:"black"}}>
                            Suggestions
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setSelectedOption("Your Friends")}>
                <View style={selectedOption==="Your Friends"?{backgroundColor:Colors.primary,padding:10,borderRadius:20}:{backgroundColor:"gray",padding:10,borderRadius:20}}>
                        <Text style={{color:"black"}}>
                            Your Friends
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            
            {
                selectedOption==="Your Friends"?
                <AllFriends getBlockedUsers={getBlockedUsers} blockedUsers={allUsers}/>:null
            }
            {
                selectedOption==="Friend Requests"?
                <FriendRequests getBlockedUsers={getBlockedUsers} blockedUsers={allUsers} />:null
            }
            {
                selectedOption==="Suggestions"?
                <FindFriends getBlockedUsers={getBlockedUsers} blockedUsers={allUsers}/>:null
            }
            <ImageBackground source={require('../assets/logoo.png')} style={{ flex: 1,justifyContent:'center' ,}} resizeMode='cover'>

</ImageBackground>
        </View>
    )

}

export default Friends;
const stylings = StyleSheet.create({
    searchBar: {
        margin: 5,
        padding: 5,
        justifyContent: 'center',
    },
    searchBarInput: {
        marginLeft: 8,
        marginRight: 8,
        padding: 5,
        backgroundColor: Colors.lightBackground,
        fontSize: 15,
        borderRadius: 10,
    }
    ,
    classmatesList: {
        margin: 5,
        padding: 5,
    },
    classmate: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        margin: 4,
        backgroundColor: Colors.lightBackground,
        borderRadius: 5
    },
    classmateName: {
        color: Colors.primary,
        fontWeight: 'bold'
    },
    classmateIcon: {
        borderRadius: 50,
    },
    classmateSchool: {
        color: Colors.text,

    },
    classmateTexts: {
        marginLeft: 9,
        padding: 2,
    },
    dots: {
        marginLeft: 95,

    },
    citizenshipStyle: {

    }
})

