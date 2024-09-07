import { Platform } from 'react-native'
import React from 'react'
import ScholarStack from './src/navigation/Navigator'
import { NavigationContainer } from '@react-navigation/native'
import { MenuProvider } from 'react-native-popup-menu'
import Toast from 'react-native-toast-message'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
  webClientId: '739431608336-shl6v9uadplgsmg404oj29u6b34ee6s9.apps.googleusercontent.com',
});

const App = () => {
  return(
    <MenuProvider>
    <NavigationContainer>
      <ScholarStack />
    <Toast topOffset={Platform.OS==='ios'?30:20} />
    </NavigationContainer>
    </MenuProvider>
  ) 
}

export default App