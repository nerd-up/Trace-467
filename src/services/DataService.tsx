/**
 * @file DataService.js
 * @Owner Muhammad Sultan
 * @Date modified 14.10.2023
 * @purpose all database functions will be here , we can create more similar files for database operation
 *
 */

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'

import { getUserId } from '../utils/Auth';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import { showError, showSucess } from '../utils/utitlity';
/**
 * Dummy data
 */

export const posts = [
    {
        key: '1',
        admin: 'David Edwards',
        avatar: 'person',
        picture: 'person',
        time: '25-09-2023',
        likes: 250,
        contributes: 250,
        description:
            ' someting like that, loremiposim someting like that, loremiposim someting like that, loremiposim',
    },
    {
        key: '2',
        admin: 'David Edwards',
        avatar: 'person',
        picture: 'person',
        time: '10:49 Am',
        likes: 20,
        contributes: 180,
        description:
            ' someting like that, loremiposim someting like that, loremiposim someting like that, loremiposim',
    },
    {
        key: '3',
        admin: 'David Edwards',
        avatar: 'person',
        picture: 'person',
        time: '25-09-2023',
        likes: 300,
        contributes: 200,
        description:
            ' someting like that, loremiposim someting like that, loremiposim someting like that, loremiposim',
    },
    {
        key: '4',
        admin: 'David Edwards',
        avatar: 'person',
        picture: 'person',
        time: '25-09-2023',
        likes: 400,
        contributes: 50,
        description:
            ' someting like that, loremiposim someting like that, loremiposim someting like that, loremiposim',
    },
    {
        key: '5',
        admin: 'David Edwards',
        avatar: 'person',
        picture: 'person',
        time: '12:30 Pm',
        likes: 390,
        contributes: 150,
        description:
            ' someting like that, loremiposim someting like that, loremiposim someting like that, loremiposim',
    },
    {
        key: '6',
        admin: 'David Edwards',
        avatar: 'person',
        picture: 'person',
        time: '25-09-2023',
        likes: 300,
        contributes: 250,
        description:
            ' someting like that, loremiposim someting like that, loremiposim someting like that, loremiposim',
    },

    // Add more data items as needed
];

/**
 *
 * @param {*} userID
 * @param {*} bio
 * @param {*} profilePic
 * @param {*} residency
 * @param {*} usrName
 * @param {*} signed
 *
 * @description we can call this to set profile data or update the current profile data
 */
export const getAllUsers = async () => {
    try {
        // Fetch all users from Firestore
        const allUsersSnapshot = await firestore().collection('Users').get();
        
        // Map through each user and fetch their friend requests
        const allUsers = await Promise.all(
            allUsersSnapshot.docs.map(async (userDoc) => {
                const userData = userDoc.data(); // Get user data
                const userId = userDoc.id; // Get user ID

                // Fetch friend requests for each user
                const friendRequestsSnapshot = await firestore()
                    .collection('Users')
                    .doc(userId)
                    .collection('FriendRequests')
                    .get();
                // Add the requests array to the user data
                userData.requests = friendRequestsSnapshot.docs.map(doc => doc.data());

                return userData;
            })
        );

        // Return the array of users including their friend requests
        return allUsers;
    } catch (error) {
        console.error('An error occurred:', error);
        throw error; // Re-throw the error if you want to handle it in the calling code
    }
};

export function setInProfile(
    userID: string,
    bio: string,
    profilePic: string,
    coverPic:string,
    residency: string,
    usrName: string,
    signed: string
) {
    console.log(getUserId())
   console.log("herehere",{bio,profilePic,coverPic,residency,usrName,signed})
    firestore()
        .collection('Users')
        .doc(getUserId())
        .set(
            {
                userID: getUserId(),
                bio: bio,
                profilePic: profilePic,
                coverPic: coverPic,
                residency: residency,
                usrName: usrName,
                signed: signed
            },
            { merge: true },
        )
        .then(() => {
            showSucess('Sucess','Successfully updated Profile!');
        })
        .catch(err => {
            showError('Error',err);
        });
}
export const getUsers = async () => {
    try {
        const usersRef = firestore().collection('Users');
        const snapshot = await usersRef.get();

        const users: any = [];
        snapshot.forEach(doc => {
            const snp = usersRef.doc(doc.id).get();

        });

        return users;
    } catch (error) {
        console.error('Error getting users: ', error);
        throw error;
    }
};
export function fetchSignedUsers(callback:any) {
    return firestore()
        .collection('Users')
        .where('signed', '!=', "") // Fetch users where 'signed' is not an empty string
        .onSnapshot(
            querySnapshot => {
                const users:any = [];
                querySnapshot.forEach(documentSnapshot => {
                    users.push({
                        ...documentSnapshot.data(),
                        id: documentSnapshot.id
                    });
                });
                console.log("first:",users)
                callback(users);
            },
            error => {
                console.error('Error fetching signed users in real-time:', error);
            }
        );
}
export function saveSignatures(
    signed: string
) {
    const date=new Date().toLocaleDateString();
    firestore()
        .collection('Users')
        .doc(getUserId())
        .update(
            {
                signed: signed,
                treatyDate:date,
            },
        )
        .then(() => {
            console.log('success!');
            Toast.show({
                text1:"Congrats🥳!!",
                text2:"You are a Sportsman!"
            })
        })
        .catch(err => {
            console.log("i got an error");
        });
}

export function setInPost(userID: string, image: string, description: string, time: string, status: string) {

    const postCollection = firestore().collection('AllPosts').doc(userID).collection('Posts');
    const newPostDoc = postCollection.doc(); // This creates a new document reference with an auto-generated ID
    const newPostId = newPostDoc.id;

    firestore()
        .collection('AllPosts')
        .doc(userID)
        .collection('Posts')
        .doc(newPostId)
        .set({
            userID,
            postId: newPostId,
            image,
            description,
            time,
            status,
        })
        .then(() => {
            console.log('success!');
            showSucess('Success','Uploaded successfully');
        })
        .catch(err => {
            console.log(err);
            showError('Failed to upload', err);
        });
}

export function deletePost(userID: string, postId:string) {
    firestore()
        .collection('AllPosts')
        .doc(userID)
        .collection('Posts')
        .doc(postId)
        .delete()
        .then(() => {
            console.log('success!');
            showSucess('Success','Post Deleted successfully');
        })
        .catch(err => {
            console.log(err);
            showError('Failed to upload', err);
        });
}

/**
 *
 * @param {string} userID
 * @returns a promise with the   profile data
 * @description this is used to get the user profile data, and this unction can be called in any
 * component if you have userId there
 */
export const getProfile = (userID: string) => {
    return new Promise((resolve, reject) => {
        firestore()
            .collection('Users')
            .doc(userID)
            .onSnapshot(documentSnapshot => {
                if (documentSnapshot.exists) {
                    resolve(documentSnapshot.data());
                } else {
                    console.log('Profile not exists');
                    return undefined;
                }

            })
    });
}
export const deletePostLike = async (postID: string, userID: string) => {
    const currentUser: any = auth().currentUser?.uid;
    const likeCollectionRef = firestore()
        .collection('AllPosts')
        .doc(userID)
        .collection('Posts')
        .doc(postID)
        .collection('Likes');
    const likeQuery = likeCollectionRef.where('userID', '==', currentUser);
    likeQuery.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete()
                    .then(() => {
                        console.log("post Disliked");
                    })
                    .catch((error) => {
                        console.error('Error removing like:', error);
                    });
            });
        })
        .catch((error) => {
            console.error('Error querying likes:', error);
        });
}
export const setPostLike = async (postID: string, userID: string) => {
    const currentUser: any = auth().currentUser?.uid;
    const LikeCollection = firestore().collection('AllPosts').doc(userID).collection("Posts").doc(postID).collection('Likes');
    const newLikeDoc = LikeCollection.doc(); // This creates a new document reference with an auto-generated ID
    const likeId = newLikeDoc.id;
    firestore()
        .collection('AllPosts')
        .doc(userID)
        .collection('Posts')
        .doc(postID)
        .collection('Likes')
        .doc(likeId)
        .set({
            userID: currentUser,
            postId: postID,
            likeID: likeId
        })
        .then(() => {
            console.log('success!');
        })
        .catch(err => {
            console.log(err);
        });
}

export const deletePostComment = async (postID: string, userID: string, commentID: string) => {
    const currentUser: any = auth().currentUser?.uid;

    if (!currentUser) {
        console.log("No authenticated user.");
        return;
    }

    const commentDocRef = firestore()
        .collection('AllPosts')
        .doc(userID)
        .collection('Posts')
        .doc(postID)
        .collection('Comments')
        .doc(commentID);

    // Show confirmation dialog
    Alert.alert(
        "Delete Comment",
        "Are you sure you want to delete this comment?",
        [
            {
                text: "Cancel",
                onPress: () => console.log("Delete cancelled"),
                style: "cancel"
            },
            {
                text: "OK",
                onPress: () => {
                    commentDocRef
                        .delete()
                        .then(() => {
                            console.log('Comment deleted successfully!');
                        })
                        .catch(err => {
                            console.log('Error deleting comment:', err);
                        });
                }
            }
        ],
        { cancelable: false }
    );
};
export const setPostComment = async (postID: string, userID: string, comment: any, profilePic: any, usrName: any) => {
    const currentUser: any = auth().currentUser?.uid;
    const commentCollection = firestore().collection('AllPosts').doc(userID).collection("Posts").doc(postID).collection('Comments');
    const newCommentDoc = commentCollection.doc(); // This creates a new document reference with an auto-generated ID
    const commentId = newCommentDoc.id;
    console.log("commentId:" + commentId);
    console.log("userID:" + userID);
    console.log("postID:" + postID);
    firestore()
        .collection('AllPosts')
        .doc(userID)
        .collection('Posts')
        .doc(postID)
        .collection('Comments')
        .doc(commentId)
        .set({
            userID: currentUser,
            postId: postID,
            commentID: commentId,
            profilePic: profilePic,
            usrName: usrName,
            comment: comment,
            date:new Date().toLocaleDateString()
        })
        .then(() => {
            console.log('success!');
        })
        .catch(err => {
            console.log(err);
        });
}

export const getPostLikes = async (postID: string, userID: string) => {
    return new Promise((resolve, reject) => {
        const subcollectionRef = firestore()
            .collection('AllPosts')
            .doc(userID)
            .collection('Posts')
            .doc(postID)
            .collection('Likes');

        var likes: any = []

        subcollectionRef.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    likes.push(doc.data());
                });
                resolve(likes);
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
                reject(error);
            });
    })
}

export const fetchPosts = async (userID: string) => {
    return new Promise((resolve, reject) => {
        const subcollectionRef = firestore().collection('AllPosts').doc(userID).collection('Posts');

        var posts: any = [];

        subcollectionRef.get()
            .then((querySnapshot) => {

                querySnapshot.forEach((doc) => {
                    posts.push(doc.data());
                });
                resolve(posts);
            })
            .catch((error) => {
                console.error("Error getting documents: ", error);
                reject(error);
            });
    });
}

// TODO: check if exists anywhere else in code
// export const fetchData = async () => {
//     try {
//         const profileCollection = await firestore()
//             .collectionGroup('Profile')
//             .get();

//         const profiles = profileCollection.docs.map((doc) => doc.data());

//         //console.log('All profiles:', profiles);
//         return profiles;
//     } catch (error) {
//         console.error('Error fetching profiles:', error);
//     }
// };