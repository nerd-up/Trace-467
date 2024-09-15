/**
 * @file SignUp.tsx
 * @description ?
 * @ownership ?
 * @last modified 9/20/2023
 */

import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';


import Divider from '../components/Divider';
import ScholarBanner from '../components/UnifyBanner';
import SignUpForm from '../components/SignUpForm';
import formStyles from '../styles/FormStyles';
import styles from '../styles/Styles';
import BackBtn from '../components/BackBtn';

function SignUp({ navigation }: any) {
    return (
        <ScrollView style={styles.container}>
            <BackBtn />

            <ScholarBanner text="Sign Up" />
            {/* Form */}
            <View style={formStyles.container}>
                <SignUpForm nav={navigation} />
                <Divider text="John 3:16" />

                {/* Other Sign In Options */}
                {/* <View>
                    <TouchableOpacity style={[formStyles.submitBtn, { backgroundColor: '#d00000', flexDirection: "row", justifyContent: "center", columnGap: 10 }]}>
                        <Image source={require('../assets/icons/google.png')}   style={{height:30,width:30}}/>
                        <Text style={styles.btnText}>Sign In with Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[formStyles.submitBtn, { backgroundColor: '#023e8a', flexDirection: "row", justifyContent: "center", columnGap: 10 }]}>
                        <Image source={require('../assets/icons/facebook.png')}   style={{height:30,width:30}}/>
                        <Text style={styles.btnText}>Sign In With Facebook</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </ScrollView>
    )
}

export default SignUp