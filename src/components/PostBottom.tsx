import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, View, TextInput, Text, Platform, ActivityIndicator } from 'react-native'; // Import ActivityIndicator
import styles from '../styles/Styles';
import Colors from '../theme/ScholarColors';
import { setPostLike, deletePostLike, setPostComment, deletePostComment } from '../services/DataService';
import useUserProfileStore from '../zustand/UserProfileStore';
import { Fonts } from '../theme/Fonts';
import { checkAbusive } from '../utils/utitlity';
import Toast from 'react-native-toast-message';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import FastImage from "@d11/react-native-fast-image"

type PostBottomProps = {
    postID: string,
    userID: string,
    likes: any[],
    comments: any[],
    isLikedByCurrentUser: boolean,
    LikeIcon: any,
    fetchAllLikes: () => void
}

const PostBottom = (props: PostBottomProps) => {
    const navigation:any=useNavigation();
    const userProfile: any = useUserProfileStore(store => store);
    const [likeDisabled, setLikeDisabled] = useState(false);
    const [comment, setComment] = useState('');
    const [isLikedByCurrentUser, setIsLikedByCurrentUser] = useState(props.isLikedByCurrentUser);
    const [likes, setLikes] = useState(props.likes);
    const [LikeIcon, setLikeIcon] = useState(props.LikeIcon);
    const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        setLikes(props.likes);
        setIsLikedByCurrentUser(props.isLikedByCurrentUser);
        setLikeIcon(props.isLikedByCurrentUser ? require('../assets/icons/filled-like.png') : require('../assets/icons/like.png'));
    }, [props.likes, props.isLikedByCurrentUser]);

    const handleLikePost = async () => {
        setLikeDisabled(true);
        if (isLikedByCurrentUser) {
            setLikeIcon(require('../assets/icons/like.png'));
            await deletePostLike(props.postID, props.userID);
        } else {
            setLikeIcon(require('../assets/icons/filled-like.png'));
            await setPostLike(props.postID, props.userID);
        }
        props.fetchAllLikes();
        setLikeDisabled(false);
    }

    const sentComment = async () => {
        if (comment.length !== 0) {
            if (checkAbusive(comment) === true) {
                Toast.show({
                    type: 'error',
                    text1: 'You cannot use these kinds of abusive words!'
                });
                return;
            }
            await setPostComment(props.postID, props.userID, comment, userProfile.profilePic, userProfile.usrName);
            setComment('');
        } else {
            return;
        }
    }

    const toggleShowComments = () => {
        setLoading(true); // Set loading to true when comments are being loaded
        setShowComments(!showComments);
        setTimeout(() => {
            setLoading(false); // Simulate loading complete
        }, 1000); // Simulate a delay, replace with real data fetching delay if necessary
    };

    return (
        <View>
            <View style={styles.postBottom}>
                <View style={{ width: '50%', alignItems: 'center', borderRightWidth: 1, borderColor: 'gray' }}>
                    <TouchableOpacity disabled={likeDisabled} style={styles.actionBtn} onPress={handleLikePost}>
                        <FastImage source={LikeIcon} style={{
                            height: 20, width: 20,
                            tintColor: Colors.primary,
                        }} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: '50%', alignItems: 'center' }}>
                    <TouchableOpacity disabled={likeDisabled} style={styles.actionBtn} onPress={toggleShowComments}>
                        <FastImage source={require('../assets/icons/speech-bubble.png')} style={{
                            height: 20, width: 20,
                            tintColor: Colors.primary
                        }} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.postBottom}>
                <View style={{ width: '50%', alignItems: 'center' }}>
                    <Text style={{ color: Colors.text, padding: 2 }}>
                        {likes?.length}
                    </Text>
                </View>
                <View style={{ width: '50%', alignItems: 'center' }}>
                    <Text style={{ color: Colors.text, padding: 2 }}>
                        {props.comments?.length}
                    </Text>
                </View>
            </View>

            {showComments && (
                <View style={{ padding: 5, borderTopWidth: 1 }}>
                    {loading ? (
                        <ActivityIndicator size="large" color={Colors.primary} /> // Show loading spinner
                    ) : (
                        props.comments.map((comment, index) => {
                            return (
                                <View key={index}>
                                    <View style={{ padding: 5, flexDirection: 'row' }}>
                                        <TouchableOpacity onPress={()=>navigation.navigate('User',{userID:comment?.userID})}>
                                            {comment.profilePic.length > 1 ? (
                                                <FastImage source={{ uri: comment?.profilePic }} style={{ height: 40, width: 40, borderRadius: 50 }} />
                                            ) : (
                                                <FastImage source={require('../assets/icons/user.png')} style={{ height: 40, width: 40, borderRadius: 50 }} />
                                            )}
                                        </TouchableOpacity>
                                        <View style={{ justifyContent: 'flex-start', marginLeft: 10, backgroundColor: Colors.lightBackground, flex: 1, padding: 10, borderRadius: 5 }}>
                                            <Text style={{ fontSize: 18, color: 'black', fontFamily: Fonts.bold }}>
                                                {comment.usrName}
                                            </Text>
                                            <Text style={{ marginLeft: 2, color: Colors.text }}>
                                                {comment.comment}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
                                        <View style={{ flexDirection: 'row', width: '82%', justifyContent: 'space-between' }}>
                                            <Text>
                                                {comment.date}
                                            </Text>
                                            {comment?.userID === auth().currentUser?.uid && <TouchableOpacity onPress={() => deletePostComment(props.postID, props.userID, comment.commentID)}>
                                                <Text>
                                                    Delete
                                                </Text>
                                            </TouchableOpacity>}
                                        </View>
                                    </View>
                                </View>
                            );
                        })
                    )}

                    {!loading && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <TextInput
                                onChangeText={(txt) => setComment(txt)}
                                value={comment}
                                style={{ borderWidth: 1, flex: 1, borderRadius: 10, marginRight: 10, borderColor: 'gray', padding: Platform.OS === 'ios' ? 10 : 5 }}
                                placeholder='Type comment'
                            />
                            <TouchableOpacity style={{ backgroundColor: Colors.primary, padding: 10, borderRadius: 10 }} onPress={sentComment}>
                                <Text style={{ fontWeight: 'bold', color: 'white' }}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

export default PostBottom;
