/**
 * @file Login.tsx
 * @description ?
 * @ownership ?
 * @last modified 9/20/2023
 */

import React, { useEffect } from 'react';
import { Button, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';


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
import { showSucess } from '../utils/utitlity';
import appleAuth, {
    AppleButton,
} from '@invertase/react-native-apple-authentication';
function Login({ navigation }: any) {

    const setProfileData = useUserProfileStore(store => store.setProfileData);
    async function onGoogleButtonPress() {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const userInfo = await GoogleSignin.signIn();
        const { idToken }: any = userInfo?.data;

        if (!idToken) {
            throw new Error("No idToken found");
        }
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
    }

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '739431608336-shl6v9uadplgsmg404oj29u6b34ee6s9.apps.googleusercontent.com',
        });
    }, [])
    const onAppleButtonPress = async () => {
        try {
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                // Note: it appears putting FULL_NAME first is important, see issue #293
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });
            console.log("appleAuthRequestResponse:", appleAuthRequestResponse);
            // get current authentication state for user
            // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
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
                        console.error('An error occurred during Firebase sign-in:', error);
                    });
            }
        } catch (error) {
            console.error(error.message);

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
        return appleAuth.onCredentialRevoked(async () => {
            console.warn('If this function executes, User Credentials have been Revoked');
        });
    }, []);

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <ScholarBanner text="Login" />
            {/* Form */}
            <View style={formStyles.container}>
                <LoginForm nav={navigation} />
                <Divider text="OR" />
                {/* Other Log In Options */}
                <View>
                    {
                        Platform.OS === 'android' &&
                        <TouchableOpacity
                            onPress={() => onGoogleButtonPress().then(async (res: any) => {
                                // existing Google Sign-In code
                            })}
                            style={[formStyles.submitBtn, { backgroundColor: '#d00000', flexDirection: "row", justifyContent: "center", columnGap: 10 }]}
                        >
                            <Image source={require('../assets/icons/google.png')} style={{ height: 30, width: 30 }} />
                            <Text style={styles.btnText}>Sign In with Google</Text>
                        </TouchableOpacity>
                    }

                    {/* Apple Sign-In Button */}
                    {Platform.OS === 'ios'&&<AppleButton
                        buttonStyle={AppleButton.Style.BLACK}
                        buttonType={AppleButton.Type.SIGN_IN}
                        style={{ width: 300, height: 45, marginTop: 20 }} // Adjust as needed
                        onPress={() => onAppleButtonPress()}
                    />}

                </View>
                <MissionLine text="Sportsman's App" />
            </View>
        </ScrollView>
    );
}
export default Login;