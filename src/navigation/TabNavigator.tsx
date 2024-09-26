/**
 * @file TabNavigator.tsx
 * @description This script is responsible for controlling tab navigation.
 * @ownership ?
 * @last modified 9/20/2023
 */

import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';
import Friends from '../screens/Friends';
import Home from '../screens/Home';
import Notifications from '../screens/Notifications';
import UserProfile from '../screens/UserProfile';
import Colors from '../theme/ScholarColors';
import { Alert, Image, TouchableOpacity, View } from 'react-native';
import SignForPeace from '../screens/SignForPeace';
import { useNavigation } from '@react-navigation/native';
import useUserProfileStore from '../zustand/UserProfileStore';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import Trophies from '../screens/Trophies';
import { getUserId } from '../utils/Auth';
import useLoadingStore from '../zustand/UseLoadingStore';
import { showSucess } from '../utils/utitlity';

const Tab = createBottomTabNavigator();

const routeIconUrls: { [key: string]: any } = {
    'Home': require('../assets/icons/information.png'),
    'Friends': require('../assets/icons/head.png'),
    'Trophies': require('../assets/icons/trophy.png'),
    'Notifications': require('../assets/icons/bell-ring.png'),
    'UserProfile': require('../assets/icons/man.png'),
    'SignForPeace': require('../assets/icons/target.png'),
};

function TabBarIcon({ iconName, focused }: any) {

    return (
        <Image source={iconName} style={{
            tintColor: focused ? Colors.primary : 'gray', height: focused ? 30 : 30, width
                : 30, margin: 10
        }} />
    );
};

function ScholarTabs() {
    const userProfile: any = useUserProfileStore(store => store)
    const navigation: any = useNavigation();
    const { allowLoading,disableLoading} = useLoadingStore();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: {
                    backgroundColor: 'white',
                    padding: 10,
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'center'
                },
                tabBarIcon: ({ focused }: any) => {
                    return <TabBarIcon iconName={routeIconUrls[route.name]} focused={focused} />
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} options={{
                title: "Bulletin", headerTitleStyle: {
                    color: Colors.primary, fontSize: 30
                }, headerStyle: {
                    backgroundColor: Colors.lightBackground
                }
                , 
                headerRight: () =>
                    <TouchableOpacity onPress={() => navigation.navigate('Chats')}>
                        <Image style={{ height: 40, width: 40, marginRight: 10, tintColor: Colors.primary }} source={require('../assets/icons/chat.png')}></Image>
                    </TouchableOpacity>
            }} 
            />
            
            <Tab.Screen name="Trophies" component={Trophies} options={{ title: "Trophies", headerShown: false }} />
            <Tab.Screen name="Friends" component={Friends} options={{ title: "Buddies", headerShown: false }} />
            {/* <Tab.Screen name="Notifications" component={Notifications} options={{ headerShown: false, tabBarShowLabel: false }} /> */}
            
            <Tab.Screen name="UserProfile" component={UserProfile}
                options={({ navigation }) => ({
                    title: 'Sport',
                    headerStyle: { backgroundColor: 'transparent' },
                    headerTintColor: Colors.linkColor,
                    headerRight: () => (
                        <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={()=>navigation.navigate('Friends')}>
                        <Image
                            source={require('../assets/icons/search.png')}
                            style={{ marginRight: 15, height: 20, width: 20, tintColor: Colors.primary }}
                        />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>navigation.navigate('Settings')}>
                            <Image style={{height:20,width:20,tintColor:Colors.primary,marginRight:'5%'}} source={require('../assets/icons/settings.png')} />
                        </TouchableOpacity>
                    </View>
                    )
                })}
            />
        </Tab.Navigator>
    );
}

export default ScholarTabs;
