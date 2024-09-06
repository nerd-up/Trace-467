/**
 * @file SignUpForm.tsx
 * @description Components for authenticating users.
 * @ownership David Edwards
 * @last modified 9/23/2023
 */

import React, { useState } from 'react';
import { Alert, BackHandler, Text, TextInput, View } from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { setInProfile } from '../services/DataService';
import formStyles from '../styles/FormStyles';
import styles from '../styles/Styles';
import SButton from './SButton';
import useLoadingStore from '../zustand/UseLoadingStore';
import Colors from '../theme/ScholarColors';

type SignUpFormProps = {
    nav?: any,
}

/**
 * Used to create a sign in form that connects with Firebase.
 * 
 * On Submit: Adds the new user to the Users firestore database collection.
 * @param props (nav) property used to pass in the current navigation controls.
 */
export default function SignUpForm(props: SignUpFormProps) {

    const [usrName, setUserName] = useState("");
    const [usrEmail, setUserEmail] = useState("");
    const [usrPassword1, setUserPassword1] = useState("");
    const [usrPassword2, setUserPassword2] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const {allowLoading, disableLoading } = useLoadingStore();

    async function tryAndSignIn() {

        setIsSubmitDisabled(true);
        
        if (usrName.length === 0) {
            setErrorMsg("Name required!");
            setIsSubmitDisabled(false);
            return;
        }

        if (usrEmail.length === 0) {
            setErrorMsg("Email required!");
            setIsSubmitDisabled(false);
            return;
        }

        if (usrPassword1.length === 0) {
            setErrorMsg("Password required!");
            setIsSubmitDisabled(false);
            return;
        }

        if (usrPassword1.length === 0) {
            setErrorMsg("Must re-type password!");
            setIsSubmitDisabled(false);
            return;
        }

        if (usrPassword1 !== usrPassword2) {
            setErrorMsg("Passwords do not match!");
            setIsSubmitDisabled(false);
            return;
        }
        allowLoading();
        // creates and authenticates a new user
        auth().createUserWithEmailAndPassword(usrEmail, usrPassword1)
            .then(async result => {
                const user = auth().currentUser;
                await user?.sendEmailVerification();
                const userId:any = user?.uid;
                //console.log(userId)
                // adds the new user to the Users firestore database collection
                setInProfile(userId, 'no bio', ' ','', 'Sportsman', usrName,' ')
              disableLoading();
            })
            .catch(error => {
                // Alert.alert("Error creating account!");
                setErrorMsg(error?.code);
                console.log(error);
                disableLoading();
                setIsSubmitDisabled(false);
            });
    }

    return (
        <View style={formStyles.submitContainer}>
            {/* Input Fields */}
            <View>
                <TextInput placeholderTextColor={'grey'} style={styles.formField} placeholder='Enter Full Name...' onChangeText={text => setUserName(text)}></TextInput>
                <TextInput placeholderTextColor={'grey'}  style={styles.formField} placeholder='Enter Email...' onChangeText={text => setUserEmail(text)}></TextInput>
                <TextInput placeholderTextColor={'grey'}  style={styles.formField} placeholder='Enter Password...' onChangeText={text => setUserPassword1(text)} secureTextEntry={true}></TextInput>
                <TextInput placeholderTextColor={'grey'}  style={styles.formField} placeholder='Confirm Password...' onChangeText={text => setUserPassword2(text)} secureTextEntry={true}></TextInput>
            </View>

            <Text style={{ color: "red" }}>{errorMsg.toString()}</Text>

            {/* Submit Button */}
            <View style={formStyles.submitBtnContainer}>
                <SButton text="Sign Up" action={() => tryAndSignIn()}></SButton>
                <SButton 
  styleType="Sentence" 
  text="Already have an account? Login" 
  action={() => props.nav.navigate('Login')} 
  style={{ backgroundColor: '#C4A484' }} // Your custom color
/>
            </View>
        </View>)
}

