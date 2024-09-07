import React, { useEffect, useState } from 'react'

import { View, TextInput, ScrollView, StyleSheet, Text, TouchableOpacity, Image, ImageBackground, Alert, RefreshControl } from 'react-native'
// import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../theme/ScholarColors'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
const FriendRequests = ({blockedUsers}:any) => {
    const navigation: any = useNavigation();
    const [requests, setRequests]: any = useState([]);
    const [search, setSearch] = useState('');
    const [refresh,setRefresh]=useState(false);
    const [popUpVisibility, setPopUpVisibility] = useState(false);
    const fetchRequests = async () => {
        setRefresh(true);
        const userId = auth().currentUser?.uid;
        if (!userId) {
          
            return;
        }

        try {
            const friendRequestsSnapshot = await firestore()
                .collection("Users")
                .doc(userId)
                .collection("FriendRequests")
                .get();

            const friendRequests = friendRequestsSnapshot.docs.map(doc => doc.data());
           
            setRefresh(false);
            if (friendRequests.length > 0) {
                const friendRequestsPromises = friendRequests.map(async (request: any) => {
                    const senderDoc = await firestore().collection("Users").doc(request.sender).get();
                    return senderDoc.data();
                });

                const requests = await Promise.all(friendRequestsPromises);
               
                setRequests(requests); // Assuming setRequests is a state setter function
            } 
        } catch (error) {
            // console.log("An error occurred", error);
            setRefresh(false);

        }
    };
    const toggleVisibility = () => {
        if (popUpVisibility == false) {
            setPopUpVisibility(true);
        } else {
            setPopUpVisibility(false);
        }
    }
    const acceptRequest = async (friend: any) => {
        try {
            const userId = auth().currentUser?.uid;
            if (!userId) {
                throw new Error("User is not authenticated");
            }
            const userFriendsRef = firestore()
                .collection("Users")
                .doc(userId)
                .collection("Friends")
                .doc(friend);

            const friendFriendsRef = firestore()
                .collection("Users")
                .doc(friend)
                .collection("Friends")
                .doc(userId);

            const userFriendRequestsRef = firestore()
                .collection("Users")
                .doc(userId)
                .collection("FriendRequests")
                .doc(friend);

            await firestore().runTransaction(async (transaction) => {
                // Create a new chat room
                const chatRoomRef = firestore().collection("ChatRooms").doc();
                const chatRoomId = chatRoomRef.id;

                // Add friend to user's friends collection with chat room ID
                transaction.set(userFriendsRef, { friend, chatRoomId });

                // Add user to friend's friends collection with chat room ID
                transaction.set(friendFriendsRef, { friend: userId, chatRoomId });
                // Remove the friend request from user's friend requests collection
              userFriendRequestsRef.delete();
                transaction.set(chatRoomRef, {
                    users: [userId, friend],
                    createdAt: firestore.FieldValue.serverTimestamp(),
                  });

            });
            
            Alert.alert("Friend request accepted and saved successfully for both users.");
        } catch (err) {
            // console.log(err);
        }
    }
    const moveNext = (userID: any) => {
        navigation.navigate('User', { userID: userID });
    }
    useEffect(() => {
        fetchRequests();
        // console.log(requests);
    }, [])
    return (
        <View>
            <ImageBackground source={require('../assets/Trace467.jpg')} style={{ flex: 1,justifyContent:'center' ,}} resizeMode='cover'>

</ImageBackground>
            <View style={stylings.header}>
                <View>
                    <Text style={stylings.headerTextStyle}>
                        Friend Requests
                    </Text>
                </View>
                <View>
                    <Text style={stylings.headerTextStyle}>
                        {requests.length}
                    </Text>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={fetchRequests} />
            }>
                <View style={stylings.classmatesList}>
                    {
                        requests.length === 0 ?
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                <Text style={{ fontSize: 20 }}>
                                    You Got No Friend Requests
                                </Text>
                            </View> :
                            requests.map((friend: any, index: any) => {
                                return (
                                    blockedUsers?.find((item:any)=>item?.userID!==friend?.userID)&&
                                    <View style={stylings.classmate} key={index}>
                                        <TouchableOpacity onPress={() => moveNext(friend.userID)}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={stylings.classmateIcon}>
                                                    {
                                                        friend?.profilePic !== ' ' || friend?.profilePic !== '' ?
                                                            <Image source={{ uri: friend?.profilePic }} style={{ height: 60, width: 60, borderRadius: 50 }}></Image> :                             <Image style={{ height: 60, width: 60, borderRadius: 50 }} source={require('../assets/icons/user.png')}  /> 
                                                    }

                                                </View>
                                                <View style={stylings.classmateTexts}>
                                                    <Text style={stylings.classmateName}>
                                                        {friend?.usrName}
                                                    </Text>
                                                    <Text style={stylings.classmateSchool}>
                                                        {friend?.bio.slice(0, 15)}...
                                                    </Text>
                                                    <Text style={{width: 150}}>
                                                        {friend?.residency}
                                                    </Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{}}>
                                            <TouchableOpacity onPress={() => acceptRequest(friend?.userID)}>
                                                <View style={stylings.acceptButton}>
                                                    <Text style={stylings.acceptButtonText}>Accept</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{}}>
                                            <TouchableOpacity onPress={() => acceptRequest(friend?.userID)}>
                                                <View style={stylings.acceptButton}>
                                                    <Text style={stylings.acceptButtonText}>Remove</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                );
                            })
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default FriendRequests
const stylings = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 5,
        padding: 5,
    },
    headerTextStyle: {
        fontSize: 20,
        color: Colors.primary,
        fontWeight: 'bold'
    },
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
        marginLeft: 95,

    },
    acceptButton: {
        padding: 7,
        backgroundColor: Colors.primary,
        borderRadius: 10,
    },
    acceptButtonText: {
        fontSize: 16,
        color: "white"
    }
})

