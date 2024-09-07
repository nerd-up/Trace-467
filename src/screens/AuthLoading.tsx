import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const AuthLoading = () => {
    const navigation:any=useNavigation();
    const checkUser = async () => {
        // const userID = await ;
      
        if (await AsyncStorage.getItem('userID')) {
            navigation.navigate('Splash');
        } else {
            navigation.navigate('Login');
        }
    };

    useEffect(() => {
        checkUser();
    }, [navigation]);

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
