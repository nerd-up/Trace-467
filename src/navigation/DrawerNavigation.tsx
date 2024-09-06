import { createDrawerNavigator } from '@react-navigation/drawer';
import UserProfile from '../screens/UserProfile';
import EditProfile from '../screens/EditProfile';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="UserProfile" component={UserProfile} />
      <Drawer.Screen name="Edit Profile" component={EditProfile} />
      {/* Other drawer screens */}
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;