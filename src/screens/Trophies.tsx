import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Platform, FlatList, Button } from 'react-native';
import { ScholarMiniBanner } from '../components/UnifyBanner';
import Divider from '../components/Divider';
import FeedBox from '../components/FeedBox';
import firestore from '@react-native-firebase/firestore';
import Colors from '../theme/ScholarColors';
import { useNavigation } from '@react-navigation/native';
const Trophies = () => {
    const [feed, setFeed] = useState<any[]>([]);
    const [refresh, setRefresh] = useState(false);
    const [limit, setLimit] = useState(20); 
    const navigation = useNavigation<any>();

    const getAllPostsWithImages = useCallback(async (isLoadMore = false) => {
        try {
            setRefresh(true);
            const friendSnapshot = await firestore().collection("Users").get();
            const friends = friendSnapshot.docs.map(doc => doc.id);

            const allPostsPromises = friends.map(async friendId => {
                const postsSnapshot = await firestore()
                    .collection("AllPosts")
                    .doc(friendId)
                    .collection("Posts")
                    .limit(limit) // Limit the number of posts fetched
                    .get();
                const posts = postsSnapshot.docs.map(doc => doc.data());
                const userProfile = await firestore().collection("Users").doc(friendId).get();
                const userProfileData = userProfile.data();

                const postsLikes = await Promise.all(posts.map(async post => {
                    const likesSnapshot = await firestore()
                        .collection('AllPosts')
                        .doc(friendId)
                        .collection("Posts")
                        .doc(post.postId)
                        .collection("Likes")
                        .get();

                    const likes = likesSnapshot.docs.map(likeDoc => likeDoc.data());
                    return {
                        ...post,
                        userProfile: userProfileData,
                        likes: likes,
                        likesCount: likes.length
                    };
                }));
                return postsLikes;
            });

            const allPostsArrays = await Promise.all(allPostsPromises);
            const allPosts = allPostsArrays.flat();
            allPosts.sort((a, b) => b.likesCount - a.likesCount);
            if (isLoadMore) {
                setFeed(prevFeed => [...prevFeed, ...allPosts.filter((post: any) => post.image ? post : null)]);
            } else {
                setFeed(allPosts.filter((post: any) => post.image ? post : null));
            }
            setRefresh(false);
        } catch (error) {
            console.log("An error occurred", error);
            setRefresh(false);
        }
    }, [limit]);

    const loadMorePosts = () => {
        setRefresh(true)
        setLimit(prevLimit => prevLimit + 5); // Increase the limit to fetch more posts
        setRefresh(false);
    };

    useEffect(() => {
        getAllPostsWithImages();
    }, []); // Re-fetch posts whenever the limit changes
    return (
        <View style={styles.container}>
            <View style={styles.bannerContainer}>
                <ScholarMiniBanner text="Trophies" size={49} />
            </View>
            <Divider />
            <FlatList
                data={feed.slice(0,limit)}
                renderItem={({ item, index }) => (
                    <FeedBox
                        key={index}
                        admin={item.userProfile.usrName}
                        avatar={item.userProfile.profilePic}
                        time={item.time}
                        picture={item.image}
                        description={item.description}
                        postID={item.postId}
                        userID={item.userID}
                        index={index + 1}
                        navigation={navigation}
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={() => getAllPostsWithImages(false)} />
                }
                ListFooterComponent={() => (
                    <Button
                        title={refresh?
                            "Loading...":"Load More"}
                        color={Colors.primary}
                        onPress={loadMorePosts}
                        disabled={refresh} 
                    />
                )}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
        padding: 5,
        justifyContent: 'center',
        marginTop: Platform.OS === 'ios' ? '1%' : 0
    },
    bannerContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center'
    },
    feedContainer: {
        backgroundColor: Colors.feedBackground,
    }
});

export default Trophies;
