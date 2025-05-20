import Toast from "react-native-toast-message";
import { objectionableWords } from "./data"
import { ALERT_TYPE, Dialog } from "react-native-alert-notification";
import { Dimensions } from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
export const screenWidth= Dimensions.get('window').width;
export const screenHeight= Dimensions.get('window').height;
export const checkAbusive=(sentence:string)=>{
    const sentenceWords = sentence.split(/\s+/);
    // Iterate through the wordsArray and check for matches
    for (let word of objectionableWords) {
        if (sentenceWords.includes(word)) {
            return true; // Return true if a match is found
        }
    }
    return false; 
}

export const showError = (text1='',text2='') => {
  Dialog.show({
    type: ALERT_TYPE.DANGER,
    title: text1,
    textBody:text2,
    button: 'close',
    autoClose: true,
  })
  }
  export const showSucess = (text1='',text2='') => {
    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: text1,
      textBody:text2,
      button: 'close',
      autoClose: true,
    })
  }

  export const limitText = (text: string,limit=12) =>{
  return text?.length > limit? text?.substring(0, limit) + '...' : text;
  }
  export const getFileName = (path:string) => {
    return path.substring(path.lastIndexOf('/') + 1);
  };
  export const chooseFileAndCrop=async ()=>{
    return new Promise((resolve, reject) => {
      ImagePicker.openPicker({
        cropping: true,
        mediaType: 'photo',
        compressImageQuality:1,
    }).then((image) => {
      resolve(image); // Return the image object (contains path, etc.)
    })
    .catch((error) => {
      if (error.code === 'E_PICKER_CANCELLED') {
        // Handle cancellation case
        reject('User cancelled the image picker');
      } else {
        // Handle other errors (e.g., permission issues, invalid image formats, etc.)
        reject(error.message || 'An error occurred while picking the image');
      }
    });
     })  
    }