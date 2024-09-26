import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, FlatList, RefreshControl, Text, View } from 'react-native';

import FeedBox from '../components/FeedBox';
import { posts } from '../services/DataService';
import Colors from '../theme/ScholarColors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { getUserId } from '../utils/Auth';
type FeedProps = {
    scrollEnabled?: boolean,
    startReachedThreshold?: number,
    endReachedThreshold?: number,
    onStartReached?: () => void,
    onEndReached?: () => void,
}

const Feed = (props: FeedProps) => {
    const [feed, setFeed]:any = useState([]);
    const [loading, setLoading] = useState(true);
    const [limit,setLimit]=useState(20);
    const [refresh,setRefresh]=useState(false);
    const [blockedUsers,setBlockedUsers]=useState<any>();

    function onStartReachedCallback() {
        if (props.onStartReached !== undefined)
            props.onStartReached();
    }

    function onEndReachedCallback() {
        if (props.onEndReached !== undefined)
            props.onEndReached();
    }

    const fetchFeeds = async () => {
        setLoading(true);
        const userId = auth().currentUser?.uid;
        if (!userId) {
           
            return;
        }

        try {
            const friendSnapshot = await firestore()
                .collection("Users")
                //.doc(userId)
                //.collection("Friends")
                .get();
     
            const friends = friendSnapshot.docs.map(doc => doc.id);
            const allPostsPromises = friends.map(async friendId => {
                const postsSnapshot = await firestore()
                    .collection("AllPosts")
                    .doc(friendId)
                    .collection("Posts")
                    .get();

                const posts = postsSnapshot.docs.map(doc => doc.data());
                const userProfile = await firestore()
                    .collection("Users")
                    .doc(friendId)
                    .get();
                
                const userProfileData = userProfile.data();            
                return posts.map(post => ({
                    ...post,
                    userProfile: userProfileData
                }));
            });

            const allPostsArrays = await Promise.all(allPostsPromises);
            const allPosts:any = allPostsArrays.flat();
            allPosts.sort((a:any, b:any) => b.time - a.time); // Assuming `postdate` is a timestamp
            const publicPosts = allPosts?.length>0&& allPosts?.filter((post:any) => post.status === 'public');
            const filteredPosts = publicPosts?.filter((item:any) => 
            !blockedUsers.some((user:any) => user.userID === item.userID)
        );
            setFeed(filteredPosts || []);
        } catch (error) {
            // console.log("An error occurred", error);
        } finally {
            setLoading(false);
        }
    };
    const increaseLimit=()=>{
        setRefresh(true);
        setLimit(limit+limit);
        setRefresh(false);
    }
    useEffect(() => {
        fetchFeeds();
    }, [blockedUsers]);

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
 
             setBlockedUsers(users || []);
      
     } 

   useEffect(()=>{
    getBlockedUsers();
   },[])
    return (
        <View style={{ marginBottom:'15%' ,alignItems:'center',justifyContent:'center'}}>
            {
                loading===true?
                <ActivityIndicator
                size={'large'}
                color={Colors.primary}
                ></ActivityIndicator>:
                <FlatList
     
                onStartReached={onStartReachedCallback}
                onStartReachedThreshold={0.01}

                onEndReached={onEndReachedCallback}
                onEndReachedThreshold={0.01}

                showsVerticalScrollIndicator={false}
                scrollEnabled={props.scrollEnabled}
                data={feed.slice(0,limit)}
                renderItem={({ item }) => (

                    <FeedBox key={0} admin={item.userProfile.usrName} avatar={item.userProfile.profilePic}
                        time={item.time}
                        picture={item.image}
                        likes={item.likes}
                        contributes={item.contributes}
                        description={item.description}
                        postID={item.postId}
                        userID={item.userProfile.userID}
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={() => fetchFeeds()} />
                }
                ListFooterComponent={() => (
                    <Button
                        title={refresh?
                            "Loading...":"Load More"}
                        color={Colors.primary}
                        onPress={increaseLimit}
                        disabled={refresh} 
                    />
                )}
            />
            }
        </View>
    )
}

export default Feed