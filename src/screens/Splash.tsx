/**
 * @file Splash.tsx
 * @description Redirects users to the ScholarTabs screen
 * @ownership NerdUp
 * @last modified 10/18/2023
 */

import React, { useEffect } from 'react';

import ScholarTabs from '../navigation/TabNavigator';
import { getProfile } from '../services/DataService';
import { getUserId } from '../utils/Auth';
import useUserProfileStore from '../zustand/UserProfileStore';
import { useIsFocused } from '@react-navigation/native';


const Splash = () => {
    const setProfileData = useUserProfileStore(store => store.setProfileData);
    const isFocused = useIsFocused();
    useEffect(() => {
		getProfile(getUserId())
			.then((profile: any) => {
				setProfileData(profile);
			})
			.catch(error => {
				console.error('Errffor :', error);
			});
	}, [isFocused]);
    return (
       
 <ScholarTabs />
        
       
    )
}

export default Splash