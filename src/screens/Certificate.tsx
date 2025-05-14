import React, { useState } from 'react';
import { Alert, Image, PermissionsAndroid, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../theme/ScholarColors';
import useUserProfileStore from '../zustand/UserProfileStore';
import { useNavigation } from '@react-navigation/native';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FastImage from "@d11/react-native-fast-image"

const Certificate = () => {
    const navigation: any = useNavigation();
    const userProfile: any = useUserProfileStore((store) => store);
    const [userNameInput, setUserNameInput] = useState(userProfile.usrName || '');

    const goToWallOfPeace = () => {
        navigation.navigate('WallOfPeace');
    };

    const requestStoragePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted: any = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else {
            return true;
        }
    };

    const validateAndGenerateCertificate = async () => {
      if (userNameInput.trim() === '') {
          Alert.alert('Error', 'Please enter your name before generating the certificate.');
          return;
      }
      if (userNameInput === userProfile.usrName) {
          convertToPdf();
      } else {
          
          Alert.alert(
              'Name Mismatch',
              `The name you entered ("${userNameInput}") does not match the stored name ("${userProfile.usrName}"). Please enter the correct name to generate the certificate.`,
          );
      }
  };
  
    const convertToPdf = async () => {
        const isStoragePermissionGranted = await requestStoragePermission();
        if (!isStoragePermissionGranted) return;

        const htmlContent = `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; background-color: ${Colors.background}; }
                .container { border: 1px solid #ccc; padding: 20px; text-align: center; }
                .title { font-size: 32px; color: ${Colors.primary}; }
                .text { font-size: 28px; color: ${Colors.text}; }
                .underline { text-decoration: underline; }
              </style>
            </head>
            <body>
              <div class="container">
                <img src="data:image/png;base64,${require('../assets/unify-banner.png')}" style="height: 150px; width: 150px;" />
                <div class="title">Unify World Relations</div>
                <div class="text">Sportsman Certificate on ${userProfile.treatyDate}, "${userNameInput}" has received the Sportsman Certificate</div>
                <div class="text underline">${userNameInput}</div>
                <div class="text">Candidate Signatures</div>
              </div>
            </body>
          </html>
        `;

        try {
            const options = {
                html: htmlContent,
                fileName: 'CertificateOfPeace',
                directory: 'Documents',
            };
            // const file = await RNHTMLtoPDF.convert(options);
            // console.log('PDF generated:', file.filePath);
            // Alert.alert('PDF saved to:', file.filePath);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <View>
                    <FastImage source={require('../assets/icons/Trace467.jpg')} style={{ height: 150, width: 150 }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 32, color: Colors.linkColor }}>The</Text>
                    <Text style={{ fontSize: 32, color: Colors.linkColor }}>Sportsmans</Text>
                    <Text style={{ fontSize: 32, color: Colors.linkColor }}>App</Text>
                </View>
            </View>
            <View style={{ marginTop: 50, justifyContent: 'center' }}>
                <TextInput
                    style={{ fontSize: 28, color: Colors.text, textAlign: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: Colors.text, marginBottom: 20 }}
                    placeholder="Enter your name"
                    value={userNameInput}
                    onChangeText={(text) => setUserNameInput(text)}
                />
                <Text style={{ fontSize: 28, color: Colors.text, textAlign: 'center', justifyContent: 'center' }}>
                    Sportsman Certificate: On {userProfile.treatyDate} "{userNameInput}" has signed, certified the acknowledged the sportsmanship agreement.
                </Text>
                <Text style={{ textDecorationLine: 'underline', fontSize: 28, color: Colors.text, textAlign: 'center', justifyContent: 'center' }}>
                    {userNameInput}
                </Text>
            </View>
            <View style={{ marginTop: 50 }}>
                <TouchableOpacity onPress={goToWallOfPeace}>
                    <View style={{ marginTop: 20, backgroundColor: Colors.primary, padding: 10, borderRadius: 10, width: 300, alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>
                            Wall of Sportsmen
                        </Text>
                    </View>
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={validateAndGenerateCertificate}>
                    <View style={{ marginTop: 20, backgroundColor: Colors.primary, padding: 10, borderRadius: 10, width: 300, alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>
                            Download Your Certificate
                        </Text>
                    </View>
                </TouchableOpacity> */}
            </View>
        </View>
    );
};

export default Certificate;
