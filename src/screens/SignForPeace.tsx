import React, { useEffect, useState } from 'react'
import { Image, KeyboardAvoidingView, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import ScholarBanner, { ScholarMiniBanner } from '../components/UnifyBanner'
import Colors from '../theme/ScholarColors'
import useUserProfileStore from '../zustand/UserProfileStore'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { getProfile, saveSignatures } from '../services/DataService'
import Toast from 'react-native-toast-message'
import { getUserId } from '../utils/Auth'
import { Button } from 'react-native-paper'


const SignForPeace = () => {
    const navigation: any = useNavigation();
    const isFocused=useIsFocused();
    const [signatures, setSignatures] = useState('');
    const [refresh,setRefresh]=useState(false);
	const setProfileData = useUserProfileStore(store => store.setProfileData);
    const userProfile: any = useUserProfileStore(store => store);
    const name=userProfile?.usrName?.toString();
    const signPeaceTreaty = () => {
        if(signatures.length>0){
         console.log(userProfile.usrName);
            if(name===signatures){
            saveSignatures(signatures);
            }
            else{
                console.log("name erros");
                Toast.show({
                    type:'error',
                    text2:'Please input your correct name!'
                })
            }
        }
        navigation.navigate('Certificate')
    }
 console.log(userProfile);

  const getDetails=async()=>{
    setRefresh(true);
    getProfile(getUserId())
        .then((profile: any) => {
            setRefresh(false);
            setProfileData(profile);
        })
        .catch(error => {
    setRefresh(false);
            console.error('Errffor :', error);
        });
}
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    {
        userProfile?.signed?.length > 1 ?
        <>
            <Text></Text>
            <TouchableOpacity onPress={() => navigation.navigate('DownloadCertificate')}>
            <View style={{ 
            backgroundColor: '#7C6354', // Green background color
            paddingVertical: 15,        // Vertical padding for better touch target
            paddingHorizontal: 30,      // Horizontal padding
            borderRadius: 10,           // Rounded corners
            alignItems: 'center',       // Center the text
            shadowColor: '#000',        // Shadow for depth
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,               // Elevation for Android shadow
            }}>
            <Text style={{ 
                color: 'white',         // White text color for contrast
                fontSize: 18,           // Larger font size
                fontWeight: 'bold',     // Bold text for emphasis
            }}>
            Show Certificate
            </Text>
            </View>
            </TouchableOpacity>
            </>
            :
            <>
            <ScholarMiniBanner text='Certify ' />
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={getDetails} />}
            >
                <View style={{ flex: 1, alignItems: 'center', marginTop: 50 }}>
                    <Text style={{ textAlign: 'center', fontSize: 28 }}>
                        I "{userProfile.usrName}" by signing here, agree to be a good sportsman and treat nature with respect. I will eat what I kill or catch, hunt and fish fairly and will respect others in the community. By signing, my profile will have the "sportsman" icon and I will go on the "Wall of Sportsmen."
                    </Text>
                    <TextInput
                        style={{ width: 350, textAlign: 'center', fontSize: 20, borderRadius: 10, color: 'black', borderWidth: 1 }}
                        placeholder='Type in Your name'
                        onChangeText={(text) => setSignatures(text)}
                        value={signatures}
                    />
                    <TouchableOpacity onPress={() => signPeaceTreaty()}>
                        <View style={{ marginTop: 20, backgroundColor: Colors.primary, padding: 10, borderRadius: 10, width: 300, alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 20 }}>
                                Submit
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    }
</View>

    )
}

export default SignForPeace