import { View, Text, Image, TouchableOpacity, TextInput, Alert, Platform, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import styles from '../styles/Styles'
import Icon from 'react-native-vector-icons/Ionicons'

import Colors from '../theme/ScholarColors'
import { useNavigation } from '@react-navigation/native'
import { uploadImage } from '../services/UploadFunctions'
import { launchImageLibrary } from 'react-native-image-picker'
import { setInPost } from '../services/DataService'
import { getUserId } from '../utils/Auth'
import useUserProfileStore from '../zustand/UserProfileStore'
import { checkAbusive, chooseFileAndCrop, getFileName, showError } from '../utils/utitlity'
import FastImage from "@d11/react-native-fast-image"
import ImagePicker from 'react-native-image-crop-picker';

export default function Post(navigation: any) {
    const userName = useUserProfileStore(store => store.usrName)
    const userProfilePic = useUserProfileStore(store => store.profilePic)

    const [selectedImage, setSelectedImage] = useState('');
    const [postDesc, setPostDesc] = useState('');

    const [adminId, setAdminId] = useState(getUserId());
    const [postStatus, setPostStatus] = useState('public');
    const [picName, setPicName] = useState('')
    const [filePath, setFilePath] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    navigation = useNavigation();

    const openImagePicker = async() => {
           const options: any = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

      
       
        
       await launchImageLibrary(options, (response: any) => {
            if (response.didCancel) {
                console.log('Image picker was canceled');
            } else if (response.errorCode) {
                console.error('Image picker error:', response.errorCode);
            }
            else if (response.errorMessage) {
                console.error('Image picker error:', response);
            }
            else if (response.assets && response.assets.length > 0) {
                // Handle the selected image here
              
                const asset: any = response.assets[0].uri;

                const uri: any = Platform.OS === 'ios' ? asset.replace('file://', '') : asset;

                // setSelectedImage(response.assets[0].uri);
                setSelectedImage(response.assets[0].uri);
                const fName = response.assets[0].fileName;
                const path = `images/users/${adminId}/Posts/${fName}`.toString();
                setFilePath(path);
                setPicName(uri);
            }
        })
    }

    const getCurrentTime = () => {
        const currentTime = new Date();
        return currentTime;
    };

    const postData = () => {
       
        
        if(checkAbusive(postDesc)===true) {
            showError('Error','You cannot use these kind of abusive words!');
            return;
        }
        let img = "";
        if ((selectedImage.length == 0 || selectedImage == null) && (postDesc.length == 0 || postDesc == null)) {
           showError('Failed','You cannot share an empty post');
        } else if (picName.length !== 0) {
            
            uploadImage(picName, filePath)
                .then((imgUrl: any) => {
                    if (isPrivate) {
                        setPostStatus("private");
                    } else {
                        setPostStatus("public");
                    }
                    const time = getCurrentTime().toString();
                    setInPost(adminId, imgUrl, postDesc, time, postStatus);
                })
                .catch(err => {
                    // console.log("something went wrong!");
                })
            navigation.goBack();
        } else {
            if (isPrivate) {
                setPostStatus("private");
            } else {
                setPostStatus("public");
            }
            const time = getCurrentTime().toString();
            setInPost(adminId, '', postDesc, time, postStatus);
            navigation.goBack();
        }
    }

    console.log(postStatus);
    

    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingVertical:25,paddingBottom:55}}style={[styles.container, { margin: 5 }]}>
            <View>
           
                <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'space-between', padding: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                    <View style={styles.avatarSection}>
                        {userProfilePic?.length<1 ?
                            <Icon name={'person'} size={45} color={Colors.primary} style={{ borderRadius: 50, padding: 5 }} /> :
                            <FastImage source={{ uri: userProfilePic }} style={[styles.avatarSection, { height: 50, width: 50 }]} />
                        }
                    </View>
                    <View style={[styles.adminSection, { marginTop: 10, flexDirection: 'column' }]}>
                        <Text style={{ fontSize: 20, textAlign: 'center' }}>{userName}</Text>
                        <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={postStatus === 'public' ? () => setPostStatus('private') : () => setPostStatus('public')}>
                                <View style={postStatus === 'public' ? styles.unFilledCircle : styles.filledCircle}>

                                </View>
                            </TouchableOpacity>
                            <Text style={{ margin: 2, textAlign: 'center' }}>Do Not Show On Bulletin!</Text>
                        </View>
                    </View>
                    </View>
                    <TouchableOpacity  
             style={{}} 
             onPress={postData}>
                            <Text style={{color:'#C4A484'}}>Post</Text>
                        </TouchableOpacity>
                </View>
                <View>
                    <TextInput
                        style={[styles.postInputStyle, { borderRadius: 10 }]}
                        multiline={true}
                        numberOfLines={4}
                        onChangeText={(text) => setPostDesc(text)}
                        placeholder="Make a post...." />
                </View> 
                <View style={styles.postButtonContainer}>
                    {
                        selectedImage === '' ? null :
                            <View style={{ flex: 1 }}>
                                <TouchableOpacity style={styles.cancelButtonStyle} onPress={() => setSelectedImage('')}>
                                    <Icon name="close-outline" color={'red'} size={40} />
                                </TouchableOpacity>
                                <FastImage source={{ uri: selectedImage }} style={styles.selectedImageStyle}></FastImage>
                            </View>
                    }
                </View>
                <View style={styles.postButtonContainer}>
                    <View style={{ width: '90%' }}>
                        <TouchableOpacity onPress={postData}>
                            <Text style={styles.postButtonStyle}>Post</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.imageIconContainer}>
                        <TouchableOpacity onPress={openImagePicker}>
                            <Icon name="images-outline" size={30} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}