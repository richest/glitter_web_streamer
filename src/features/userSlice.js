import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { GET_LOGGEDPROFILE_API } from "../components/Api";

const videoInitState = {
    user_from_id: null,
    user_to_id: null,
    user_to_image: null,
    channel_id: null,
    channel_name: null,
    channel_token: null
};

const audioInitState = {
    user_from_id: null,
    user_to_id: null,
    user_to_image: null,
    channel_id: null,
    channel_name: null,
    channel_token: null,
    type: null
};

const liveVideoInitState = {
    user_id: null,
    call_type: null,
    channel_id: null,
    channel_name: null,
    channel_token: null
};


export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        profile: null,
        filterData: [],
        is_authanticated: !!localStorage.getItem("session_id"),
        video: videoInitState,
        audio: audioInitState,
        live_video: liveVideoInitState,
        stripePlanId: null,
        friendStatus: [],
        stripeCoinPlanId: null,
        myLiveLoading: false,
        randomMessage: false
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.is_authanticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.is_authanticated = false;
        },
        profile: (state, action) => {
            state.profile = action.payload.profile;
        },
        randomMessageMe: (state, action) => {
            state.randomMessage = action.payload.status;
        },
        filterData: (state, action) => {
            state.filterData = action.payload.filterData;
        },
        videoCall: (state, action) => {
            state.video = !!action.payload ? action.payload : videoInitState;
        },
        audioCall: (state, action) => {
            state.audio = !!action.payload ? action.payload : audioInitState;
        },
        stripePlanId: (state, action) => {
            state.stripePlanId = action.payload.stripePlanId;
        },
        liveVideoCall: (state, action) => {
            state.liveVideo = !!action.payload ? action.payload : liveVideoInitState;
        },
        stripeCoinPlanId: (state, action) => {
            state.stripeCoinPlanId = action.payload.stripeCoinPlanId;
        },
        friendStatus: (state, action) => {
            state.friendStatus = action.payload.friendStatus;
        },
        myLiveLoading: (state, action) => {
            state.myLiveLoading = action.payload;
        }
    }
});
export const { friendStatus, login, logout, profile, randomMessageMe,
     filterData, videoCall, audioCall, stripePlanId, 
     stripeCoinPlanId, liveVideoCall, myLiveLoading } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const userProfile = (state) => state;
export const userRandomMessage = (state) => state.user.randomMessage;
export const stripeDataPlanid = (state) => state.user.stripePlanId;
export const stripeCoinDataPlanid = (state) => state.user.stripeCoinPlanId;
export const friendStatusData = (state) => state.user.friendStatus;
export const userAuth = (state) => state.user.is_authanticated;
export const filterDataUser = (state) => state.user.filterData;
export const videoCallUser = (state) => state.user.video;
export const audioCallUser = (state) => state.user.audio;
export const liveVideoCallUser = (state) => state.user.live_video;
export const myLiveLoadingData = (state) => state.user.myLiveLoading;
export default userSlice.reducer;