import Toast from "react-native-toast-message";
import { objectionableWords } from "./data"

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
    // Alert.alert('leh')
    Toast.show({
      type:'error',
      text1: text1,
      text2: text2,
    });
  }
  export const showSucess = (text1='',text2='') => {
    // Alert.alert('leh')
    Toast.show({
      type: 'success',
      text1: text1,
      text2: text2,
    });
  }

  export const limitText = (text: string,limit=12) =>{
  return text?.length > limit? text?.substring(0, limit) + '...' : text;
  }