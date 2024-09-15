import React, { useEffect, useState } from 'react';
import { View, TextInput, ScrollView, StyleSheet, Text, TouchableOpacity, Image, RefreshControl } from 'react-native';
import Colors from '../theme/ScholarColors';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { limitText, showSucess } from '../utils/utitlity';
import useUserProfileStore from '../zustand/UserProfileStore';
import { getAllUsers } from '../services/DataService';
import { getUserId } from '../utils/Auth';

const FindFriends = ({ blockedUsers }: any) => {
    const navigation: any = useNavigation();
    const [users, setUsers]:any= useState([]);
    const [icon,setIcon]=useState(require('../assets/icons/add-friend.png'));
    // const [requests, setRequests] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [search, setSearch] = useState('');
    const [iconStates, setIconStates] = useState<{ [key: string]: boolean }>({}); // Track icon states
    const userProfile: any = useUserProfileStore((store) => store);
    const userId = userProfile?.userID;
    const [requests, setRequests]: any = useState([]);
    const [friends,setFriends]:any=useState([]);
    const fetchRequests = async () => {
        const userId = auth().currentUser?.uid;
        if (!userId) {
            console.log("No user ID found");
            return;
        }
        try {
            const friendRequestsSnapshot = await firestore()
                .collection("Users")
                .doc(userId)
                .collection("FriendRequests")
                .get();
            const friendRequests = friendRequestsSnapshot.docs.map(doc => doc.data());
            setRequests(friendRequests); 
        } catch (error) {
            console.log("An error occurred", error);
        }
    };

    const sendRequest = async (receiver: any, sender: any) => {
        const requestRef = firestore()
            .collection('Users')
            .doc(receiver)
            .collection('FriendRequests')
            .doc(sender); // Create the document with the sender's ID
        await requestRef
            .set({
                sender: sender,
                receiver: receiver,
                date: new Date().toISOString(),
            })
            .then((res) => {
                
                // Update icon state
                showSucess('Friend Request sent!');
                setIconStates((prevState) => ({
                    ...prevState,
                    [receiver]: true,
                }));
            })
            .catch((err) => {
                console.log('an error occurred', err);
            });
    };
    
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
    const moveNext = (userID: any) => {
        navigation.navigate('User', { userID: userID });
    };
    const checkIcon=(user:any)=>{
        let icon:any='';
        if(user?.requests?.find((request: any) => request?.sender === auth().currentUser?.uid)){
                icon=require('../assets/icons/right-arrow.png');
                
        }if(!(user?.requests?.find((request: any) => request?.sender == auth().currentUser?.uid))){
            icon=require('../assets/icons/add-friend.png')
        }
        if(friends.find((friend:any)=>friend.userID===user?.userID)){
            icon=require('../assets/icons/friends.png');
        }
        return icon;
    }

  
    useEffect(() => {
        fetchRequests();
        fetchAllFriends();
       
    }, []);
    const fetchUsers = async () => {
        try {
            setRefresh(true)
            await getAllUsers().then((users:any)=>{
                let usrs:any=[];
                users.map((usr:any)=>{
                    usr.icon=checkIcon(usr);
                    if(usr?.userID!==getUserId())
                    usrs.push(usr);
                })
                setUsers(usrs)
                setRefresh(false)
                
            }).catch((error:any)=>console.log(error))
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };
    console.log(users,"leh");
    
    useEffect(()=>{
        fetchUsers();
    },[]);
    return (
        <View>
            
            <View style={stylings.searchBar}>
                <TextInput
                    style={stylings.searchBarInput}
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                    placeholder="Find Friends..."
                />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom:170,}}
            refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={fetchUsers} />
            }
            >
                <View style={stylings.classmatesList}>
                    { users?.length>0&&users?.filter((user: any) => !requests.some((request: any) => request.receiver === user?.userID))
                        .map((user: any, index: any) => {
                            return blockedUsers?.find((item: any) => item?.userID !== user?.userID) &&
                                user.usrName.toLowerCase().includes(search.toLowerCase()) ? (
                                <View style={stylings.classmate} key={index+user?.userID}>
                                    <TouchableOpacity onPress={() => moveNext(user.userID)}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={stylings.classmateIcon}>
                                                {user.profilePic?.length>1 ? (
                                                    <Image
                                                        source={{ uri: user?.profilePic }}
                                                        style={{ height: 60, width: 60, borderRadius: 50 }}
                                                    />
                                                ) : (
                                                    <Image
                                                        source={require('../assets/icons/user.png')}
                                                        style={{ height: 60, width: 60, borderRadius: 50 }}
                                                    />
                                                )}
                                            </View>
                                            <View style={stylings.classmateTexts}>
                                                <Text style={stylings.classmateName}>
                                                    {limitText(user.usrName, 25)}
                                                </Text>
                                                <Text style={stylings.classmateSchool}>
                                                    {limitText(user.bio, 30)}
                                                </Text>
                                                <Text>{limitText(user.residency, 30)}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {users?.length>0&&
                                        <View>
                                        <TouchableOpacity
                                            onPress={() => sendRequest(user.userID, auth().currentUser?.uid)}
                                        >
                                            <View style={stylings.acceptButton}>
                                                {
                                                    <Image
                                                            style={stylings.icon}
                                                            source={
                                                             user.icon
                                                            }
                                                        /> 
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    }
                                </View>
                            ) : null;
                        })}
                </View>
            </ScrollView>
        </View>
    );
};

export default FindFriends;

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
    },
    classmatesList: {
        marginHorizontal: 8,
        padding: 5,
    },
    classmate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        margin: 4,
        width: '100%',
        backgroundColor: Colors.lightBackground,
        borderRadius: 5,
    },
    classmateName: {
        color: Colors.primary,
        overflow: 'hidden',
        fontWeight: 'bold',
    },
    classmateIcon: {
        borderRadius: 50,
    },
    classmateSchool: {
        color: Colors.text,
        overflow: 'hidden',
    },
    classmateTexts: {
        marginLeft: 9,
        overflow: 'hidden',
        padding: 2,
    },
    acceptButton: {
        padding: 10,
        borderRadius: 10,
    },
    icon: {
        fontSize: 16,
        color: 'white',
        tintColor: Colors.primary,
        height: 30,
        width: 30,
    },
});
