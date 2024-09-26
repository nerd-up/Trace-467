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
                <Divider text="Psalms 23" />

               
            </View>
        </ScrollView>
    )
}

export default SignUp