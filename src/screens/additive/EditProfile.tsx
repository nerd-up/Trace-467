import React, { useState } from 'react';
import { Alert, Image, Platform, Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView } from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';

import ScholarBanner from '../../components/UnifyBanner';
import { posts, setInProfile } from '../../services/DataService';
import { getUserId } from '../../utils/Auth';
import styles from '../../styles/Styles';
import { Fonts } from '../../theme/Fonts';
import Colors from '../../theme/ScholarColors';
import { uploadImage } from '../../services/UploadFunctions';
import { launchImageLibrary } from 'react-native-image-picker';
import useUserProfileStore from '../../zustand/UserProfileStore';
import ImageCropPicker from 'react-native-image-crop-picker';

const EditProfile = () => {
    const userProfile = useUserProfileStore(store => store);
    const [name, setName] = useState(userProfile.usrName);
    const [citizenShip, setCitizenShip] = useState(userProfile?.residency || "");
    const [bio, setBio] = useState(userProfile.bio);
    const [profilePic, setProfilePic] = useState(userProfile.profilePic);
    const [coverPic, setCoverPic] = useState<any>(userProfile?.coverPic || '');
    const navigation = useNavigation();
    const userId = getUserId();

    const setChanges = () => {
        if (name.length === 0) {
            Alert.alert('Name cannot be Empty!');
        } else {
            setInProfile(userProfile?.userID.toString(), bio, profilePic, coverPic, citizenShip, name, userProfile?.signed);
            navigation.goBack();
        }
    };

    const openPicker = () => {
        ImageCropPicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            const uri = image.path;
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
            setProfilePic(uri);
            const fileName = image.filename;
            const path = `images/users/${userId}/profilePictures/${fileName}`.toString();
            uploadImage(uploadUri, path)
                .then((imgUrl: any) => setProfilePic(imgUrl))
                .catch(() => console.log("something went wrong!"));
        });
    };

    const chooseCoverPic = () => {
        ImageCropPicker.openPicker({
            width: 400,
            height: 350,
            cropping: true,
        }).then(image => {
            const uri = image.path;
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
            setCoverPic(uri);
            const fileName = image.filename;
            const path = `images/users/${userId}/coverPictures/${fileName}`.toString();
            uploadImage(uploadUri, path)
                .then((imgUrl: any) => setCoverPic(imgUrl))
                .catch(() => console.log("something went wrong!"));
        });
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
                    <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        {coverPic?.length === 0 ? (
                            <Image style={styles.coverPhoto} source={require('../../assets/Trace467.jpg')} />
                        ) : (
                            <Image style={styles.coverPhoto} source={{ uri: coverPic }} />
                        )}
                        <TouchableOpacity
                            onPress={chooseCoverPic}
                            style={{
                                position: 'absolute',
                                backgroundColor: Colors.lightBackground,
                                borderRadius: 100,
                                alignItems: 'center',
                                padding: 5,
                                justifyContent: 'center',
                                top: 5,
                                right: 10,
                            }}>
                            <Icon name="create-outline" size={20} color="black" />
                        </TouchableOpacity>
                        <View style={{ position: 'absolute', bottom: -70 }}>
                            {profilePic === ' ' || profilePic === '' ? (
                                <Icon
                                    name="person"
                                    size={90}
                                    color={Colors.primary}
                                    style={{
                                        borderColor: Colors.text,
                                        borderWidth: 1,
                                        borderRadius: 150,
                                        padding: 15,
                                    }}
                                />
                            ) : (
                                <Image style={styles.profilePictur} source={{ uri: profilePic }} />
                            )}
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', margin: 10, marginTop: '18%' }}>
                        <TouchableOpacity onPress={openPicker}>
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
                                placeholder="Your Full Name"
                                onChangeText={text => setName(text)}
                            />
                        </View>
                        <View style={{ margin: 5 }}>
                            <TextInput
                                style={{ backgroundColor: Colors.background, fontSize: 18 }}
                                value={citizenShip}
                                placeholder="City, State"
                                onChangeText={text => setCitizenShip(text)}
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
                                placeholder="Outdoor Bio"
                                onChangeText={text => setBio(text)}
                            />
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', padding: 10, margin: 20 }}>
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
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default EditProfile;
