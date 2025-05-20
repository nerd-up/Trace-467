// store/slices/dataSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import {deleteUser, getAsync, loginUser, loginUserGoogle, logoutUser, signupUser } from './asyncThunk';
import { showError, showSucess } from '../../utils/utitlity';
import AsyncStorage from '@react-native-async-storage/async-storage';
const authSlice = createSlice({
  name: 'authData',
  initialState,
  reducers:{
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.signupData.loading = true;
        state.signupData.message = null;
      })
      .addCase(signupUser.fulfilled, (state, action:any) => {
        if(action?.payload === null){
          state.signupData=initialState.signupData;
          return;
        }
        AsyncStorage.setItem('user',JSON.stringify(action.payload))
        state.signupData.response = action.payload;
        state.authData.response = action.payload;
        state.signupData.loading = false;
        // showSucess('Success','Successfully Created Account!');
        state.signupData.message ='Successfully Created Account!';
        state.signupData.status=true;
      })
      .addCase(signupUser.rejected, (state, action: any) => {
        showError('Failed', action.payload ?? 'Failed to Register');
        state.signupData.message = action.payload ?? 'Failed to sign up';
        state.signupData.loading = false;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.authData.loading = true;
        state.authData.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action:any) => {
        if(action?.payload===null){
          state.authData=initialState.authData;
          return;
        }
        state.authData.response = action.payload;
        AsyncStorage.setItem('user',JSON.stringify( action.payload))
        showSucess('Success','Successfully Logged in!');
        state.signupData.message ='Successfully Logged in!';
        state.authData.loading = false;
        state.authData.status=true;
      })
      .addCase(loginUser.rejected, (state, action:any) => {
        showError('Failed', action.payload?? 'Failed to log in');
        state.authData.message = action.payload ?? 'Failed to log in';
        state.authData.loading = false;
      })

      // Login with google
      .addCase(loginUserGoogle.pending, (state) => {
        state.authData.loading = true;
        state.authData.message = null;
      })
      .addCase(loginUserGoogle.fulfilled, (state, action:any) => {
        if(action?.payload===null){
          state.authData=initialState.authData;
          return;
        }
        state.authData.response = action.payload;
        showSucess('Success','Successfully Logged in!');
        state.signupData.message ='Successfully Logged in!';
        state.authData.loading = false;
        state.authData.status=true;
      })
      .addCase(loginUserGoogle.rejected, (state, action:any) => {
        showError('Failed', action.payload?? 'Failed to log in');
        state.authData.message = action.payload ?? 'Failed to log in';
        state.authData.loading = false;
      })

       // Login async storage
       .addCase(getAsync.pending, (state) => {
        state.authData.loading = true;
        state.authData.message = null;
      })
      .addCase(getAsync.fulfilled, (state, action:any) => {
        if(action?.payload===null){
          state.authData=initialState.authData;
          return;
        }
        state.authData.response = action.payload;
        state.signupData.message ='Successfully Logged in!';
        state.authData.loading = false;
        state.authData.status=true;
      })
      .addCase(getAsync.rejected, (state, action:any) => {
        showError('Failed', action.payload?? 'Failed to log in');
        state.authData.message = action.payload ?? 'Failed to log in';
        state.authData.loading = false;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.logoutData.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state,action:any) => {
        if(action?.payload ===null){
          state.logoutData=initialState.logoutData;
          return;
        } 
        state.authData = initialState.authData;
        state.signupData = initialState.signupData;
        state.logoutData.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action: any) => {
        state.logoutData.message = action.payload ?? 'Failed to log out';
        state.logoutData.loading = false;
      })

       // delete user
       .addCase(deleteUser.pending, (state) => {
        state.authData.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state,action:any) => {
        if(action?.payload ===null){
          state.authData=initialState.authData;
          return;
        } 
        state.authData = initialState.authData;
        state.authData.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action: any) => {
        state.authData.message = action.payload ?? 'Failed to log out';
        state.authData.loading = false;
      })

  },
  
});

export const {reducer} = authSlice;
