// store/thunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFromFirebase, removeDoubleRefToFirebase, updateItemToFirebase } from '../../services/firebase';

// get profile
export const getProfile = createAsyncThunk(
  'dashboard/getProfile',//same name of function
  async (ref:any, { rejectWithValue }) => {
    try {
      if(ref!==null) {
    const response=  await getFromFirebase(ref);
      return response; 
    } 
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// get all posts
export const getAllPosts = createAsyncThunk(
  'dashboard/getAllPosts',//same name of function
  async (ref:any, { rejectWithValue }) => {
    try {
      if(ref!==null) {
    const response=  await getFromFirebase(ref);
      return response; 
    }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// get all friends
export const getAllFriends = createAsyncThunk(
  'dashboard/getAllFriends',//same name of function
  async (ref:any, { rejectWithValue }) => {
    try {
      if(ref!==null) {
    const response=  await getFromFirebase(ref);
      return response; 
    }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// get all users
export const getAllUsers = createAsyncThunk(
  'dashboard/getAllUsers',
  async (ref:any, { rejectWithValue }) => {
    try {
      if(ref!==null) {
    const response=  await getFromFirebase(ref);
      return response; 
    }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// get a user
export const getUser = createAsyncThunk(
  'dashboard/getUser',
  async (ref:any, { rejectWithValue }) => {
    try {
      if(ref!==null) {
    const response=  await getFromFirebase(ref);
      return response; 
    }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// get a user posts
export const getUserPosts = createAsyncThunk(
  'dashboard/getUserPosts',
  async (ref:any, { rejectWithValue }) => {
    try {
      if(ref!==null) {
    const response=  await getFromFirebase(ref);
      return response; 
    } 
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


// get blocked users
export const getBlockedUsers = createAsyncThunk(
  'dashboard/getBlockedUsers',
  async (ref:any, { rejectWithValue }) => {
    try {
      if(ref!==null) {
    const response=  await getFromFirebase(ref);
      return response; 
    } 
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// get friend requests
export const getFriendRequests = createAsyncThunk(
  'dashboard/getFriendRequests',
  async (ref:any, { rejectWithValue }) => {
    try {
      if(ref!==null) {
    const response=  await getFromFirebase(ref);
      return response; 
    } 
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// get friend requests
export const deleteFriendRequest = createAsyncThunk(
  'dashboard/deleteFriendRequest',
  async ({item,ref}:any, { rejectWithValue }) => {
    try {
      if(ref!==null) {
    const response=  await updateItemToFirebase(item,ref);
      return response; 
    } 
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);



