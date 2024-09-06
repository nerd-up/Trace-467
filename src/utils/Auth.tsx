/**
 * Authentication utils
 */

import auth from '@react-native-firebase/auth'

export const getUserId = (): string => {
    const user = auth().currentUser;
    if (user?.uid !== undefined) {
        console.log(user.uid);
        return user.uid;
    }
    return "";
}
