/**
 * @file DataService.js
 * @Owner Muhammad Sultan
 * @Date modified 18.10.2023
 * @purpose uploading functionality , upload images
 *
 */

import storage from '@react-native-firebase/storage';
import { Platform } from 'react-native';

/**
 * 
 * @param {string} uri 
 * @param {string} path 
 * @returns imgUrl 
 */

export const uploadImage = async (uri: string, path: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const storageRef = storage().ref(path);
            const localUri = Platform.OS === 'ios' ? `file://${uri}` : uri;
            await storageRef.putFile(localUri);

            const imageUrl = await storageRef.getDownloadURL();

            resolve(imageUrl);
        } catch (error) {
            console.error('Error uploading image:', error);
            reject(error);
        }
      });
  };
