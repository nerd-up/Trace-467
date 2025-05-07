/**
 * @file Navigator.tsx
 * @description This script is responsible for controling page navigation.
 * @ownership ?
 * @last modified 9/20/2023
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EditProfile from '../screens/additive/EditProfile';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Splash from '../screens/Splash';
import UserProfile from '../screens/UserProfile';
import Post from '../screens/Post';
import Colors from '../theme/ScholarColors';
import Certificate from '../screens/Certificate';
import WallOfPeace from '../screens/WallOfPeace';
import Chats from '../screens/Chats';
import User from '../screens/User';
import ChatRoom from '../screens/ChatRoom';
import { Text } from 'react-native';
import AuthLoading from '../screens/AuthLoading';
import Report from '../screens/Report';
import ReportUser from '../screens/ReportUser';
import BlockedUsers from '../screens/BlockedUsers';
import EditPost from '../screens/EditPost';
import Terms from '../screens/Terms';
import Settings from '../screens/Settings';
import ForgotPassword from '../screens/ForgotPassword';

const Stack = createNativeStackNavigator();


function ScholarStack() {
    return (
        <Stack.Navigator initialRouteName="AuthLoading">
            <Stack.Screen name="AuthLoading" component={AuthLoading} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
            <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfile}  />
            <Stack.Screen name="Certificate" component={Certificate}  options={{headerShown:false}}/>
            <Stack.Screen name="WallOfPeace" component={WallOfPeace}  options={{headerShown:false}}/>
            <Stack.Screen name="Chats" component={Chats} options={{headerTitle:() => <Text style={{fontSize:25,color:'black',fontWeight:'bold'}}>Chats</Text>,headerStyle:{backgroundColor:'transparent'}}}/>
            <Stack.Screen name="ChatRoom" component={ChatRoom} options={{headerBackVisible:true}}/>
            <Stack.Screen name="User" component={User}  options={{headerShown:false}}/>
            <Stack.Screen name="Post" component={Post} options={{title:"Make a post",headerStyle:{
                backgroundColor:Colors.lightBackground,
            }}}/>
            <Stack.Screen name="EditPost" component={EditPost}  options={{title:"Edit Post",headerShown:true}}/>
             <Stack.Screen name="BlockedUsers" component={BlockedUsers} options={{title:"Blocked users",headerStyle:{
                backgroundColor:Colors.lightBackground,
            }}}/>
           
           <Stack.Screen name="ReportPost" component={Report}  />
           <Stack.Screen name="DownloadCertificate" component={Certificate}  />
           <Stack.Screen name="ReportUser" component={ReportUser}  />
           <Stack.Screen name="Settings" component={Settings}  />
           <Stack.Screen name="Terms" component={Terms} />
            {/* <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} /> */}
        </Stack.Navigator>
    );
}

export default ScholarStack;