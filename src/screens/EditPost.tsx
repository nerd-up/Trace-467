import { View, Text, Image, TouchableOpacity, Platform, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import styles from '../styles/Styles';
import { ActivityIndicator, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
import useUserProfileStore from '../zustand/UserProfileStore';
import { getUserId } from '../utils/Auth';
import firestore from '@react-native-firebase/firestore';
import Colors from '../theme/ScholarColors';
import { launchImageLibrary } from 'react-native-image-picker';
import { setInPost } from '../services/DataService';
import { checkAbusive, showError, showSucess } from '../utils/utitlity';
import { uploadImage } from '../services/UploadFunctions';
import Loading from '../components/loadings/Loading';

const EditPost = ({navigation}:any) => {
    const userName = useUserProfileStore(store => store.usrName)
    const userProfilePic = useUserProfileStore(store => store.profilePic)

    const [selectedImage, setSelectedImage] = useState('');
    const [postDesc, setPostDesc] = useState('');
    const [currentPost,setPost]=useState<any>();
    const [adminId, setAdminId] = useState(getUserId());
    const [postStatus, setPostStatus] = useState('public');
    const [picName, setPicName] = useState('')
    const [filePath, setFilePath] = useState('');
    const [loading,setLoading]=useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const route=useRoute();
    const {postID}=route?.params;
    console.log(postID,"oooo");
    


    const openImagePicker = () => {
        const options: any = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, (response: any) => {
            if (response.didCancel) {
                console.log('Image picker was canceled');
            } else if (response.error) {
                console.error('Image picker error:', response.error);
            } else {
                // Handle the selected image here
                const asset: any = response.assets[0].uri;

                const uri: any = Platform.OS === 'ios' ? asset.replace('file://', '') : asset;

                // setSelectedImage(response.assets[0].uri);
                setSelectedImage(response.assets[0].uri);
                const fName = response.assets[0].fileName;
                const path = `images/users/${adminId}/Posts/${fName}`.toString();
                setFilePath(path);
                setPicName(uri);
                console.log("pick name is :", uri)
            }
        });
    }
  const updatePost=async(post:any)=>{
    console.log("posssst",post);
    
    setLoading(true);
        firestore()
        .collection('AllPosts')
        .doc(getUserId())
        .collection('Posts')
        .doc(postID)
        .update(post)
        .then(()=>{
            setLoading(false);
             showSucess('Post Updated Successfully!');
        })
        .catch((err:any)=>{
            setLoading(false);

            showError('Error'+err?.code);
        })
  }
    const postData = () => {
        if(checkAbusive(postDesc)===true) {
            showError('Error','You cannot use these kind of abusive words!');
            return;
        }
        let img = "";
        if ((selectedImage.length == 0 || selectedImage == null) && (currentPost?.description?.length == 0 || currentPost?.description == null)) {
           showError('Failed','You cannot share an empty post');
        } else if (picName?.length > 0) {
            console.log("entry grantd");
            
            uploadImage(picName, filePath)
                .then((imgUrl: any) => {
                    if (isPrivate) {
                setPost((prev:any)=>({...prev,status:'private'}))
                setPostStatus("private");
                    } else {
                setPost((prev:any)=>({...prev,status:'public'}))
                setPostStatus("public");
                    }
                    // const time = getCurrentTime().toString();
                setPost((prev:any)=>({...prev,image:imgUrl}))
                    // setInPost(adminId, imgUrl, postDesc, postStatus);
                    updatePost({
                        ...currentPost,image:imgUrl
                    });
                })
                .catch(err => {
                    console.log("something went wrong!");
                })
          
        } else {
            console.log("Without img");
            
            if (isPrivate) {
                setPost((prev:any)=>({...prev,status:'private'}))
                
                setPostStatus("private");
            } else {
                setPost((prev:any)=>({...prev,status:'public'}))
                setPostStatus("public");
            }
            // setInPost(adminId, '', postDesc, postStatus);
           setTimeout(() => {
            updatePost(currentPost);
           }, 500); 
           
        }
    }

    const getPost=async()=>{
        setLoading(true);
        firestore()
        .collection('AllPosts')
        .doc(getUserId())
        .collection('Posts')
        .doc(postID)
        .get().then((post:any)=>{
            setLoading(false);
            setPost(post.data());
    })
    .catch((err:any)=>{
        setLoading(false);
        Alert.alert('Error',err?.code)
    })
}
console.log("getpost",currentPost);
useEffect(()=>{
    getPost();
},[])

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingVertical:25}} style={[styles.container, { margin: 5 }]}>
        
        {
      loading===true? <Loading loading={loading} />
    : currentPost===null || currentPost===undefined? <>
    </> :<View>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
            <View style={styles.avatarSection}>
                {userProfilePic == " " ?
                    <Icon name={'person'} size={45} color={Colors.primary} style={{ borderRadius: 50, padding: 5 }} /> :
                    <Image source={{ uri: userProfilePic }} style={[styles.avatarSection, { height: 50, width: 50 }]} />
                }
            </View>
            <View style={[styles.adminSection, { marginTop: 10, flexDirection: 'column' }]}>
                <Text style={{ fontSize: 20, textAlign: 'center' }}>{userName}</Text>
                <View style={{ flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={isPrivate === true ? () => setIsPrivate(false) : () => setIsPrivate(true)}>
                        <View style={currentPost?.status === 'public' ? styles.unFilledCircle : styles.filledCircle}>

                        </View>
                    </TouchableOpacity>
                    <Text style={{ margin: 2, textAlign: 'center' }}>private</Text>
                </View>
            </View>
        </View>
        <View>
            <TextInput
                style={[styles.postInputStyle, { borderRadius: 10 }]}
                multiline={true}
                numberOfLines={4}
                value={currentPost?.description}
                onChangeText={(text) => setPost((prev:any)=>({...prev,description:text}))}
                placeholder="Make a post...." />
        </View>
        <View style={styles.postButtonContainer}>
            {
                selectedImage === '' ? null :
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity style={styles.cancelButtonStyle} onPress={() => setSelectedImage('')}>
                            <Icon name="close-outline" color={'red'} size={40} />
                        </TouchableOpacity>
                        <Image source={{ uri: selectedImage || currentPost?.image }} style={styles.selectedImageStyle}></Image>
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
}
</ScrollView>
  )
}

export default EditPost
