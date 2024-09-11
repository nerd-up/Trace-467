import React, { useEffect } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { posts } from '../services/DataService';
import styles from '../styles/Styles';
import Colors from '../theme/ScholarColors';
import { useNavigation } from '@react-navigation/native';
import { limitText } from '../utils/utitlity';

type FriendBoxProps = {
    data?: any,
    profilePic?:any,
    userID?:any
}

const FriendBox = ({data,profilePic}: FriendBoxProps) => {
   
    
	const navigation:any=useNavigation();
    return (
        <TouchableOpacity  onPress={()=>navigation.navigate('User',{userID:data?.userID})} style={styles.friendBoxStyle}>
         
									<Image source={ data?.profilePic?.length>1?{ uri: data?.profilePic }:
                                 require('../assets/icons/user.png')    
                                } style={{
										height: 80, width
											: 80,
										borderRadius: 60,
										borderWidth: 5,
										borderColor: Colors.primary

									}} /> 
            <TouchableOpacity onPress={()=>navigation.navigate('User',{userID:data?.userID})}> 
			 <Text style={styles.friendBoxTextStyle}>
                {limitText(data?.usrName)}
            </Text>
			</TouchableOpacity>
        </TouchableOpacity>
    );
}
export default FriendBox;
