// store/slices/dataSlice.js
import { createSlice } from '@reduxjs/toolkit';
import {deleteFriendRequest, getAllFriends, getAllPosts, getAllUsers, getBlockedUsers, getFriendRequests, getLeaderBoard, getProfile, getUser, getUserPosts } from './asynThunk';
import { initialState } from './initialState';
import { showError, showSucess } from '../../utils/utitlity';
const dataSlice = createSlice({
  name: 'dashboardData',
  initialState,
  reducers:{},
  extraReducers: (builder) => {
    builder
    //get profile data
    .addCase(getProfile.pending, (state) => {
      state.profileData.loading = true;
      state.profileData.message = null;
    })
    .addCase(getProfile.fulfilled, (state, action:any) => {
      if(action?.payload===null){
        state.profileData=initialState.profileData;
        return;
      }
      state.profileData.response = action.payload;
      state.profileData.message ='profile loaded';
      state.profileData.loading = false;
      state.profileData.status = true;
    })
    .addCase(getProfile.rejected, (state, action:any) => {
      state.profileData.message = action.payload ?? 'Failed to get profile';
      state.profileData.loading = false;
      state.profileData.status = false;
    })
    
     //get all posts data
     .addCase(getAllPosts.pending, (state) => {
      state.getAllPostsData.loading = true;
      state.getAllPostsData.message = null;
    })
    .addCase(getAllPosts.fulfilled, (state, action:any) => {
      if(action?.payload===null){
        state.getAllPostsData=initialState.getAllPostsData;
        return;
      }
      state.getAllPostsData.response = action.payload;
      state.getAllPostsData.message ='data loaded';
      state.getAllPostsData.loading = false;
      state.getAllPostsData.status = true;
    })
    .addCase(getAllPosts.rejected, (state, action:any) => {
      state.getAllPostsData.message = action.payload ?? 'Failed to get posts';
      state.getAllPostsData.loading = false;
      state.getAllPostsData.status = false;
    })

     //get all friends data
     .addCase(getAllFriends.pending, (state) => {
      state.getAllFriendsData.loading = true;
      state.getAllFriendsData.message = null;
    })
    .addCase(getAllFriends.fulfilled, (state, action:any) => {
      if(action?.payload===null){
        state.getAllFriendsData=initialState.getAllFriendsData;
        return;
      }
      state.getAllFriendsData.response = action.payload;
      state.getAllFriendsData.message ='data loaded';
      state.getAllFriendsData.loading = false;
      state.getAllFriendsData.status = true;
    })
    .addCase(getAllFriends.rejected, (state, action:any) => {
      state.getAllFriendsData.message = action.payload ?? 'Failed to get friends';
      state.getAllFriendsData.loading = false;
      state.getAllFriendsData.status = false;
    })

     //get user data
     .addCase(getUser.pending, (state) => {
      state.getUserData.loading = true;
      state.getUserData.message = null;
    })
    .addCase(getUser.fulfilled, (state, action:any) => {
      if(action?.payload===null){
        state.getUserData=initialState.getUserData;
        return;
      }
      state.getUserData.response = action.payload;
      state.getUserData.message ='data loaded';
      state.getUserData.loading = false;
      state.getUserData.status = true;
    })
    .addCase(getUser.rejected, (state, action:any) => {
      state.getUserData.message = action.payload ?? 'Failed to get user';
      state.getUserData.loading = false;
      state.getUserData.status = false;
    })

     //get all users data
     .addCase(getAllUsers.pending, (state) => {
      state.getAllUsersData.loading = true;
      state.getAllUsersData.message = null;
    })
    .addCase(getAllUsers.fulfilled, (state, action:any) => {
      if(action?.payload===null){
        state.getAllUsersData=initialState.getAllUsersData;
        return;
      }
      state.getAllUsersData.response = action.payload;
      state.getAllUsersData.message ='data loaded';
      state.getAllUsersData.loading = false;
      state.getAllUsersData.status = true;
    })
    .addCase(getAllUsers.rejected, (state, action:any) => {
      state.getAllUsersData.message = action.payload ?? 'Failed to get all users';
      state.getAllUsersData.loading = false;
      state.getAllUsersData.status = false;
    })

     //get user posts data
     .addCase(getUserPosts.pending, (state) => {
      state.getUserPostsData.loading = true;
      state.getUserPostsData.message = null;
    })
    .addCase(getUserPosts.fulfilled, (state, action:any) => {
      if(action?.payload===null){
        state.getUserPostsData=initialState.getUserPostsData;
        return;
      }
      state.getUserPostsData.response = action.payload;
      state.getUserPostsData.message ='data loaded';
      state.getUserPostsData.loading = false;
      state.getUserPostsData.status = true;
    })
    .addCase(getUserPosts.rejected, (state, action:any) => {
      state.getUserPostsData.message = action.payload ?? 'Failed to get user posts';
      state.getUserPostsData.loading = false;
      state.getUserPostsData.status = false;
    })

     //get blocked users data
     .addCase(getBlockedUsers.pending, (state) => {
      state.getBlockedUsersData.loading = true;
      state.getBlockedUsersData.message = null;
    })
    .addCase(getBlockedUsers.fulfilled, (state, action:any) => {
      if(action?.payload===null){
        state.getBlockedUsersData=initialState.getBlockedUsersData;
        return;
      }
      state.getBlockedUsersData.response = action.payload;
      state.getBlockedUsersData.message ='data loaded';
      state.getBlockedUsersData.loading = false;
      state.getBlockedUsersData.status = true;
    })
    .addCase(getBlockedUsers.rejected, (state, action:any) => {
      state.getBlockedUsersData.message = action.payload ?? 'Failed to get blocked users';
      state.getBlockedUsersData.loading = false;
      state.getBlockedUsersData.status = false;
    })

     //get friend requests data
     .addCase(getFriendRequests.pending, (state) => {
      state.getFriendRequestsData.loading = true;
      state.getFriendRequestsData.message = null;
    })
    .addCase(getFriendRequests.fulfilled, (state, action:any) => {
      if(action?.payload===null){
        state.getFriendRequestsData=initialState.getFriendRequestsData;
        return;
      }
      state.getFriendRequestsData.response = action.payload;
      state.getFriendRequestsData.message ='data loaded';
      state.getFriendRequestsData.loading = false;
      state.getFriendRequestsData.status = true;
    })
    .addCase(getFriendRequests.rejected, (state, action:any) => {
      state.getFriendRequestsData.message = action.payload ?? 'Failed to get friends requests';
      state.getFriendRequestsData.loading = false;
      state.getFriendRequestsData.status = false;
    })

     //delete frind request data
     .addCase(deleteFriendRequest.pending, (state) => {
      state.deleteFriendRequestData.loading = true;
      state.deleteFriendRequestData.message = null;
    })
    .addCase(deleteFriendRequest.fulfilled, (state, action:any) => {
      if(action?.payload===null){
        state.deleteFriendRequestData=initialState.deleteFriendRequestData;
        return;
      }
      state.deleteFriendRequestData.response = action.payload;
      state.deleteFriendRequestData.message ='deleted rquest';
      state.deleteFriendRequestData.loading = false;
      state.deleteFriendRequestData.status = true;
    })
    .addCase(deleteFriendRequest.rejected, (state, action:any) => {
      state.deleteFriendRequestData.message = action.payload ?? 'Failed to delete request';
      state.deleteFriendRequestData.loading = false;
      state.deleteFriendRequestData.status = false;
    })

  },
  
});




export const {reducer} = dataSlice;
