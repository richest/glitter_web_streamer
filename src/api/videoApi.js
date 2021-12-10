import axios from "axios";
import { CHECK_I_AM_BUSY_API, TOKEN_AGORA_API, VIDEO_CALL_START } from "../components/Api";
import { videoCall, liveVideoCall, audioCall, myLiveLoading } from "../features/userSlice";
import moment from "moment";
import { NotificationManager } from "react-notifications";

export const generateVideoChatToken = (history, dispatch, bodyParameters, startVideoChatInitParams) => {
    axios.post(TOKEN_AGORA_API, bodyParameters)
        .then((response) => {
            if (response.data.status == 200 && !response.data.error) {
                let nowDate = moment().format();
                nowDate = nowDate.replace("T", " ").replace("+", " ");
                nowDate = nowDate.split(" ");
                nowDate = nowDate[0] + " " + nowDate[1];

                let newState = {};
                newState.user_from_id = startVideoChatInitParams.user_from_id;
                newState.user_to_id = startVideoChatInitParams.user_to_id;
                newState.channel_id = startVideoChatInitParams.channel_id;
                newState.user_to_image = startVideoChatInitParams.user_to_image;
                newState.channel_name = response.data.data.chanelName;
                newState.channel_token = response.data.data.token;
                newState.call_created_date = nowDate;
                newState.streamer_calling = true;
                newState.call_type = 0;
                dispatch(videoCall(newState))
                startVideoChatInit(history, dispatch, newState)
            }
            else {
                if (response.status === 200 && response.data.error) {
                    alert(response.data.message)
                }
                else {
                    alert(response.data.message)
                }
                history.push(localStorage.getItem("prevPage"))
            }
        }, (error) => {
            alert(error.message)
            history.push(localStorage.getItem("prevPage"))
        });
}

export const checkIfIamBusy = (bodyParameters, callback) => {
    axios.post(CHECK_I_AM_BUSY_API, bodyParameters)
        .then((response) => {
            if (response.data.status === 200 && !response.data.error) {
                callback(true)
            }
            else {
                NotificationManager.info(response.data.message, "", 5000, () => { return 0 }, true);
                callback(false)
            }
        }, (error) => {
            NotificationManager.error(error.message, "", 5000, () => { return 0 }, true);
            callback(false)
        });
}

export const generateAudioChatToken = (history, dispatch, bodyParameters, startVideoChatInitParams) => {

    axios.post(TOKEN_AGORA_API, bodyParameters)
        .then((response) => {
            if (response.status === 200 && !response.data.error) {
                let nowDate = moment().format();
                nowDate = nowDate.replace("T", " ").replace("+", " ");
                nowDate = nowDate.split(" ");
                nowDate = nowDate[0] + " " + nowDate[1];

                let newState = {};
                newState.user_from_id = startVideoChatInitParams.user_from_id;
                newState.user_to_id = startVideoChatInitParams.user_to_id;
                newState.channel_id = startVideoChatInitParams.channel_id;
                newState.user_to_image = startVideoChatInitParams.user_to_image;
                newState.channel_name = response.data.data.chanelName;
                newState.channel_token = response.data.data.token;
                newState.streamer_calling = true;
                newState.call_created_date = nowDate;
                newState.call_type = 1;
                dispatch(audioCall(newState))
                startAudioChatInit(history, dispatch, newState)
            }
            else {
                if (response.status === 200 && response.data.error) {
                    alert(response.data.message)
                }
                else {
                    alert(response.data.message)
                }
                history.push(localStorage.getItem("prevPage"))
            }
        }, (error) => {
            alert(error.message)
            history.push(localStorage.getItem("prevPage"))
        });
}


export const generateLiveVideoChatToken = (dispatch, history, bodyParameters, call_type, user_id, channel_id, block_countries, SOCKET) => {
    axios.post(TOKEN_AGORA_API, bodyParameters)
        .then((response) => {
            if (response.status === 200 && !response.data.error) {
                let newState = {};
                newState.host_name = bodyParameters.user_name;
                newState.host_id = user_id;
                newState.user_id = user_id;
                newState.call_type = call_type;
                newState.channel_id = channel_id;
                newState.channel_name = response.data.data.chanelName;
                newState.channel_token = response.data.data.token;

                localStorage.setItem("liveVideoProps", JSON.stringify(newState))

                dispatch(liveVideoCall(newState));
                SOCKET.emit("block_countries_live_video_call", { user_id, block_countries }, newState)
                // SOCKET.emit("start_live_video_call", newState)
            }
            else {
                dispatch(myLiveLoading(false))
                if (response.status === 200 && response.data.error) {
                    alert(response.data.message)
                }
                else {
                    alert(response.data.message)
                }
                history.push(localStorage.getItem("prevPage"))
            }
        }, (error) => {
            dispatch(myLiveLoading(false))
            history.push(localStorage.getItem("prevPage"))
        });
}
export const startVideoChatInit = (history, dispatch, bodyParameters) => {
    axios.post(VIDEO_CALL_START, bodyParameters)
        .then((response) => {
            if (response.status === 200) {
                window.setTimeout(() => {
                    localStorage.setItem("is_streamer_calling", true)
                    history.push("/false/" + bodyParameters.user_from_id + "/" + bodyParameters.user_to_id + "/" + bodyParameters.channel_id + "/" + bodyParameters.channel_name + "/video-chat");
                }, 5000)
            }
            else {
                alert("something went wrong...")
            }
        }, (error) => {
            alert(error.message)
        });
}

export const startAudioChatInit = (history, dispatch, bodyParameters) => {
    axios.post(VIDEO_CALL_START, bodyParameters)
        .then((response) => {
            if (response.status === 200) { // db entry done
                window.setTimeout(() => {
                    localStorage.setItem("is_streamer_calling", true)
                    history.push("/false/" + bodyParameters.user_from_id + "/" + bodyParameters.user_to_id + "/" + bodyParameters.channel_id + "/" + bodyParameters.channel_name + "/audio-chat");
                }, 5000)
            }
            else {
                alert("something went wrong...")
            }
        }, (error) => {
            alert(error.message)
        });
}