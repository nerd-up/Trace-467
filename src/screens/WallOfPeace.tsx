import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScholarMiniBanner } from '../components/UnifyBanner';
import Colors from '../theme/ScholarColors';
import { useNavigation } from '@react-navigation/native';
import { fetchSignedUsers } from '../services/DataService';

const WallOfPeace = () => {
    const [signedUsers, setSignedUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = fetchSignedUsers(setSignedUsers);
        return () => unsubscribe();
    }, []);

    const [search, setSearch] = useState('');
    const navigation: any = useNavigation();

    const goBack = () => {
        navigation.goBack();
    };

    const moveNext = (userID: any) => {
        navigation.navigate('User', { userID: userID });
    };

    return (
        <View style={{ backgroundColor: Colors.background }}>
            <ScholarMiniBanner text='Sportsmen' />
            <View>
                <TextInput
                    style={stylings.searchBar}
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                    placeholder='Search for person'
                />
            </View>
            <View style={{ height: '80%' }}>
                <ScrollView showsVerticalScrollIndicator>
                    {signedUsers.map((person: any, index) => (
                        person.usrName.toLowerCase().includes(search) ? (
                            <TouchableOpacity key={index} onPress={() => moveNext(person.userID)}>
                                <View style={stylings.userContainer}>
                                    <Text>Number: {index + 1}</Text>
                                    <Text>{person.usrName}</Text>
                                </View>
                            </TouchableOpacity>
                        ) : null
                    ))}
                </ScrollView>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => goBack()}>
                        <View style={stylings.backButton}>
                            <Text style={stylings.backButtonText}>Back</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default WallOfPeace;

const stylings = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        backgroundColor: Colors.lightBackground,
        margin: 5,
        padding: 10,
        borderRadius: 10,
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    userContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.lightBackground,
        margin: 5,
        padding: 10,
        borderRadius: 10,
        justifyContent: 'space-between',
    },
    backButton: {
        marginTop: 20,
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 10,
        width: 300,
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white',
        fontSize: 20,
    },
});
