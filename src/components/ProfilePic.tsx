import React from 'react'
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import Colors from '../theme/ScholarColors';
import FastImage from "@d11/react-native-fast-image"

const ProfilePic = ({ profile, onPress }: any) => {
   
    return (
        <Modal
            transparent={true} // Ensures the modal has a transparent background
            visible={true} // Make sure the modal is visible
            onRequestClose={onPress} // Allows closing the modal with hardware back button on Android
        >
            <View style={styles.container}>
                <TouchableOpacity onPress={onPress} style={styles.cancelButton}>
                    <FastImage source={require('../assets/icons/reject.png')} style={styles.cancelIconStyle} />
                </TouchableOpacity>
                <View style={styles.profilePicContainer}>
                    {
                        profile.length > 1 ?
                            <FastImage source={{ uri: profile }} style={styles.profilePicStyle} /> :
                            <FastImage source={require('../assets/icons/user.png')} style={styles.profilePicStyle} />
                    }
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cancelButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    cancelIconStyle: {
        height: 50,
        width: 50,
    },
    profilePicContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    profilePicStyle: {
        height: 350,
        width: 350,
        borderRadius: 175,
    }
})

export default ProfilePic
