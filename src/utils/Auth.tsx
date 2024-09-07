/**
 * Authentication utils
 */

import auth from '@react-native-firebase/auth'

export const getUserId = (): string => {
    const user = auth().currentUser;
    if (user?.uid !== undefined) {
        return user.uid;
    }
    return "";
}
