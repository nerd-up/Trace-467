import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getAsync } from '../store/Auths/asyncThunk';

const AuthLoading = () => {
    const navigation:any=useNavigation();
    const dispatch=useAppDispatch();
    const {authData,googleAuthData}=useAppSelector(state=>state.authData)

    const checkUser = async () => {
        // const userID = await ;
        const user= await AsyncStorage.getItem('user');
        if (user) {
            if(user){
                dispatch(getAsync({user:JSON.parse(user)}))
            }
            navigation.navigate('Splash');
        } else {
            navigation.navigate('Login');
        }
    };

    useEffect(() => {
        checkUser();
    }, [navigation,authData?.status]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AuthLoading;
