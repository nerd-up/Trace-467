/**
 * @file UserProfile.tsx
 * @description ?
 * @ownership David Edwards
 * 
 * @last modified 14/10/2023
 */

import React, { useEffect, useState } from 'react';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { getPostLikes, fetchPosts, posts } from '../services/DataService';
import FeedBox from '../components/FeedBox';
import Colors from '../theme/ScholarColors';
import Divider from '../components/Divider';
import { useIsFocused } from '@react-navigation/native';
import { getProfile } from '../services/DataService';
import styles from '../styles/Styles';
import { getUserId } from '../utils/Auth';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import useUserProfileStore, { useLikesStore, usePostsStore } from '../zustand/UserProfileStore';
import { Fonts } from '../theme/Fonts';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import FriendBox from '../components/FriendBox';
import Loading from '../components/loadings/Loading';
import ProfilePic from '../components/ProfilePic';
import FastImage from "@d11/react-native-fast-image"

const UserProfile = ({ navigation }: any) => {
    const [friends, setFriends]: any = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const userProfile: any = useUserProfileStore(store => store)
    const setProfilePic = useUserProfileStore(store => store.setProfilePic)
    const setProfileData = useUserProfileStore(store => store.setProfileData);
    const [postsData,setPosts]=useState<any>();
    const allPosts = usePostsStore(store => store.posts)
    const setPostsData = usePostsStore(store => store.setAllPosts)
    const allLikes = useLikesStore(store => store.likes)
    const setAllLikes = useLikesStore(store => store.setAllLikes)

    /**
     * useEffect used for loading data from DB
     */
    const countUnique = () => {
        const uniqueResidencies: Set<string> = new Set();
        friends.forEach((friend: any) => {
            uniqueResidencies.add(friend.residency);
        });
        return uniqueResidencies.size;

    }
    const fetchAllFriends = async () => {
        const userId = auth().currentUser?.uid;
        if (!userId) {
            return;
        }
        try {
            const friendSnapshot = await firestore()
                .collection("Users")
                .doc(userId)
                .collection("Friends")
                .get();
            const frnds = friendSnapshot.docs.map(doc =>
                doc.data()
            );
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
    }
    const PostLikes = (postID: string, userID: string) => {
        var likesArray: any = [];
        getPostLikes(postID, userID).then((likes: any) => {
            likes.forEach((like: any) => {
                likesArray.push(like);
            })
        })
            .catch((error) => { console.log("error:" + error); });
        setAllLikes(likesArray);
    }
    // const setAllPosts = (posts: any) => {
    //     let allPosts: any = [];
    //     posts.forEach((post: any) => {

    //         allPosts.push(post);
    //     })
    //     const postsWithDateObjects = allPosts.map((post: any) => ({
    //         ...post,
    //         dateObject: new Date(post.time)
    //     }));
    //     // Sort the posts in descending order
    //     postsWithDateObjects.sort((a: any, b: any) => b.dateObject.getTime() - a.dateObject.getTime());
    //     setPostsData(postsWithDateObjects);

    // }

    const extractTime = (time: string) => {
        const timestamp = new Date(time);
        const hours = timestamp.getHours();
        const minutes = timestamp.getMinutes();
        let dayOrNight = "PM";
        if (hours < 12) {
            dayOrNight = "AM"
        }
        return (hours + ":" + minutes + " " + dayOrNight);
    }
    useEffect(() => {
        fetchAllFriends();
        getProfile(getUserId())
            .then((profile: any) => {
                setProfileData(profile);
                setProfilePic(profile.profilePic);
            })
            .catch(error => {
                console.error('Errffor :', error);
            });
    }, []);

    useEffect(() => {
        fetchPosts(getUserId()).then((posts: any) => {
            setPosts(posts);

        }).catch((err: any) => console.log("No posts"));
    }, []);

    const getDetails = async () => {
        setRefresh(true);
        getProfile(getUserId())
            .then((profile: any) => {
                setRefresh(false);

                setProfileData(profile);

            })
            .catch(error => {
                setRefresh(false);
                console.error('Errffor :', error);
            });
        fetchPosts(getUserId()).then((posts: any) => {
            console.log(posts);
            setRefresh(false);
            const postsWithDateObjects = posts.map((post: any) => ({
                ...post,
                dateObject: new Date(post.time)
            })).sort((a: any, b: any) => b.dateObject.getTime() - a.dateObject.getTime());
            setPosts(postsWithDateObjects);
        }).catch((err: any) => console.log("No posts"));
    }
    const toogleShowProfile = () => {
        console.log("i am here");
        if (showProfile) {
            setShowProfile(false);
        } else {
            setShowProfile(true);
        }
    }

    return ( 
        <ScrollView style={{

            backgroundColor: Colors.background
        }}
            refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={getDetails} />
            }
        >
            {
                showProfile && <ProfilePic profile={userProfile?.profilePic} onPress={toogleShowProfile} />
            }
            <View>
                {/* <Loading /> */}

                <View>
                    <View>

                        <View>
                            <View style={{ justifyContent: 'center', width: '100%', position: 'relative' }}>

                                <FastImage style={styles.coverPhoto} source={userProfile?.coverPic?.length > 1 ? { uri: userProfile?.coverPic } : 
                                require('../assets/logoo.png')} />
                                <TouchableOpacity
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        margin: 10,
                                        backgroundColor: 'white',
                                        borderRadius: 10, // Adjust for square shape with a slight rounding
                                        height: 30, // Set a fixed height for the square
                                        width: 30, // Set a fixed width for the square
                                        alignItems: 'center', // Center the icon horizontally
                                        justifyContent: 'center' // Center the icon vertically
                                    }}
                                    onPress={() => navigation.push('EditProfile', { userProfile })}
                                >
                                    <FastImage
                                        source={require('../assets/icons/image-editing.png')}
                                        style={{
                                            tintColor: Colors.primary,
                                            height: 25,
                                            width: 25
                                        }}
                                    />
                                </TouchableOpacity>



                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    position: 'absolute',
                                    backgroundColor: 'transparent',
                                    height: 120,
                                    width: 120,
                                    bottom: -50,
                                    left: 10,  // Adjust left padding to position it against the right side of the screen
                                    borderRadius: 50,
                                }}>

                                    {
                                        userProfile.profilePic?.length > 1 ?
                                            <TouchableOpacity style={{
                                                height: 120,
                                                width: 120,
                                            }} onPress={toogleShowProfile}>
                                                <FastImage source={{ uri: userProfile.profilePic }} style={{
                                                    height: '100%',
                                                    width: '100%',
                                                    borderRadius: 60,
                                                    borderWidth: 5,
                                                    borderColor: Colors.primary
                                                }} />
                                            </TouchableOpacity> :
                                            <TouchableOpacity style={{
                                                height: 120,
                                                width: 120,
                                            }} onPress={toogleShowProfile}>
                                                <FastImage source={require('../assets/icons/user.png')} style={{
                                                    height: 80,
                                                    width: 80,
                                                    tintColor: 'black',
                                                    borderRadius: 50,
                                                    borderWidth: 1,
                                                }} />
                                            </TouchableOpacity>
                                    }

                                </View>

                                {/* Username, Checkmark, and Dots */}

                            </View>
                            <View style={{
                                marginTop: '15%',

                                alignItems: 'flex-start'
                            }}>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Menu>
                                        <MenuTrigger>
                                            <FastImage source={require('../assets/icons/dots.png')} style={{
                                                height: 20,
                                                width: 20,
                                                tintColor: Colors.primary,
                                                marginLeft: 10,
                                            }} />
                                        </MenuTrigger>
                                        <MenuOptions>
                                            <MenuOption onSelect={() => navigation.navigate('BlockedUsers')} text='Blocked People' />
                                        </MenuOptions>
                                    </Menu>

                                    <Text style={[styles.headingStyle]}>{userProfile.usrName}</Text>

                                    {userProfile.signed &&
                                        <FastImage source={require('../assets/icons/checkmark.png')} style={{
                                            height: 20,
                                            width: 20,
                                            tintColor: Colors.forrestGreen,
                                            marginLeft: 5,
                                        }} />
                                    }
                                </View>

                                <Text style={{
                                    fontFamily: Fonts.regular,
                                    fontSize: 18,
                                    marginLeft: '7.5%',
                                    color: 'black',
                                    // textAlign: 'right', // Ensure text alignment is to the right
                                }}>
                                    {userProfile.residency && userProfile.residency}
                                </Text>
                            </View>

                            {/* Other content */}
                            <View style={{
                                alignItems: 'flex-end',
                                marginTop: 10,
                                paddingRight: 10,
                            }}>

                            </View>

                        </View>


                        {/* Other UI elements */}
                        <Divider />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.headingStyle}>Outdoor Activities</Text>
                            <View style={{ margin: 0 }}>
                                <Text style={{ color: 'black' }}>{userProfile && userProfile.bio}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <Divider />

                {/* Friends List */}
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', padding: 10 }}>
                    <Text style={styles.headingStyle}>Crew</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Friends', { selectedOption: "Your Friends" })}>
                        <Text style={styles.linkStle}>See All</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.friendBoxContainer}>
                    <ScrollView horizontal={true} nestedScrollEnabled={true}>
                        <View style={styles.friendBoxes}>
                            {
                                friends.map((friend: any, index: any) => {
                                    return (
                                        <FriendBox key={index} data={friend} />
                                    );
                                })
                            }
                        </View>
                    </ScrollView>

                </View>
                <View style={{ marginLeft: 10 }}>
                    <Text style={styles.headingStyle}>Posts</Text>
                </View>
                <View>
                    <TouchableOpacity style={{
                        margin: 5,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        borderWidth: 1,
                        borderColor: 'black',
                        padding: 10,
                        borderRadius: 10,
                    }} onPress={() => navigation.push('Post', { userProfile })}>
                        <View>
                            <FastImage source={require('../assets/icons/user.png')} style={{
                                tintColor: Colors.primary, height: 30, width: 30
                            }} />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10, justifyContent: 'center' }}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    textAlign: 'left',  // Align text to the left
                                    width: '100%',      // Ensure it takes the full width available
                                }}
                            >
                                Make a post.....
                            </Text>
                        </View>
                        <View style={{ marginLeft: 5 }}>
                            <Icon name="image" size={35} color={Colors.primary} />
                        </View>
                    </TouchableOpacity>

                </View>
                <View style={styles.container}>
                    <View >

                            <View style={{backgroundColor: Colors.feedBackground}}>
                                { postsData?.length>0&& postsData.map((item: any, index: number) => (
                                    <FeedBox
                                        key={index}
                                        admin={userProfile?.usrName}
                                        avatar={userProfile?.profilePic}
                                        time={item.time}
                                        picture={item?.image}
                                        likes={allLikes?.length}
                                        contributes={0}
                                        description={item?.description}
                                        postID={item?.postId}
                                        userID={item?.userID}
                                        navigation={navigation}
                                    />
                                ))}
                            </View>
                       
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};
export default UserProfile;
