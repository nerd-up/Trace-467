/**
 * @file SignUpForm.tsx
 * @description Components for authenticating users.
 * @ownership Christian Marcellino
 * @last modified 9/23/2023
 */

import React, { useState } from 'react';
import { Alert, Text, TextInput, View } from 'react-native';

import auth, { sendPasswordResetEmail } from '@react-native-firebase/auth';

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
import { showError, showSucess } from '../utils/utitlity';
import PopUpMessage from './PopUpMessage';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser } from '../store/Auths/asyncThunk';

type LoginFormProps = {
    nav: any,
    setVisibleMsg:any;
}

/**
 * Used to create a login in form that connects with Firebase.
 * @param props (nav) property used to pass in the current navigation controls.
 */
export default function LoginForm(props: LoginFormProps) {

    const [usrEmail, setUserEmail] = useState("");
    const dispatch=useAppDispatch();
    const {authData}=useAppSelector(state=>state.authData)
    const [usrPassword, setUserPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const { allowLoading, disableLoading } = useLoadingStore();
    
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
        dispatch(loginUser({email:usrEmail,password:usrPassword}))
       
    }

    const forgotPassword = async () => {
        if (usrEmail.length === 0) {
            Toast.show({
                type: 'error',
                text1: "Error!",
                text2: "Email is Required!"
            });
            return;
        }
        auth().sendPasswordResetEmail(usrEmail)
        .then((res)=>{
            props.setVisibleMsg(true);
            setTimeout(() => {
            props.setVisibleMsg(false);
            }, 2000);
        })
        .catch((error) => {
            showError('Error sending email: '+error?.code);
        })
    }

    return (
        <View style={formStyles.submitContainer}>
            <View style={{width:'100%',alignItems:'center'}}>
                <TextInput autoCapitalize='none' keyboardType='default' style={styles.formField} placeholder='Enter email...' onChangeText={text => setUserEmail(text)}></TextInput>
                <TextInput style={styles.formField} placeholder='Enter Password...' onChangeText={text => setUserPassword(text)} secureTextEntry={true}></TextInput>
            </View>

            <Text style={{ color: "red" }}>{errorMsg?.toString()}</Text>

            {/* Submit Button */}
            <View style={formStyles.submitBtnContainer}>
                <SButton text="Log in" action={() => tryAndLogIn()}></SButton>
                <SButton styleType="Sentence" text="Forgot password" action={forgotPassword}></SButton>
                <SButton styleType="Sentence" text="Don't have an account? SignUp" action={() => props.nav.navigate('SignUp')}></SButton>
            </View>

        </View>
    );
}
