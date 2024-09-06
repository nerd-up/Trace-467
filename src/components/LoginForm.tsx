/**
 * @file SignUpForm.tsx
 * @description Components for authenticating users.
 * @ownership Christian Marcellino
 * @last modified 9/23/2023
 */

import React, { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';

import auth from '@react-native-firebase/auth';

import { getProfile, setInProfile } from '../services/DataService';
import formStyles from '../styles/FormStyles';
import styles from '../styles/Styles';
import { getUserId } from '../utils/Auth';
import SButton from './SButton';
import useUserProfileStore from '../zustand/UserProfileStore';
import Toast from 'react-native-toast-message';
import useLoadingStore from '../zustand/UseLoadingStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

type LoginFormProps = {
    nav: any
}

/**
 * Used to create a login in form that connects with Firebase.
 * @param props (nav) property used to pass in the current navigation controls.
 */
export default function LoginForm(props: LoginFormProps) {

    const [usrEmail, setUserEmail] = useState("");
    const [usrPassword, setUserPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const {allowLoading, disableLoading } = useLoadingStore();
    const userProfile = useUserProfileStore(store => store)

    const setProfileData = useUserProfileStore(store => store.setProfileData)

    // Log in anonymously
    async function LoginAnonymously() {
        // use the authentication login system
        allowLoading();
        auth().signInAnonymously()
            // if login anonomous successful
            .then(() => {
                const user: any = auth().currentUser;
                if (user.isEmailVerified()) {
                    Alert.alert("Login successfull!");
                    const userId = getUserId();
                    props.nav.navigate('Splash', { userId });
                    disableLoading();
                    getProfile(userId)
                        .then(async (profile: any) => {

                            console.log(profile);

                            // if could not find a profile for anonomous
                            if (profile === undefined) {
                                console.log("Added profile");
                                setInProfile(userId, 'no bio', ' ', 'no Residency', ' ',' ')
                            }

                            setProfileData({ userID: getUserId(), ...profile })
                            
                        })
                        .catch((error) => {
                            disableLoading();
                            console.error(error);
                        })
                } else {
                    disableLoading();
                    Toast.show({
                        type: 'info',
                        text1: 'Please Verify Your Email'
                    });

                }

            })
            .catch(error => {
                disableLoading();
                console.error(error);
            });
    }

    // Login with Form data
    function tryAndLogIn() {

        setIsSubmitDisabled(true);

        if (usrEmail.length === 0) {
            Toast.show({
                type: 'error',
                text1: "Error!",
                text2: "Email is Required!"
            });
            setIsSubmitDisabled(false);
            return;
        }

        if (usrPassword.length === 0) {
            Toast.show({
                type: 'error',
                text1: "Error!",
                text2: "Password required!"
            });

            setIsSubmitDisabled(false);
            return;
        }
          allowLoading();
        auth().signInWithEmailAndPassword(usrEmail, usrPassword)
            .then(user => {
                if (auth().currentUser?.uid) {
                    const userId = user.user.uid.toString();
                    props.nav.navigate('Splash', { userId });
                    disableLoading();
                    getProfile(userId)
                        .then(async (profile) => {
                            console.log(profile);
                            await AsyncStorage.setItem('userID',auth().currentUser?.uid);
                            setUserEmail('');
                            setUserPassword('');
                        })
                        .catch((error) => {
                            console.log(error);

                        })
                } else {
                    disableLoading();
                    Toast.show({
                        type: 'error',
                        text1: 'Attention',
                        text2: "Please Verify Your Email"
                    });
                }
            })
            .catch(error => {
                setErrorMsg(error.code);
                disableLoading();
                console.log(error);
                setIsSubmitDisabled(false);
            });
            
    }

    return (
        <View style={formStyles.submitContainer}>
            
            <View>
                <TextInput style={styles.formField} placeholder='Enter email...' onChangeText={text => setUserEmail(text)}></TextInput>
                <TextInput style={styles.formField} placeholder='Enter Password...' onChangeText={text => setUserPassword(text)} secureTextEntry={true}></TextInput>
            </View>

            <Text style={{ color: "red" }}>{errorMsg?.toString()}</Text>

            {/* Submit Button */}
            <View style={formStyles.submitBtnContainer}>
                <SButton text="Log in" action={() => tryAndLogIn()}></SButton>
                <SButton styleType="Sentence" text="Don't have an account? SignUp" action={() => props.nav.navigate('SignUp')}></SButton>
            </View>

                </View>
    );
}
