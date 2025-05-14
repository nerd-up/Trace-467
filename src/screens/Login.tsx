/**
 * @file Login.tsx
 * @description ?
 * @ownership ?
 * @last modified 9/20/2023
 */

import React, { useEffect, useState } from 'react';
import { Button, Image, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FastImage from "@d11/react-native-fast-image"

import Divider from '../components/Divider';
import LoginForm from '../components/LoginForm';
import MissionLine from '../components/MissionLine';
import ScholarBanner from '../components/UnifyBanner';
import formStyles from '../styles/FormStyles';
import auth from '@react-native-firebase/auth';
import styles from '../styles/Styles';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import useUserProfileStore from '../zustand/UserProfileStore';
import { getProfile, setInProfile } from '../services/DataService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { showError, showSucess } from '../utils/utitlity';
import appleAuth, {
    AppleButton,
} from '@invertase/react-native-apple-authentication';
import PopUpMessage from '../components/PopUpMessage';
import { loginUserGoogle } from '../store/Auths/asyncThunk';
import { useAppDispatch } from '../store/hooks';
function Login({ navigation }: any) {
    const [visiblMsg,setvisibleMsg]=useState(false);
    const dispatch=useAppDispatch();
    const [googleIn,setGoogleIn]=useState(false);
    const [googleData,setGoogleData]=useState(null);
    const setProfileData = useUserProfileStore(store => store.setProfileData);
    async function onGoogleButtonPress() {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const userInfo = await GoogleSignin.signIn();
        const { idToken }: any = userInfo?.data;
        //   console.log(userInfo);
          
        if (!idToken) {
            showError('Failed','Please try again!')
            throw new Error("No idToken found");
        }
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        
        auth().signInWithCredential(googleCredential)
        .then(async(res)=>{
           const user=res?.user;
           const currentUser= auth()?.currentUser;
           if(currentUser){
            setGoogleData(user);
            setGoogleIn(true);
            const doc = await firestore().collection('Users').doc(currentUser?.uid).get();
            if(!doc.exists)
           setInProfile(currentUser?.uid, 'no bio', user?.photoURL || '', '', 'Sportsman', user?.displayName, '')
           
        }
        })
        .catch((err)=>{
            showError('Failed','Failed to sign in, \n'+err?.code);
        })
    }

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '739431608336-shl6v9uadplgsmg404oj29u6b34ee6s9.apps.googleusercontent.com',
        });
        if(googleIn){
            dispatch(loginUserGoogle(googleData));
           setGoogleIn(false);
        }
    }, [googleIn])
    const onAppleButtonPress = async () => {
        if (!appleAuth.isSupported) {
            console.warn("Apple Sign-In is not supported on this device.");
            return;
        }
        try {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });
            console.log("appleAuthRequestResponse:", appleAuthRequestResponse);
            const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
            const { identityToken, nonce } = appleAuthRequestResponse;
            if (identityToken && credentialState === appleAuth.State.AUTHORIZED) {
                const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
                await auth().signInWithCredential(appleCredential)
                    .then(async (res: any) => {
                        const userID = res?.user?.uid;
                        const userDoc = await firestore().collection('Users').doc(userID).get();
                        if (!userDoc.exists) {
                            // Prepare user data
                            const userData = {
                                userID,
                                bio: 'no bio',
                                profilePic: '',
                                coverPic: '',
                                residency: 'Sportsman',
                                usrName: '',
                                signed: '',
                            };
                            await firestore().collection('Users').doc(userID).set(userData, { merge: true });
                            console.log('User data saved to Firestore:', userData);
                        } else {
                            console.log('User data already exists in Firestore.');
                        }

                        // Save userID in AsyncStorage
                        await AsyncStorage.setItem('userID', userID);
                        navigation.navigate('Splash');
                    }).catch((error: any) => {
                        console.log('An error occurred during Firebase sign-in:', error);
                    });
            }
        } catch (error) {
            console.log(error.message);

        }
    };

    // async function onFacebookButtonPress() {

    //     // Attempt login with permissions
    //     const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    //     if (result.isCancelled) {
    //         throw 'User cancelled the login process';
    //     }
    //     console.log("result:", result);
    //     // Once signed in, get the users AccessToken
    //     const data = await AccessToken.getCurrentAccessToken();

    //     if (!data) {
    //         throw 'Something went wrong obtaining access token';
    //     }
    //     console.log("data:", data);
    //     // Create a Firebase credential with the AccessToken
    //     const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
    //     console.log("facebookCredential:", facebookCredential);

    //     // Sign-in the user with the credential
    //     return auth().signInWithCredential(facebookCredential);
    // }


    useEffect(() => {
        if (appleAuth.isSupported) {
            return appleAuth.onCredentialRevoked(async () => {
                console.warn('User Credentials have been Revoked');
            });
        }
    }, []);

    return (
        <SafeAreaView style={{flex:1}}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <PopUpMessage  visible={visiblMsg} title='Email Sent' text='Reset password email sent successfully. Please check your inbox.' />
            <ScholarBanner style={{height:250}}  text="Login" />
            {/* Form */}
            <View style={formStyles.container}>
                <LoginForm nav={navigation} setVisibleMsg={setvisibleMsg}/>
                {/* <Divider text="John 3:16 & فَبِأَىِّءَالَآءِرَبِّكُمَاتُكَذِّبَانِ" /> */}
                {/* Other Log In Options */}
                <View style={{alignItems:'center',justifyContent:'center'}}>
                {Platform.OS === 'ios'&& appleAuth.isSupported &&<AppleButton
                        buttonStyle={AppleButton.Style.BLACK}
                        buttonType={AppleButton.Type.SIGN_IN}
                        style={{ width: 300, height: 45, marginTop: 20 }} // Adjust as needed
                        onPress={() => onAppleButtonPress()}
                    />}


                        {
                        /* 
                     */}

                    {/* Apple Sign-In Button */}
                   

                </View>
               { Platform.OS === 'android' && <TouchableOpacity
    onPress={() => onGoogleButtonPress().then(async (res: any) => {
        // existing Google Sign-In code
    })}
    style={[formStyles.submitBtn, { backgroundColor: '#d00000', 
    flexDirection: "row", justifyContent: "center",alignItems:'center', gap:10 }]}
>   
    <FastImage source={require('../assets/icons/google.png')} style={{ height: 30, width: 30 }} />
    <Text style={styles.btnText}>Sign In with Google</Text>
</TouchableOpacity>
}
                <MissionLine text="Outdoors App" />
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}
export default Login;