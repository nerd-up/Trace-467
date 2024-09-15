import React, { useEffect, useState } from 'react'
import { View, TextInput, ScrollView, StyleSheet, Text, TouchableOpacity, Image, Alert, TouchableHighlight } from 'react-native'
// import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../theme/ScholarColors'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

const AllFriends = ({blockedUsers}:any) => {
    const navigation:any=useNavigation();
    const [search, setSearch] = useState('');
    const [friends, setFriends]: any = useState([]);

    const [popUpVisibility, setPopUpVisibility] = useState(false);
    const toggleVisibility = () => {
        if (popUpVisibility == false) {
            setPopUpVisibility(true);
        } else {
            setPopUpVisibility(false);
        }
    }
    const fetchAllFriends = async () => {
        const userId = auth().currentUser?.uid;
        if (!userId) {
            console.log("No user ID found");
            return;
        }
        try {
            const friendSnapshot = await firestore()
                .collection("Users")
                .doc(userId)
                .collection("Friends")
                .get();
            
            const frnds = friendSnapshot.docs.map(doc =>
                // console.log("first:",doc.data());
                doc.data()
            );
            
            if (frnds.length > 0) {
                const friendRequestsPromises = frnds.map(async (frnd: any) => {
                   
                    const senderDoc = await firestore().collection("Users").doc(frnd.friend).get();
                    
                    return senderDoc.data();
                });
                const requests = await Promise.all(friendRequestsPromises);
                
                setFriends(requests);
            }
        } catch (error) {
            console.log("An error occurred", error);
        }
    }
    const moveNext=(userID:any)=>{
        navigation.navigate('User',{userID:userID});
    }
    useEffect(() => {
        fetchAllFriends();
    }, []);
    return (
        <View>
            <View style={stylings.searchBar}>
                <TextInput style={stylings.searchBarInput} value={search} onChangeText={(text) => setSearch(text)} placeholder='Search for Friends'>
                </TextInput>
            </View>
            <ScrollView>
                <View style={stylings.classmatesList}>
                    {
                        friends.map((friend: any, index: any) => {
                            return (

                               blockedUsers?.find((item:any)=>item?.userID!==friend?.userID)&& friend.usrName.toLowerCase().includes(search.toLowerCase()) ?
                                    <View style={stylings.classmate} key={index}>
                                        <TouchableOpacity onPress={()=>moveNext(friend.userID)}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={stylings.classmateIcon}>
                                                    {
                                                        friend.profilePic?.length>1 ?
                                                            <Image source={{ uri: friend.profilePic }} style={{ height: 60, width: 60, borderRadius: 50 }}></Image>
                                                            :
                                                            <Image source={require('../assets/icons/user.png')} style={{ height: 60, width: 60, borderRadius: 50 }}></Image>
                                                    }
                                                </View>
                                                <View style={stylings.classmateTexts}>
                                                    <Text style={stylings.classmateName}>
                                                        {friend.usrName}
                                                    </Text>
                                                    <Text style={stylings.classmateSchool}>
                                                        {friend.bio}
                                                    </Text>
                                                    <Text style={stylings.citizenshipStyle}>
                                                        {friend.residency}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={stylings.dots}>
        <Menu>
          <MenuTrigger>
            {/* <TouchableHighlight> */}
              {/* <Icon name='ellipsis-vertical-outline' size={25} /> */}
            {/* </TouchableHighlight> */}
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => Alert.alert(`Option 1 for ${friend.usrName}`)} text='Chat' />
            <MenuOption onSelect={() => Alert.alert(`Option 2 for ${friend.usrName}`)} text='Unfriend' />
          </MenuOptions>
        </Menu>
      </View>
                                    </View>
                                    :
                                    null
                            );
                        })
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default AllFriends
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
        justifyContent: 'space-between',
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
        // marginLeft: 95,

    },
    citizenshipStyle: {

    }
})

