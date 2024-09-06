/**
 * @file Login.tsx
 * @description ?
 * @ownership ?
 * @last modified 9/20/2023
 */

import React from 'react';
import { Button, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';


import Divider from '../components/Divider';
import LoginForm from '../components/LoginForm';
import MissionLine from '../components/MissionLine';
import ScholarBanner from '../components/UnifyBanner';
import formStyles from '../styles/FormStyles';
import auth from '@react-native-firebase/auth';
import styles from '../styles/Styles';
import { AccessToken, LoginButton } from 'react-native-fbsdk-next'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, } from 'react-native-fbsdk-next';
import { WEB_CLIENT_ID } from '@env';
import useUserProfileStore from '../zustand/UserProfileStore';
import { getProfile, setInProfile } from '../services/DataService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { showSucess } from '../utils/utitlity';
GoogleSignin.configure({
    webClientId: '1047966594516-ta9816sp0tk1423cks3e10npsaq9ec4r.apps.googleusercontent.com',
});
function Login({ navigation }: any) {
    const setProfileData = useUserProfileStore(store => store.setProfileData);
    async function onGoogleButtonPress() {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        //    console.log(googleCredential,"credentials");

        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
    }
    async function onFacebookButtonPress() {

        // Attempt login with permissions
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

        if (result.isCancelled) {
            throw 'User cancelled the login process';
        }
        console.log("result:", result);
        // Once signed in, get the users AccessToken
        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            throw 'Something went wrong obtaining access token';
        }
        console.log("data:", data);
        // Create a Firebase credential with the AccessToken
        const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
        console.log("facebookCredential:", facebookCredential);

        // Sign-in the user with the credential
        return auth().signInWithCredential(facebookCredential);
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <ScholarBanner text="Login" />
            {/* Form */}
            <View style={formStyles.container}>
                <LoginForm nav={navigation} />
                <Divider text="OR" />
                {/* Other Log In Options */}
                <View>
                    <TouchableOpacity onPress={() => onGoogleButtonPress().then(async (res: any) => {
                        // getProfile(res?.additionalUserInfo?.uid)
                        // .then(async (profile: any) => {
                        //     console.log(profile);
                        //     if (profile === undefined) {
                        //         console.log("Added profile");
                        //         await AsyncStorage.setItem('userID',res?.additionalUserInfo.uid);
                        //         setInProfile(res?.additionalUserInfo?.uid, 'no bio', ' ','', 'Sportsman', res?.additionalUserInfo?.profile?.name,' ')
                        //     }
                        //     setProfileData({ userID: res?.additionalUserInfo?.uid, ...profile })

                        // })
                        // .catch((error) => {

                        //     console.error(error);
                        // })
                        console.log("res:", res);
                        await firestore().collection('Users').doc(res?.user?.uid).set({
                            userID: res?.user?.uid,
                            bio: 'no bio',
                            profilePic: ' ',
                            coverPic: ' ',
                            residency: 'Sportsman',
                            usrName: res?.additionalUserInfo?.profile?.name,
                            signed: ' '
                        }).then(async (response: any) => {
                            console.log('Success', 'Successfully Signed In!');
                            // setProfileData(res?.additionalUserInfo?.profile);
                            await AsyncStorage.setItem('userID', res?.user?.uid);
                            navigation.navigate('Splash');
                        }).catch((e: any) => {
                            console.log(e);
                        });

                        // setProfileData(res?.additionalUserInfo?.profile);
                        // setInProfile(res?.additionalUserInfo?.uid, 'no bio', ' ','', 'Sportsman', res?.additionalUserInfo?.profile?.name,' ')
                        console.log("response", res?.additionalUserInfo?.profile);
                    })} style={[formStyles.submitBtn, { backgroundColor: '#d00000', flexDirection: "row", justifyContent: "center", columnGap: 10 }]}>
                        <Image source={require('../assets/icons/google.png')} style={{ height: 30, width: 30 }} />
                        <Text style={styles.btnText}>Sign In with Google</Text>
                    </TouchableOpacity>
                    {/* <Button
                        title="Facebook Sign-In"
                        onPress={() => onFacebookButtonPress().then((response) => console.log('Signed in with Facebook!:', response))}
                    /> */}
                </View>
                <MissionLine text="Sportsman's App" />
            </View>
        </ScrollView>
    )
}
export default Login;