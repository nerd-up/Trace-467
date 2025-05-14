import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../styles/Styles';
import Colors from '../theme/ScholarColors';
import PostBottom from './PostBottom';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import useUserProfileStore from '../zustand/UserProfileStore';
import { deletePost } from '../services/DataService';
import FastImage from "@d11/react-native-fast-image"

type FeedBoxProps = {
    key: number,
    navigation?: any,
    avatar?: string,
    admin?: string,
    time?: string,
    description?: string,
    picture?: string,
    postID: string,
    userID: string,
    index: number
}

export default function FeedBox(props: FeedBoxProps) {
    const navigation: any = useNavigation();
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(false);
    const userProfile: any = useUserProfileStore(store => store)
    const [likes, setLikes] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [LikeIcon, setLikeIcon] = useState(require('../assets/icons/like.png'));

    const fetchAllLikes = () => {
        firestore()
            .collection("AllPosts")
            .doc(props.userID)
            .collection("Posts")
            .doc(props.postID)
            .collection("Likes")
            .onSnapshot(snapshot => {
                const likesArray = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setLikes(likesArray);
                const userLike = likesArray.some((like: any) => like.userID === auth().currentUser?.uid);
                setIsLikedByCurrentUser(userLike);
                setLikeIcon(userLike ? require('../assets/icons/filled-like.png') : require('../assets/icons/like.png'));
            });
    }
    const fetchAllComments = () => {
        firestore()
            .collection("AllPosts")
            .doc(props.userID)
            .collection("Posts")
            .doc(props.postID)
            .collection("Comments")
            .onSnapshot(snapshot => {
                const commentsArray = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setComments(commentsArray);
            });
    }
    
    useEffect(() => {
        
        fetchAllComments();
        fetchAllLikes();
        
    }, [props]);
    return (
        <View style={styles.post} >
            <View style={styles.postAdmin}>
                <View style={{ top: 10, right: 0, zIndex: 2, position: 'absolute' }}>
                    <Menu>
                        <MenuTrigger>
                            <FastImage source={require('../assets/icons/dots.png')} style={{ height: 20, width: 20, tintColor: 'black' }} />
                        </MenuTrigger>
                        <MenuOptions>
                            {auth().currentUser?.uid === props?.userID ?
                                <>
                                    <MenuOption onSelect={() => navigation.navigate('EditPost', { postID: props.postID })} text='Edit Post' />
                                    <MenuOption onSelect={() => deletePost(props?.userID, props?.postID)} text='Delete Post' />
                                </>
                                : <MenuOption onSelect={() => navigation.navigate('ReportPost', { postDetails: props })} text='Report Post' />
                            }
                        </MenuOptions>
                    </Menu>

                </View>
                <TouchableOpacity onPress={() => navigation.navigate('User', { userID: props.userID })}>
                    <View style={styles.avatarSection}>
                        {
                            props.avatar == null || props.avatar?.length < 2 ?
                                <FastImage style={styles.postHeaderProfile} source={require('../assets/icons/user.png')} /> :
                                <FastImage source={{ uri: props.avatar }} style={styles.postHeaderProfile} />
                        }
                    </View>
                </TouchableOpacity>
                <View style={styles.adminSection}>
                    <Text style={styles.postAdminName}>{props.admin}</Text>
                    <Text style={{ color: 'gray' }}>
                        {new Date(props.time).toLocaleDateString()}
                    </Text>
                </View>
            </View>
            {
                props.index === 1 || props.index === 2 || props.index === 3 ?
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <FastImage
                            source={require('../assets/icons/gym.png')}
                            style={{ height: 25, width: 25 }}
                        />
                        <Text style={{ marginHorizontal: 10, fontSize: 16 }}>
                            Top Picture
                        </Text>
                        <FastImage
                            source={require('../assets/icons/gym.png')}
                            style={{ height: 25, width: 25 }}
                        />
                    </View> : null
            }

            <View style={styles.postDescription}>
                <Text style={styles.postDescText}>
                    {props?.description}
                </Text>
            </View>
            {
                props?.picture?.length>1 ?
                    <View style={styles.postHolder}>
                        
                            
                        <FastImage source={{ uri: props?.picture }} style={{ resizeMode: 'cover', width: '100%', height: '100%' }} />

                        
                    </View>
                    : null
            }
            <PostBottom postID={props?.postID} userID={props?.userID} likes={likes} isLikedByCurrentUser={isLikedByCurrentUser} LikeIcon={LikeIcon} fetchAllLikes={fetchAllLikes} comments={comments} />
        </View>
    );
}
