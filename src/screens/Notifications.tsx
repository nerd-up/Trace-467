import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import styles from '../styles/Styles';
import Divider from '../components/Divider';
import Icon from 'react-native-vector-icons/Ionicons';
import notificationStyles from '../styles/NotificationStyles';
import ScholarBanner, { ScholarMiniBanner } from '../components/UnifyBanner';
import Colors from '../theme/ScholarColors';
const Notifications = () => {
    const notifications = [
        {
            person: 'David Edwards',
            activity: "Liked your post \"I made this\"",
            date: "05/14/2024"
        },
        {
            person: 'David Edwards',
            activity: "Liked your post \"I made this\"",
            date: "05/14/2024"
        },
        {
            person: 'David Edwards',
            activity: "Liked your post \"I made this\"",
            date: "05/14/2024"
        },
        {
            person: 'David Edwards',
            activity: "Liked your post \"I made this\"",
            date: "05/14/2024"
        },
        {
            person: 'David Edwards',
            activity: "Liked your post \"I made this\"",
            date: "05/14/2024"
        },
        {
            person: 'David Edwards',
            activity: "Liked your post \"I made this\"",
            date: "05/14/2024"
        },
        {
            person: 'David Edwards',
            activity: "Liked your post \"I made this\"",
            date: "05/14/2024"
        },
        {
            person: 'David Edwards',
            activity: "Liked your post \"I made this\"",
            date: "05/14/2024"
        },
        {
            person: 'David Edwards',
            activity: "Liked your post \"I made this\"",
            date: "05/14/2024"
        },
        {
            person: 'David Edwards',
            activity: "Liked your post \"I made this\"",
            date: "05/14/2024"
        },
        {
            person: 'David Edwards',
            activity: "Liked your post \"I made this\"",
            date: "05/14/2024"
        },
    ];
    return (
        <View style={styles.container}>
            <View style={styles.innerContainer}>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    <ScholarMiniBanner text="Notifications" size={49} />
                </View>
                <ScrollView>
                    <View style={notificationStyles.notificationContainer}>
                        {
                            notifications.map((notification,index) => {
                                return (
                                    <View style={notificationStyles.notificationBox}>
                                        <View style={notificationStyles.nIcon}>
                                            <Icon name='person' size={50} />
                                        </View>
                                        <View>
                                            <Text style={notificationStyles.nText}>{notification.person} {notification.activity}...</Text>
                                            <Text style={notificationStyles.nText}>{notification.date}</Text>
                                        </View>
                                        <View style={notificationStyles.nDots}>
                                            <TouchableOpacity>
                                                <Icon name='ellipsis-vertical-outline' size={25} color={Colors.primary} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })
                        }

                    </View>
                </ScrollView>
            </View>
        </View>
    );
};
export default Notifications;
