// store/thunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginWithEmailPassword, signupWithEmailPassword } from '../../services/firebase';

interface signup{
  username:string;
  id:string
}
interface allProps{
  
} 

//Register a new user
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (data:any, { rejectWithValue }) => {
    try {
      if(data!==null){
        const user = await signupWithEmailPassword(data);
        return user;
       }
        return data;
    } catch (error: any) {
      return rejectWithValue(error.toString());
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: any, { rejectWithValue }) => {
    try { 
      if(data!==null){
      const user = await loginWithEmailPassword(data);
      return user;
    }
      return data;
    } catch (error: any) {
      return rejectWithValue(error.toString());
    }
  }
);

export const getAsync = createAsyncThunk(
  'auth/getAsync',
  async (user:any, { rejectWithValue }) => {
    try { 
      return user;
    } catch (error: any) {
      return rejectWithValue(error.toString());
    }
  }
);

//logout user
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      AsyncStorage.removeItem('user');
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

//delete user
export const deleteUser = createAsyncThunk(
  'auth/deleteUser',
  async (id:string, { rejectWithValue }) => {
    try {
     await deleteRecord(id)
    await  AsyncStorage.removeItem('user');
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);




  