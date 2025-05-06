import firestore from '@react-native-firebase/firestore';
import { collectionRef, refState, UserCredentials } from '../../types/types';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { showSucess } from '../utils/utitlity';

export const getFromFirebase = async (ref: any) => {
  try {
    const snapshot = await ref.get();
    if (snapshot.exists) {
     
      return snapshot._data; // Return only the document data
    } else {
      throw new Error("Document does not exist");
    }
  } catch (error) {
    throw error;
  }
};

export const getItemsFromFirebase = async (ref:any) => {
  try {
    const snapshot = await ref.get();
    const items = snapshot.docs.map((doc:any) => ({ id: doc.id, ...doc.data() }));
    return items;
  } catch (error) {
    throw error;
  }
};

export const addItemToFirebase = async (item: any, ref: any): Promise<boolean> => {
  try {
    await ref.set(item); 
    return true; 
  } catch (error) {
    console.error("Error adding item to Firebase: ", error);
    return false; 
  }
};

export const addWithoutDoc = async (item: any, ref: any): Promise<boolean> => {
  try {
    console.log("i am here :",item);
    await ref.add(item); 
    return true; 
  } catch (error) {
    console.error("Error adding item to Firebase: ", error);
    return false; 
  }
};

export const addDoubleRefToFirebase = async (item: any,item2:any, ref: any,ref2:any): Promise<boolean> => {
  try {
    await ref.set(item); 
    await ref2.set(item2); 
    return true; 
  } catch (error) {
    console.error("Error adding item to Firebase: ", error);
    return false; 
  }
};
export const removeDoubleRefToFirebase = async ( ref: any,ref2:any): Promise<boolean> => {
  try {
    await ref.delete(); 
    await ref2.delete(); 
    return true; 
  } catch (error) {
    console.error("Error Remove item to Firebase: ", error);
    return false; 
  }
};
export const updateItemToFirebase = async (item: any, ref: any): Promise<boolean> => {
  try {
    await ref.update(item); 
    return true; 
  } catch (error) {
    console.error("Error adding item to Firebase: ", error);
    return false; 
  }
};

  export const signupWithEmailPassword = async (userData: UserCredentials) => {
   const {email, password} = userData;
   try {
    const response = await auth().createUserWithEmailAndPassword(email, password);
    const user={
      uid:response.user.uid,
      date:new Date().toISOString(),
      emailVerified:response.user.emailVerified,
      ...userData
    } 
    if(response){
      await response.user.sendEmailVerification()
      .then(()=>{
        showSucess('Verification Email Sent', 'Please check your email to verify your account.');
      })
      .catch(err => {
        showSucess('Error', 'Failed to send email verification');
      })
      const userRef = firestore().collection('users').doc(user.uid); // Correct reference creation
      const result = await addItemToFirebase(user, userRef); // Correctly pass the user data and reference
      if (result) {
        return user;
      }
      else {
        await response.user.delete();
        }
    }
    return null;
  } catch (error: any) {
    throw new Error(error.code);
  } 
  }; 
  
  export const loginWithEmailPassword = async (userData: UserCredentials) => {
    const {email, password} = userData;
   console.log("recieved data",userData);
   try {
    const response = await auth().signInWithEmailAndPassword(email, password);
    console.log("response: ", JSON.stringify(response,null,2));
    if (!response.user.emailVerified) {
      await response.user.sendEmailVerification()
      .then(()=>{
        showSucess('Verification Email Sent!');
      })
      .catch(err => {
        showSucess('Error', err.code ?? 'Failed to send email verification');
      })
      throw new Error("Email not verified, Please verify your email");

    }
    const res={
      email:response.user?.email,
      uid:response.user?.uid,
      name:response.user?.displayName,
      emailVerified:response.user?.emailVerified,
    }
    return res;
  } catch (error: any) {
    const errorMessage = error.message || error.code || "An unknown error occurred";
    throw new Error(errorMessage);
  }
  };
  
  export const logout = async () => {
    await auth().signOut();
  };
  

export  const fetchJoinedCommunities = async (ref:any,userId:any) => {
    try {
      const snapshot = await ref.get();
      const items = snapshot.docs.map((doc:any) => doc.id);
      return items;
    } catch (error) {
      throw error;
    }
  };

//upload pic on Firebase

// export const uploadImageToFirebase = async (uri: string): Promise<string> => {
//   try {
//     const filename = uri.substring(uri.lastIndexOf('/') + 1);
//     const storageRef = storage().ref(`profileImages/${filename}`);
//     const task = storageRef.putFile(uri);

//     task.on('state_changed', taskSnapshot => {
//       const progress = (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
//       console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes} (${progress.toFixed(2)}%)`);
//     });

//     await task;

//     const downloadURL = await storageRef.getDownloadURL();
//     return downloadURL;
//   } catch (error) {
//     console.error(`Error uploading image: ${error.message}`);
//     throw new Error(`Error uploading image: ${error.message}`);
//   }
// };
export const uploadImage = async (uri: string, path: string): Promise<string> => {
  try {
      // const localUri = Platform.OS === 'ios' ? `file://${uri}` : uri;
      const storageRef = storage().ref(path);
      await storageRef.putFile(uri);

      const downloadURL = await storageRef.getDownloadURL();
      return downloadURL;
  } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Error uploading image: ${error.message}`);
  }
};

export const deleteUser = async () => {
  try {
    const user = auth().currentUser;

    if (!user) {
      throw new Error('No user is currently logged in.');
    }

    const userId = user.uid;

    // Delete the user's document from Firestore
  
    // Delete the user from Firebase Authentication
    await user.delete().then(async() => {
      await firestore().collection('users').doc(userId).delete();
      console.log('User data deleted from Firestore.');
    });
    console.log('User deleted from Firebase Authentication.');
    return true; // Return true if both operations succeed
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};