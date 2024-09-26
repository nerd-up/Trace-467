/**
 * @file UserProfile.tsx
 * @description User profile editing screen allowing users to update their profile picture, name, location, and bio.
 * @ownership Shan Ayub
 *
 * @last modified 14/10/2023
 */

import React, { useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { posts, setInProfile } from '../services/DataService';
import styles from '../styles/Styles';
import { Fonts } from '../Theme/Fonts';
import Colors from '../Theme/ScholarColors';
import { uploadImage } from '../services/UploadFunctions';
import ImagePicker from 'react-native-image-crop-picker';
import useUserProfileStore from '../zustand/UserProfileStore';

const EditProfile = () => {
    const userId = useUserProfileStore(store => store.userID);
    const bio = useUserProfileStore(store => store.bio);
    const profilePic = useUserProfileStore(store => store.profilePic);
    const school = useUserProfileStore(store => store.schoolName);
    const major = useUserProfileStore(store => store.Class);
    const name = useUserProfileStore(store => store.usrName);

    const setUserBio = useUserProfileStore(store => store.setBio);
    const setUserProfilePic = useUserProfileStore(store => store.setProfilePic);
    const setUserSchool = useUserProfileStore(store => store.setSchoolName);
    const setUserMajor = useUserProfileStore(store => store.setClass);
    const setUserName = useUserProfileStore(store => store.setUsrName);

    const navigation = useNavigation();

    function setChanges() {
        if (name.length === 0) {
            Alert.alert('Name cannot be Empty!');
        } else {
            setInProfile(userId, bio, profilePic, school, major, name);
            Alert.alert('Updated!');
            navigation.goBack();
        }
    }

    const openImagePicker = () => {
        ImagePicker.openPicker({
            cropping: true,
            mediaType: 'photo',
        }).then((image) => {
            const uri = image.path;
            const fileName = `${image.modificationDate}.jpg`; // Custom fileName
            const path = `images/users/${userId}/profilePictures/${fileName}`;
            
            uploadImage(uri, path)
                .then((imgUrl: any) => {
                    setUserProfilePic(imgUrl);
                })
                .catch(err => {
                    console.log('Error uploading image:', err);
                });
        }).catch((error) => {
            console.log('Image picker error:', error);
        });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100} // Adjust offset if necessary
        >
            {/* <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled"> */}
                <View style={{ alignContent: 'center', justifyContent: 'center' }}>
                    <View style={{ margin: 5 }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon name="close-outline" size={30} color={'black'} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        {profilePic === " " || profilePic === null ? (
                            <Icon
                                name={posts[0].avatar}
                                size={90}
                                color={Colors.primary}
                                style={{
                                    borderColor: Colors.text,
                                    borderWidth: 1,
                                    borderRadius: 150,
                                    padding: 10,
                                }}
                            />
                        ) : (
                            <Image style={styles.profilePictur} source={{ uri: profilePic }} />
                        )}
                    </View>

                    <View style={{ alignItems: 'center', margin: 10 }}>
                        <TouchableOpacity onPress={openImagePicker}>
                            <Text
                                style={{
                                    fontFamily: Fonts.regular,
                                    color: Colors.linkColor,
                                    fontSize: 16,
                                }}>
                                Edit Profile picture
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ margin: 10 }}>
                        <View style={{ margin: 5 }}>
                            <TextInput
                                style={{ backgroundColor: Colors.background, fontSize: 18 }}
                                value={name}
                                placeholder="Your Name"
                                onChangeText={text => setUserName(text)}
                            />
                        </View>
                        <View style={{ margin: 5 }}>
                            <TextInput
                                style={{ backgroundColor: Colors.background, fontSize: 18 }}
                                value={school}
                                placeholder="Favorite Game"
                                onChangeText={text => setUserSchool(text)}
                            />
                        </View>
                        <View style={{ margin: 5 }}>
                            <TextInput
                                style={{ backgroundColor: Colors.background, fontSize: 18 }}
                                placeholder="City, State"
                                value={major}
                                onChangeText={text => setUserMajor(text)}
                            />
                        </View>
                        <View style={{ margin: 5 }}>
                            <TextInput
                                style={{
                                    backgroundColor: Colors.background,
                                    borderBottomColor: Colors.secondary,
                                    fontSize: 18,
                                }}
                                value={bio}
                                placeholder="Type of game and fish."
                                onChangeText={text => setUserBio(text)}
                            />
                        </View>
                    </View>

                    <View
                        style={{
                            alignContent: 'center',
                            alignItems: 'center',
                            padding: 10,
                            margin: 20,
                        }}>
                        <TouchableOpacity
                            style={{
                                backgroundColor: Colors.primary,
                                width: '50%',
                                padding: 10,
                                borderRadius: 10,
                                alignItems: 'center',
                            }}
                            onPress={setChanges}>
                            <Text style={{ color: Colors.text }}>Apply Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            {/* </ScrollView> */}
        </KeyboardAvoidingView>
    );
};

export default EditProfile;
