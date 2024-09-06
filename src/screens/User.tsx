/**
 * @file currentUser.tsx
 * @description Displays user profile including background photo and user information.
 * @ownership Shan Ayub
 *
 * @last modified 27/08/2024
 */
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getPostLikes, fetchPosts } from '../services/DataService';
import FeedBox from '../components/FeedBox';
import Colors from '../theme/ScholarColors';
import Divider from '../components/Divider';
import { useIsFocused, useRoute } from '@react-navigation/native';
import FriendBox from '../components/FriendBox';
import MissionLine from '../components/MissionLine';
import { getProfile } from '../services/DataService';
import firestore from '@react-native-firebase/firestore';
import useUserProfileStore, { useLikesStore, usePostsStore } from '../zustand/UserProfileStore';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

const User = ({ navigation }: any) => {
    const isFocused = useIsFocused();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const allPosts = usePostsStore(store => store.posts);
    const setPostsData = usePostsStore(store => store.setAllPosts);
    const route=useRoute();
    const {userID}=route?.params;
    const [loading,setLoading]=useState(false);
    const allLikes = useLikesStore(store => store.likes);
    const setAllLikes = useLikesStore(store => store.setAllLikes);
    const [friends, setFriends] = useState<any[]>([]);
    const userProfile = useUserProfileStore(store => store);
    const [requests, setRequests]: any = useState([]);
    const fetchRequests = async (userID: string) => {
        const userId = userID;
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

            if (friendRequests.length > 0) {
                const friendRequestsPromises = friendRequests.map(async (request: any) => {
                    const senderDoc = await firestore().collection("Users").doc(request.sender).get();
                    return senderDoc.data();
                });

                const requests = await Promise.all(friendRequestsPromises);
                
                setRequests(requests); // Assuming setRequests is a state setter function
            }
        } catch (error) {
            console.log("An error occurred", error);
        }
    };

    const fetchAllFriends = async (userId: any) => {
        if (!userId) return;
        try {
            const friendSnapshot = await firestore()
                .collection("Users")
                .doc(userId)
                .collection("Friends")
                .get();
            const frnds = friendSnapshot.docs.map(doc => doc.data());
            if (frnds.length > 0) {
                const friendRequestsPromises = frnds.map(async (frnd: any) => {
                    const senderDoc = await firestore().collection("Users").doc(frnd.friend).get();
                    return senderDoc.data();
                });
                const requests: any = await Promise.all(friendRequestsPromises);
                setFriends(requests);
            }
        } catch (error) {
            console.log("An error occurred", error);
        }
    };

    const blockUser = async () => {
        const userDocRef = firestore()
            .collection("Users")
            .doc(userProfile?.userID)
            .collection("BlockedUsers")
            .doc(currentUser?.userID);
        const blockRef = firestore()
            .collection("Users")
            .doc(currentUser?.userID)
            .collection("BlockedByUsers")
            .doc(userProfile?.userID);

        const docSnapshot = await userDocRef.get();
        if (docSnapshot.exists) {
            Toast.show({ type: "info", text1: 'User is already Blocked!' });
            return;
        }

        await userDocRef.set({ userID: currentUser?.userID, name: currentUser?.usrName, profilePic: currentUser?.profilePic })
            .then(() => {
                blockRef.set({ userID: userProfile?.userID, name: userProfile?.usrName });
                Toast.show({ type: "success", text1: 'You Blocked this User' });
            })
            .catch(err => {
                Toast.show({ type: "error", text1: 'Failed to Block this User! ' + err.message });
            });
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
                
            })
            .catch((err) => {
                console.log('an error occurred', err);
            });
    };
    useEffect(() => {
      
        fetchAllFriends(userID);
        getProfile(userID)
            .then((profile: any) => setCurrentUser(profile))
            .catch(error => console.error('Error:', error));
        fetchRequests(userID);
    }, []);

    useEffect(() => {
       setLoading(true);
        fetchPosts(userID).then((posts: any) => {
            setLoading(false);
            const postsWithDateObjects = posts.map((post: any) => ({
                ...post,
                dateObject: new Date(post.time)
            })).sort((a: any, b: any) => b.dateObject.getTime() - a.dateObject.getTime());
            setPostsData(postsWithDateObjects);
        }).catch((err: any) => console.log("No posts"));
    }, [isFocused]);

  
    return (
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
            {loading === false && currentUser===undefined || currentUser===null  ? (
                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <ActivityIndicator  size={35} />
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Profile header */}
                    <ImageBackground
                        source={currentUser?.coverPic?.length > 0 ? { uri: currentUser.coverPic } : require('../assets/Trace467.jpg')}
                        style={styles.backgroundImage}
                    >
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Image source={require('../assets/icons/back.png')} style={styles.backIcon} />
                        </TouchableOpacity>
                        <View style={styles.headerContent}>
                            <View style={styles.profilePicContainer}>
                                {currentUser.profilePic !== " " ? (
                                    <Image source={{ uri: currentUser.profilePic }} style={styles.profilePic} />
                                ) : (
                                    <Image source={require('../assets/icons/user.png')} style={styles.defaultProfilePic} />
                                )}
                            </View>
                        </View>
                    </ImageBackground>

                    {/* User Details */}
                    <View style={styles.detailsContainer}>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{currentUser.usrName}</Text>
                            {currentUser.signed && (
                                <Image source={require('../assets/icons/checkmark.png')} style={styles.checkmarkIcon} />
                            )}
                            <Menu>
                                <MenuTrigger>
                                    <Image source={require('../assets/icons/dots.png')} style={styles.menuIcon} />
                                </MenuTrigger>
                                <MenuOptions>
                                    <MenuOption onSelect={() => navigation.navigate('ReportUser', { user: currentUser })} text='Report User' />
                                    <MenuOption onSelect={() => blockUser()} text='Block User' />
                                </MenuOptions>
                            </Menu>
                        </View>
                        <Text style={styles.residencyText}>{currentUser.residency}</Text>
                        {requests.length > 0 && requests.find((user: any) => (user?.userID === auth().currentUser?.uid)) ?
                            <View style={{ flex: 1, width: '90%', borderRadius: 20, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary }}>
                                <Text style={styles.residencyText}>Friend Request Sent</Text>
                                
                            </View> :
                            (
                                <View style={{ flex: 1, width: '90%', borderRadius: 20, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary }}>
                                    <Text style={styles.residencyText}>Send Request</Text>
                                    <TouchableOpacity
                                        onPress={() => sendRequest(currentUser.userID, auth().currentUser?.uid)}
                                    >
                                        <View style={styles.acceptButton}>
                                            <Image
                                                style={styles.icon}
                                                source={
                                                    require('../assets/icons/add-friend.png')
                                                }
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        {/* </View> */}
                        {/* ) : null; */}
                        <Divider />
                        <Text style={styles.bioHeading}>Game Types</Text>
                        <Text style={styles.bioText}>{currentUser.bio}</Text>
                    </View>

                    {/* Friends List */}
                    <View style={styles.friendsSection}>
                        <Text style={styles.friendsHeading}>Friends</Text>
                        <Text style={styles.seeAllText}>See All</Text>
                    </View>
                    <View style={styles.friendBoxContainer}>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                            <View style={styles.friendBoxes}>
                                {friends.map((friend: any, index: any) => (
                                    <FriendBox key={index} data={friend}  />
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Posts Feed */}
                    <MissionLine text="The Sportsman's App" />
                    <View style={styles.feedContainer}>
                        {allPosts.map((item: any, index: number) => (
                            <FeedBox
                                key={index}
                                admin={currentUser.usrName}
                                avatar={currentUser.profilePic}
                                time={item.time}
                                picture={item.image}
                                likes={allLikes.length}
                                contributes={0}
                                description={item.description}
                                postID={item.postId}
                                userID={item.userID}
                                navigation={navigation}
                            />
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
        justifyContent: 'flex-end',
    },
    headerContent: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    backButton: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        left: 10,
        backgroundColor:Colors.primary,
        padding:5,
        borderRadius:50
    },
    backIcon: {
        height: 30,
        width: 30,
        tintColor: 'black',
    },
    residency: {
        color: 'white',
        textAlign: 'center',
        fontSize: 50,
    },
    profilePicContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: 'transparent',
        height: 120,
        width: 120,
        bottom: -60,
        left: '50%',
        marginLeft: -60,
        borderRadius: 60,
    },
    profilePic: {
        height: '100%',
        width: '100%',
        borderRadius: 60,
        borderWidth: 5,
        borderColor: Colors.primary,
    },
    defaultProfilePic: {
        height: 80,
        width: 80,
        borderRadius: 50,
        borderWidth: 1,
    },
    detailsContainer: {
        alignItems: 'center',
        marginTop: 55,
        padding: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    residencyText: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginVertical: 5,
    },
    checkmarkIcon: {
        width: 20,
        height: 20,
        marginLeft: 5,
    },
    menuIcon: {
        width: 20,
        height: 20,
        marginLeft: 5,
    },
    bioHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
    },
    bioText: {
        fontSize: 16,
        textAlign: 'center',
        color: Colors.textSecondary,
        marginVertical: 10,
    },
    friendsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    friendsHeading: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    seeAllText: {
        fontSize: 15,
        color: Colors.primary,
    },
    friendBoxContainer: {
        padding: 10,
    },
    friendBoxes: {
        flexDirection: 'row',
    },
    feedContainer: {
        backgroundColor: Colors.feedBackground,
        padding: 10,
    },
    acceptButton: {
        padding: 10,
        borderRadius: 10,
    },
    icon: {
        fontSize: 16,
        color: 'white',
        tintColor: 'black',
        height: 20,
        width: 20,
    },
});

export default User;
