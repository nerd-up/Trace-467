/**
 * @file Home.tsx
 * @description ?]
 * @ownership ?
 * @last modified 9/20/2023
 */

import React, { useEffect } from 'react';

import { Alert, Image, ImageBackground, PermissionsAndroid, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import Feed from '../components/Feed';
import Colors from '../theme/ScholarColors';
import Toast from 'react-native-toast-message';
import useUserProfileStore from '../zustand/UserProfileStore';
import { showSucess } from '../utils/utitlity';




const Home = ({ navigation }: any) => {
	const userProfile: any = useUserProfileStore(store => store);

	const displayWelcomeMessage = () => {
		Toast.show({
			type: 'success',
			text1: "Congratulations!",
			text2: "You're logged in successfully!"
		});
	};

	useEffect(() => {
		displayWelcomeMessage();
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: Colors.background }}>
			<ImageBackground source={require('../assets/icons/all.png')} style={{ flex: 1, justifyContent: 'center' }} resizeMode='cover' />
			
			<View
				style={{
					margin: 5,
					flexDirection: 'row',
					justifyContent: 'space-between',
					borderWidth: 1,
					borderColor: 'gray',
					padding: 10,
					borderRadius: 10,
				}}>
				<View>
					<Image source={require('../assets/icons/user.png')} style={{ tintColor: Colors.primary, height: 30, width: 30 }} />
				</View>
				
				<TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.push('Post', { userProfile })}>
					<View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', marginLeft: 10 }}>
						<Text style={{ fontSize: 20 }}>Make a post....</Text>
					</View>
				</TouchableOpacity>
				
				<View style={{ marginLeft: 5 }}>
					<TouchableOpacity>
						<Image source={require('../assets/icons/images.png')} style={{ height: 30, width: 30, tintColor: Colors.primary }} />
					</TouchableOpacity>
				</View>
			</View>

			{/* Add separator below posts */}
			<ScrollView>
				<Feed />
				<View
					style={{
						height: 1,
						backgroundColor: 'gray',
						marginVertical: 10,
					}}
				/>
				{/* Additional posts can follow with their own separators */}
				{/* Example: <Feed /> */}
			</ScrollView>
		</View>
	);
};

export default Home;
