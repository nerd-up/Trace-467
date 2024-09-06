import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import useUserProfileStore from '../zustand/UserProfileStore';
import Toast from 'react-native-toast-message';
import Colors from '../theme/ScholarColors';

const BlockedUsers = ({ navigation }: any) => {
    const route = useRoute();
    const userProfile: any = useUserProfileStore(store => store)
    const [allUsers, setAllUsers] = useState([]);
    const getBlockedUsers = async () => {
        await firestore()
            .collection("Users")
            .doc(userProfile?.userID)
            .collection("BlockedUsers")
            .get()
            .then((snapshoot) => {
                let users: any = [];
                snapshoot?.docs.map(doc =>
                    // console.log("first:",doc.data());
                    users.push(doc.data())
                );
                setAllUsers(users);
            })
            .catch(() => {
                Toast.show({
                    type: "error",
                    text2: 'Error getting Blocked users or you do not have any'
                })
            });
    }
    useEffect(() => {
        getBlockedUsers();
    }, [])

    console.log('all', allUsers);

    const unBlock = async (userID: string) => {
        const blockRef = await firestore()
            .collection("Users")
            .doc(userID)
            .collection("BlockedByUsers")
            .doc(userProfile?.userID);
        await firestore()
            .collection("Users")
            .doc(userProfile?.userID)
            .collection("BlockedUsers")
            .doc(userID)
            .delete()
            .then(() => {
                blockRef.delete();
                Toast.show({
                    type: 'success',
                    text2: 'You unBlocked the user successfully!'
                })
            })
            .catch(err => {
                Toast.show({
                    type: 'error',
                    text2: 'Error while Blocking the user!' + err.message,
                })
            })
    }
    return (
        <View style={styles.container}>
            <View style={styles.reasons}>
                {allUsers?.length > 0 && allUsers?.map((item: any, index: number) => {
                    return <View style={styles.row}>
                        <View style={styles.left}>
                            {
                                item.profilePic !== " " ?
                                    <Image source={{ uri: item.profilePic }} style={{
                                        height: 45, width
                                            : 45,
                                        borderRadius: 60,
                                        borderWidth: 5,
                                        borderColor: Colors.primary

                                    }} /> :
                                    <Image source={require('../assets/icons/user.png')} style={{
                                        height: 45, width
                                            : 45,
                                        tintColor: 'black',
                                        borderRadius: 50,
                                        borderWidth: 1,
                                    }} />
                            }
                            
                            <Text style={styles.userName}>{item?.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => unBlock(item.userID)} key={item.id} style={styles.unblock}>
                            <Text style={styles.reasonTxt}>Unblock</Text>
                        </TouchableOpacity>
                    </View>
                })
                }
            </View>
        </View>
    )
}

export default BlockedUsers
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        flex: 1,
        paddingHorizontal: 10
    },
    userName: {
        fontWeight: '700',
        fontSize: 16,
    },
    heading: {
        fontSize: 18,
        fontWeight: '700',
        marginHorizontal: '2%',
    },
    row: {
        margin: 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    userPic: {
        height: 60,
        width: 60,
        borderRadius: 50,
    },
    reasons: {
        marginTop: '3%',
    },
    reason: {
        padding: 5,
        borderBottomColor: Colors.lightBackground,
        borderBottomWidth: 1,
    },
    reasonTxt: {
        fontSize: 15,
        padding: 2,
        marginHorizontal: '1%',
    }
})