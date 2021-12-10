import React, { useState, useEffect } from "react";
import $ from 'jquery';
import { useHistory, useParams } from 'react-router';
import axios from "axios";
import { toast as toastFlash } from 'react-hot-toast';
import { toast } from 'react-toastify';
import Logo from '../components/Logo';
import { SOCKET } from '../components/Config';
import NavLinks from '../components/Nav';
import { css } from "@emotion/core";
import { Modal } from 'react-bootstrap';
import { joinChannel, leaveEventAudience, leaveEventHost } from "../components/VideoComponent";
import { useSelector, useDispatch } from "react-redux";
import { userProfile, videoCall, videoCallUser } from "../features/userSlice";
import { addDefaultSrc, changeGiftLinkDomain, changeImageLinkDomain, checkLiveDomain, checkLoginRole, removeVideoListRightClick, restrictBack, returnDefaultImage } from "../commonFunctions";
import BarLoader from "react-spinners/BarLoader";
import useToggle from "../components/CommonFunction";
import { GIFT_LIST_API, STREAMER_REPORT_API } from "../components/Api";
import NotificationManager from "react-notifications/lib/NotificationManager";

var totalSeconds = 0, timeCounterLive, timerVar;

let videoCallStatus = 0, videoCallParams, interval,
connectedPeopleInterval, updateConnectedPeopleTimeInterval,
changeConnectedPeople = [],  callType = 0,
  messageList = [], allGifts = [], removeGiftInterval,
  manageCoinsTimeViewsInterval, manageCoinsTimeViewsCounter = 0, hostCallCheck = true

  const toastFlashOptions = {
    duration: 10000,
    position: 'top-center',
    iconTheme: {
        primary: '#000',
        secondary: '#fff',
    },
    ariaProps: {
        role: 'status',
        'aria-live': 'polite',
    }
  };

const clearChatState = (dispatch) => {
  dispatch(videoCall(null))
}
const reportList = [{"id": "1", "title": "Illegal Activity"},
  {"id": "2", "title": "Spam"},
   {"id": "3", "title": "Harassment or Bullying"},
    {"id": "4", "title": "Hate Speech/Discrimination"},
     {"id": "5", "title": "Nudity or Pornography"},
     {"id": "6", "title": "Underage"},
      {"id": "7", "title": "Impersonation"},
       {"id": "8", "title": "Something Else"}]
const override = css`
  display: block;
  margin: 10px auto;
  border-radius: 50px !important;
  width: 95%;
`;
 
const SearchProfile = () => {
  const [user, setUserData] = useState(null);
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const videoCallState = useSelector(videoCallUser); //using redux useSelector here

  const [isExpired, setIsExpired] = useState(false);
  const [totalCoinsLeft, setTotalCoinsLeft] = useState(null);
  const [totalTimeLeft, setTotalTimeLeft] = useState(null);
  const [chatTyping, setChatTyping] = useState("");
  const [CompleteMessageList, setMessages] = useState([]);

  let [loading, setLoading] = useState(false);
  const [UserMessage, setuserMessage] = useState('');
  const [friendGift, setFriendGift] = useState([]);
  const [randomNumberGift, setRandomNumberGift] = useState('');
  const [randomNumber, setRandomNumber] = useState('');
  const [isOn, toggleIsOn] = useToggle();
  const [GiftData, setGiftData] = useState([]);
  const [givenGift, setGivenGift] = useState();
  const [reRenderGifts, setReRenderGifts] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ report: "" })
  const [showWarning, setShowWarning] = useState(null);

  const [time, changeTime] = useState("00:00:00");

  const userData = useSelector(userProfile).user.profile; //using redux useSelector here

  function countTimer() {
    ++totalSeconds;
    var hour = Math.floor(totalSeconds / 3600);
    var minute = Math.floor((totalSeconds - hour * 3600) / 60);
    var seconds = totalSeconds - (hour * 3600 + minute * 60);
    if (hour < 10)
        hour = "0" + hour;
    if (minute < 10)
        minute = "0" + minute;
    if (seconds < 10)
        seconds = "0" + seconds;
    timeCounterLive = hour + ":" + minute + ":" + seconds;
    changeTime(timeCounterLive)
    console.log("timeCounterLivetimeCounterLive", timeCounterLive)
}


  const componentWillUnmount = (reactLeave) => {
    if (videoCallStatus == 3) {
      SOCKET.emit("unauthorize_video_call", {
        sender: { user_from_id: videoCallParams.user_from_id, session_id: localStorage.getItem("session_id") },
        reciever_id: videoCallParams.user_to_id,
        channel_name: videoCallParams.channel_name,
        type: callType,
        status: 3
      });
      videoCallStatus = 0;
    }
    // localStorage.removeItem("videoCallPageRefresh");
    clearChatState(dispatch);
    clearInterval(removeGiftInterval);
    clearInterval(manageCoinsTimeViewsInterval);
    clearInterval(connectedPeopleInterval);
    clearInterval(updateConnectedPeopleTimeInterval);
    clearInterval(timerVar);
    if (!reactLeave)
    // window.location.href = "/streamer-app/chat";
    window.location.replace("/streamer-app" + localStorage.getItem("prevPage"))
  }

  useEffect(() => {
    if (showWarning == false) {
      endCall(true)
    }
}, [showWarning])

  useEffect(() => {
    removeVideoListRightClick()
  }, [])

  useEffect(() => {
    if (!!userData) {
      setUserData(userData)
    }
  }, [userData])
  useEffect(() => {
  //   window.onbeforeunload = function(event)
  //   {
  //     return !!localStorage.getItem("videoCallPageRefresh") ? confirm("Confirm refresh") : false;
  // }
    if (!params.channel_name) {
      componentWillUnmount()
    }
    else {
      videoCallParams = {
        user_from_id: params.user_from_id,
        user_to_id: params.user_to_id,
        channel_id: params.channel_id,
        channel_name: params.channel_name,
        channel_token: null,
        user_to_image: null
      }

      document.getElementsByClassName("vc-screen")[0]
        .setAttribute("id", (params.receiver == "false" ? "video-sender" : "video-receiver"))

        if (!localStorage.getItem("videoCallPageRefresh")) {
        // if (params.receiver == "true") {
        dispatch(videoCall(videoCallParams))
        // }
        localStorage.setItem("videoCallPageRefresh", "1");
    
      setLoading(true);
      SOCKET.emit("authenticate_video_call", {
        sender: { user_from_id: videoCallParams.user_from_id, session_id: localStorage.getItem("session_id") },
        reciever_id: videoCallParams.user_to_id,
        channel_name: videoCallParams.channel_name,
        calling_streamer: true,
        type: callType,
        videoCallState: params.receiver == "false" ? videoCallState : null
      });
      SOCKET.emit("authenticate_one_to_one_video_message", {
        sender_id: Number(videoCallParams.user_from_id),
        user_id: Number(userData.user_id), 
        channel_name: videoCallParams.channel_name
    });
    

    SOCKET.off('acknowledged_video_call').on('acknowledged_video_call', (data) => {
      if ((data.user_from_id == videoCallParams.user_from_id && data.user_to_id == videoCallParams.user_to_id)
          ||
          (data.user_from_id == videoCallParams.user_to_id && data.user_to_id == videoCallParams.user_from_id)
      ) { // check one-to-one data sync
        // fetch the client and streamer w.r.t channel name.... once
        SOCKET.emit("get_connected_people_video_call_once", {
          sender: {user_from_id: videoCallParams.user_from_id, session_id: localStorage.getItem("session_id")},
          reciever_id: videoCallParams.user_to_id,
          channel_name: videoCallParams.channel_name,
          type: callType,
          socket_id: localStorage.getItem("socket_id")
        });

        // update the time after 1 sec

        updateConnectedPeopleTimeInterval = window.setInterval(() => {
          SOCKET.emit("update_connected_people_video_call_time", {
            sender: {user_from_id: videoCallParams.user_from_id, session_id: localStorage.getItem("session_id")},
            reciever_id: videoCallParams.user_to_id,
            channel_name: videoCallParams.channel_name,
            type: callType,
            is_host: params.receiver == "false" ? true : false,
            time: timeCounterLive
          });
        }, 1000)

        connectedPeopleInterval = window.setInterval(() => {
          SOCKET.emit("get_connected_people_video_call", {
            sender: {user_from_id: videoCallParams.user_from_id, session_id: localStorage.getItem("session_id")},
            reciever_id: videoCallParams.user_to_id,
            channel_name: videoCallParams.channel_name,
            type: callType,
            socket_id: localStorage.getItem("socket_id")
          });
      }, 120000)
      }
  });

  SOCKET.off('get_connected_people_video_call_once').on('get_connected_people_video_call_once', (data) => {
    if ((data.user_from_id == videoCallParams.user_from_id && data.user_to_id == videoCallParams.user_to_id)
        ||
        (data.user_from_id == videoCallParams.user_to_id && data.user_to_id == videoCallParams.user_from_id)
    ) { // check one-to-one data sync
      console.log(data, "jsgdjfgsgc")
      changeConnectedPeople = (data.details)[0];
    }
});

SOCKET.off('get_connected_people_video_call').on('get_connected_people_video_call', (data) => {
  if ((data.user_from_id == videoCallParams.user_from_id && data.user_to_id == videoCallParams.user_to_id)
      ||
      (data.user_from_id == videoCallParams.user_to_id && data.user_to_id == videoCallParams.user_from_id)
  ) { // check one-to-one data sync
    console.log(changeConnectedPeople, (data.details)[0], "htcbfdjvjfm")
    const latestConnectedPeople = (data.details)[0];
    if (!!changeConnectedPeople && !!latestConnectedPeople) {
    if (changeConnectedPeople.time_from_id != latestConnectedPeople.time_from_id) {
      console.log("host is safe")
      // check audience...
      if (changeConnectedPeople.time_to_id == latestConnectedPeople.time_to_id) {
       // audience has left --- remove the audience from deadlock....  (offline and delete token from table)
       SOCKET.emit("remove_browser_storage", { "user_id": Number(changeConnectedPeople.user_to_id) });
        SOCKET.emit("is_user_active", { "user_id": Number(changeConnectedPeople.user_to_id), is_online: 0 });
        SOCKET.emit("destroy_socket_connection", { user_id: Number(changeConnectedPeople.user_to_id) });
        SOCKET.emit("destroy_session", { "user_id": Number(changeConnectedPeople.user_to_id)});
        window.setTimeout(() => {
          SOCKET.emit("receiver_decline_video_call", {
            sender: {user_from_id: videoCallParams.user_from_id},
            reciever_id: videoCallParams.user_to_id,
            channel_name: videoCallParams.channel_name,
            showMsg: false,
            type: callType,
            status: 2
          })
        }, 250)
      }
      else {
        console.log("audience is safe")
      }
    }
    else {
      // host has left --- remove the host from deadlock....  (offline and delete token from table)
      SOCKET.emit("remove_browser_storage", { "user_id": Number(changeConnectedPeople.user_from_id) });
      SOCKET.emit("is_user_active", { "user_id": Number(changeConnectedPeople.user_from_id), is_online: 0 });
      SOCKET.emit("destroy_socket_connection", { user_id: Number(changeConnectedPeople.user_from_id) });
      SOCKET.emit("destroy_session", { "user_id": Number(changeConnectedPeople.user_from_id)});
      window.setTimeout(() => {
      SOCKET.emit("sender_decline_video_call", {
        sender: {user_from_id: videoCallParams.user_from_id},
        reciever_id: videoCallParams.user_to_id,
        channel_name: videoCallParams.channel_name,
        showMsg: true,
        type: callType,
        status: 2
      });
    }, 250)
    }
    changeConnectedPeople = latestConnectedPeople;
  }
}
});

    SOCKET.off('unauthorize_video_call').on('unauthorize_video_call', (data) => {
      if ((data.user_from_id == videoCallParams.user_from_id && data.user_to_id == videoCallParams.user_to_id)
        ||
        (data.user_from_id == videoCallParams.user_to_id && data.user_to_id == videoCallParams.user_from_id)
      ) { // check one-to-one data sync.
        componentWillUnmount()
      }
    });

    SOCKET.off('end_one_to_one_video_call_no_coin_warning').on('end_one_to_one_video_call_no_coin_warning', (data) => {
      if (data.channel_name == videoCallParams.channel_name) {
        if (Number(userData.user_id) === data.user_id) {
          NotificationManager.error("no coins left", "", 2000, () => {return 0}, true);
          // alert("No coins Left")
          endCall(false)
        }
        else { // audience..
          NotificationManager.error("your friend is left with no coins. Sorry the call is declining", "", 2000, () => {return 0}, true);
          // alert("Your friend is left with no coins. Sorry the call is declining.")
          endCall(false)
        }
      }
    })

    SOCKET.off('end_one_to_one_video_call_warning').on('end_one_to_one_video_call_warning', (data) => {
      if (data.channel_name == videoCallParams.channel_name) {
        if (Number(userData.user_id) === data.user_id) {
          alert(data.msg)
          endCall(false)
        }
        else { // audience..
          alert(data.msg)
          endCall(false)
        }
      }
    })

    SOCKET.off('send_one_to_one_video_item').on('send_one_to_one_video_item', (message) => {
      let messagesList = messageList;

      if (
          // message.sender_id == videoCallParams.user_id &&
          // message.user_id == videoCallState.user_id &&
          videoCallParams.channel_name == message.channel_name) { //check one-to-one data sync
          if (!!message.message.message) {
              if (message.sender_id == videoCallParams.user_from_id &&
                  message.user_id == userData.user_id) {
                  alert(message.message.message)
              }
          }
          else {
              if (message.message.chat_type === 0) {
                  const new_message = {
                      message: message.message.text_message,
                      message_sender_name: message.message.message_sender_name,
                      receiver_id: userData.user_id,
                      user_id: videoCallParams.user_from_id
                  }
                  messagesList.push(new_message);
                  messageList = messagesList;
                  setMessages(messagesList);
                  setRandomNumber(Math.random());
                  scrollToBottom()
              }
              if (message.message.chat_type === 1) {
                  if ((!!userData && !!videoCallParams && userData.user_id == videoCallParams.user_from_id)) {
                    // host
                    const show_host_coins = true;
                    liveVideoManageCoinsTimeViews(show_host_coins)
                  }
                  else {
                    // audience
                    liveVideoManageCoinsTimeViews()
                  }
                  const gift = {
                      user: changeImageLinkDomain() + message.message.userImage,
                      gift: changeGiftLinkDomain() + message.message.giftImage,
                      f_name: message.message.user_first_name,
                      l_name: message.message.user_last_name,
                      gift_name: message.message.giftName,
                      dateTime: new Date()
                  }
                  let newGift = friendGift;
                  newGift.unshift(gift);
                  setFriendGift(newGift);
                  allGifts = newGift;
                  setRandomNumberGift(Math.random());
              }
          }

      }

  });

    SOCKET.off('get_messages_one_to_one_video').on('get_messages_one_to_one_video', (messages) => { // only one time
      if (messages.sender_id == videoCallParams.user_from_id &&
          messages.user_id == userData.user_id &&
          videoCallParams.channel_name == messages.channel_name) {
          setLoading(false);
          let all_messages = [];
          const socket_messages = messages.messages;
          for (let i in socket_messages) {
              all_messages.push({
                  message: socket_messages[i].message,
                  message_sender_name: socket_messages[i].message_sender_name,
                  receiver_id: socket_messages[i].receiver_id,
                  user_id: socket_messages[i].user_id
              })
          }
          setMessages(all_messages);
          messageList = all_messages;
      }
  });

  SOCKET.off('typing_one_to_one_video_message').on('typing_one_to_one_video_message', (typing) => { // only one time
      if (videoCallParams.channel_name == typing.channel_name) {
          if (typing.user_id !== userData.user_id) {
              setChatTyping(typing.typing_user)
              window.setTimeout(() => {
                  setChatTyping("")
              }, 2000)
          }
      }
  })

    SOCKET.off('one_to_one_video_manage_coins_time_views').on('one_to_one_video_manage_coins_time_views', (data) => {
      if (data.channel_name === videoCallParams.channel_name && userData.user_id == data.user_id) {
        if (data.msg === "") {
          setTotalCoinsLeft(data.coins / 2);
        }
        else {
          alert(data.msg)
        }
      }
    })

    SOCKET.off('timeCounter_video_call').on('timeCounter_video_call', (data) => {
      if ((data.user_from_id == videoCallParams.user_from_id && data.user_to_id == videoCallParams.user_to_id)
        ||
        (data.user_from_id == videoCallParams.user_to_id && data.user_to_id == videoCallParams.user_from_id)
      ) { // check one-to-one data sync
        if (data.isExpired) {
          componentWillUnmount()
        }
      }
    });

    SOCKET.off('sender_show_video_call').on('sender_show_video_call', (data) => {
      if ((data.user_from_id == videoCallParams.user_from_id && data.user_to_id == videoCallParams.user_to_id)
        ||
        (data.user_from_id == videoCallParams.user_to_id && data.user_to_id == videoCallParams.user_from_id)
      ) { // check one-to-one data sync
        if (!!userData && (data.user_from_id == userData.user_id)) {
          const option = {
            appID: "5ea417359e3a431eb385142711de92da",
            channel: videoCallState.channel_name,
            uid: 0,
            token: videoCallState.channel_token,
            key: '',
            secret: ''
          }
          const volume = false;
          joinChannel('audience', option, volume, "i_am_aud")
          interval = window.setInterval(() => {
            var list = document.getElementById("local_stream");   // Get the <ul> element with id="myList"
            if (!!list) {
              list.remove() // Remove <ul>'s first child node (index 0)
              clearInterval(interval)
            }
          }, 1000)
        }
      }
    })

    const liveVideoManageCoinsTimeViews = (show_host_coins) => {
      SOCKET.emit("one_to_one_video_manage_coins_time_views", {
        channel_name: videoCallParams.channel_name,
        user_id: userData.user_id,
        sender_id: videoCallParams.user_from_id,
        streamer_id: videoCallParams.user_to_id,
        counter: manageCoinsTimeViewsCounter,
        streamer_calling: localStorage.getItem("is_streamer_calling") == "true" ? true : false,
        show_host_coins
      })
    }

    const manageLiveAudienceHostDetails = () => {
      liveVideoManageCoinsTimeViews()
      manageCoinsTimeViewsInterval = window.setInterval(() => {
        liveVideoManageCoinsTimeViews()
        manageCoinsTimeViewsCounter = manageCoinsTimeViewsCounter + 60
      }, 60000)
    }

    SOCKET.off('authorize_video_call').on('authorize_video_call', (data) => {
      if ((data.user_from_id == videoCallParams.user_from_id && data.user_to_id == videoCallParams.user_to_id)
        ||
        (data.user_from_id == videoCallParams.user_to_id && data.user_to_id == videoCallParams.user_from_id)
      ) { // check one-to-one data sync

        if (!hostCallCheck) {
          if (!!userData && (data.user_from_id == userData.user_id)) { // host..
            window.setInterval(() => {
              var list = document.getElementById("remote_video_");
              if (!!list) {
                console.log(list.childNodes, "sdgkjhjbfd")
                if (list.childNodes.length > 1) {
                  console.log(list.childNodes[0].childNodes[0], "jdciugdibug")
                  if (!!list.childNodes[0].childNodes[0]) {
                    list.childNodes[0].childNodes[0].muted = true;
                  }

                  if (!!list.childNodes[0].childNodes[1]) {
                    list.childNodes[0].childNodes[1].remove()
                  }
                }
              }
            }, 1000)
          }
          if (!!userData && (data.user_from_id == userData.user_id)) {
            if (data.show_volla_alert) {
            toastFlashOptions.icon = '💲';
            toastFlash("Volla !! Earned 100 diamonds right away. You will earn 100 diamonds on each minute.", toastFlashOptions)
          }
        }
          document.getElementById("ringer").pause();
          manageLiveAudienceHostDetails();
          // start timer on client.... side
          timerVar = setInterval(countTimer, 1000);
        }
        else {
          if (!!userData && (data.user_to_id == userData.user_id)) {
            if (data.show_volla_alert) {
            toastFlashOptions.icon = '💲';
            toastFlash("Volla !! Earned 100 diamonds right away. You will earn 100 diamonds on each minute.", toastFlashOptions)
          }
        }
        }
        if (!!userData && (data.user_to_id == userData.user_id)) {
          timerVar = setInterval(countTimer, 1000);
          window.setTimeout(() => {
            manageLiveAudienceHostDetails()
          }, 250)
          // liveVideoManageCoinsTimeViews()
          SOCKET.emit("acknowledged_video_call", {
            sender: { user_from_id: videoCallParams.user_from_id, session_id: localStorage.getItem("session_id") },
            reciever_id: videoCallParams.user_to_id,
            channel_name: videoCallParams.channel_name,
            type: callType,
            status: 1
          });
          // initate video call for receiver...
          const option = {
            appID: "5ea417359e3a431eb385142711de92da",
            channel: data.videoCallState.channel_name,
            uid: 0,
            token: data.videoCallState.channel_token,
            key: '',
            secret: ''
          }
          const volume = true;
          joinChannel('audience', option, volume, "i_am_aud");
          joinChannel('host', option, volume);
          interval = window.setInterval(() => {
            var list = document.getElementById("remote_video_");
            if (!!list) {
              if (list.childNodes.length > 1) {
                // list.removeChild(list.childNodes[0]); haha
              }
              clearInterval(interval)// Remove <ul>'s first child node (index 0)
            }
          }, 1000)

          // add timer... after 1 min to detect the expire of the link

          SOCKET.emit("timeCounter_video_call", {
            sender: { user_from_id: videoCallParams.user_from_id, session_id: localStorage.getItem("session_id") },
            reciever_id: videoCallParams.user_to_id,
            channel_name: videoCallParams.channel_name,
            type: callType,
            status: 1
          });
        }
        if (!!userData && (data.user_from_id == userData.user_id)) { // host..
          // initate video call for sender...
          if (hostCallCheck) {
            const show_host_coins = true;
            liveVideoManageCoinsTimeViews(show_host_coins)
            document.getElementById("ringer").play();
            // manageLiveAudienceHostDetails()
            const option = {
              appID: "5ea417359e3a431eb385142711de92da",
              channel: videoCallState.channel_name,
              uid: 0,
              token: videoCallState.channel_token,
              key: '',
              secret: ''
            }
            const volume = false;
            joinChannel('host', option, volume)
            hostCallCheck = false;
          }

          interval = window.setInterval(() => {
            var list = document.getElementById("remote_video_");
            var list_local = document.getElementById("local_stream");   // Get the <ul> element with id="myList"

            if (!!list) {
              if (list.childNodes.length === 3) {
                // list.removeChild(list.childNodes[1]); haha
              }
              // clearInterval(interval)// Remove <ul>'s first child node (index 0)
            }
            if (!!list_local) {
              if (list_local.childNodes.length > 1) {
                // list_local.removeChild(list_local.childNodes[1]); haha
              }
              // Remove <ul>'s first child node (index 0)
              // clearInterval(interval)
            }
          }, 1000)
        }
      }
    });

    removeGiftInterval = window.setInterval(() => {
      const current_time = new Date();
      for (let i in allGifts) {
          const startDate = allGifts[i].dateTime;
          const seconds = (current_time.getTime() - startDate.getTime()) / 1000;
          if (seconds > 10) {
              allGifts.splice(i, 1)
          }
      }
      setFriendGift(allGifts);
      setReRenderGifts(Math.random())
  }, 250)
}
    else {
      setShowWarning(true)
      // videoCallStatus = 3
      //  componentWillUnmount()
    }
    // }, 100)

    SOCKET.off('receiver_decline_video_call').on('receiver_decline_video_call', (data) => {
      leaveEventAudience()
      leaveEventHost()
      clearChatState(dispatch);
    clearInterval(removeGiftInterval);
    clearInterval(manageCoinsTimeViewsInterval);
    clearInterval(connectedPeopleInterval);
    clearInterval(updateConnectedPeopleTimeInterval);
    clearInterval(timerVar);

      localStorage.removeItem("is_streamer_calling")
      localStorage.removeItem("videoCallPageRefresh");
      // SOCKET.disconnect();
      dispatch(videoCall(null))
      const page = "/streamer-app" + localStorage.getItem("prevPage")
      if (!!localStorage.getItem("user_id") && (data.user_from_id == localStorage.getItem("user_id"))) { // check one-to-one data sync
        if (data.showMsg) {
          // alert("receiver declined your call...")
        }
        // history.push(page)
        // window.location.href = page
        window.location.replace(page)
      }
      if (!!localStorage.getItem("user_id") && (data.user_to_id == localStorage.getItem("user_id"))) { // check one-to-one data sync
        // history.push(page)
        // window.location.href = page
        window.location.replace(page)
      }
    })
    SOCKET.off('sender_decline_video_call').on('sender_decline_video_call', (data) => {
      if (!data.onlySender) {
        leaveEventAudience()
        leaveEventHost()
        clearChatState(dispatch);
        clearInterval(removeGiftInterval);
        clearInterval(manageCoinsTimeViewsInterval);
        clearInterval(connectedPeopleInterval);
        clearInterval(updateConnectedPeopleTimeInterval);
        clearInterval(timerVar);
        
        localStorage.removeItem("is_streamer_calling")
        localStorage.removeItem("videoCallPageRefresh");
        // SOCKET.disconnect();
        dispatch(videoCall(null))
        const page = "/streamer-app" + localStorage.getItem("prevPage")
        if (!!localStorage.getItem("user_id") && (data.user_to_id == localStorage.getItem("user_id"))) { // check one-to-one data sync
          if (data.showMsg) {
            // alert("sender declined the call...")
          }
          // history.push(page)
          // window.location.href = page
          window.location.replace(page)
        }
        if (!!localStorage.getItem("user_id") && (data.user_from_id == localStorage.getItem("user_id"))) { // check one-to-one data sync
          // history.push(page)
          // window.location.href = page
          window.location.replace(page)
        }
      }
    })
  }
  restrictBack()
  const reactLeave = true
  return () => componentWillUnmount(reactLeave)
}, [])

  const endCall = (showMsg) => {
    if (params.receiver == "false") {
      leaveEventAudience()
      leaveEventHost()
      SOCKET.emit("sender_decline_video_call", {
        sender: { user_from_id: videoCallParams.user_from_id },
        reciever_id: videoCallParams.user_to_id,
        channel_name: videoCallParams.channel_name,
        showMsg,
        type: callType,
        status: 2
      });
    }
    else {
      leaveEventAudience()
      leaveEventHost()
      SOCKET.emit("receiver_decline_video_call", {
        sender: { user_from_id: videoCallParams.user_from_id },
        reciever_id: videoCallParams.user_to_id,
        channel_name: videoCallParams.channel_name,
        showMsg,
        type: callType,
        status: 2
      });
    }
  }

  const scrollToBottom = () => {
    var div = document.getElementById('chat-body');
    if (!!div)
        div.scroll({ top: div.scrollHeight, behavior: 'smooth' });
}

const scrollToTop = () => {
    // $('body, html, #giftSender').scrollTop(0);
    $('body, html, #giftSender').animate({
        scrollTop: 0
    }, 1000);
}

  const CheckTextInputIsEmptyOrNot = (e) => {
    e.preventDefault()
    if (UserMessage != '') {
        var message = {
            "firstName": userData.first_name,
            "lastName": userData.last_name,
            "user_id": Number(userData.user_id),
            "text_message": UserMessage,
            "channel_name": videoCallParams.channel_name,
            "sender_id": Number(videoCallParams.user_from_id),
            "type": 0,
            "gift_id": null,
            "is_send_heart": 0,
            "coins": 0,
            "message_sender_name": userData.first_name + " " + userData.last_name
        }
        SOCKET.emit("send_one_to_one_video_item", message);
        setuserMessage(''); //Empty user input here
    } else {
    }
}
const changeInput = (e) => {
  setuserMessage(e.target.value)
  SOCKET.emit("typing_one_to_one_video_message", {
      user_id: userData.user_id,
      typing_user: userData.first_name + " " + userData.last_name,
      channel_name: videoCallParams.channel_name
  })
}

useEffect(() => {
  scrollToBottom();
}, [randomNumber])

useEffect(() => {
  scrollToTop();
}, [randomNumberGift])


const handleGift = async () => {
  toggleIsOn(true);

  const bodyParameters = {
      session_id: localStorage.getItem('session_id'),
  }
  const { data: { result, status } } = await axios.post(GIFT_LIST_API, bodyParameters)

  if (status == 200) {
      setGiftData(result);
  }
}
//get single  gift item
const getGiftItem = async (giftId) => {
  var message = {
      "user_id": Number(userData.user_id),
      "text_message": "",
      "channel_name": videoCallParams.channel_name,
      "sender_id": Number(userData.user_id) === Number(videoCallParams.user_from_id) ? Number(videoCallParams.user_to_id) : Number(videoCallParams.user_from_id),
      "type": 1,
      "gift_id": giftId,
      "is_send_heart": 0,
      "coins": 0,
      "message_sender_name": userData.first_name + " " + userData.last_name
  }

  SOCKET.emit('send_one_to_one_video_item', message);
  setGivenGift('');
  //  setLoading(true);
  toggleIsOn(false);
}
const actionButton = () => {
  document.getElementById("actionBtn").classList.toggle("show-hide-action-btns");
}

const closeReport = () => {
  setIsLoading(false)
  setForm({report: ""})
  setShowReport(false);
}
const handleOpenReport = () => {
setShowReport(true)
setForm({report: ""})
}
const handleReport = () => {

  setIsLoading(true);
  if(!!form.report){
  const bodyParameters = {
    session_id: localStorage.getItem('session_id'),
    to_user_id: localStorage.getItem("is_streamer_calling") == "true" ? Number(videoCallParams.user_to_id) : Number(videoCallParams.user_from_id),
    message: form.report,
    type: 2
  }
  axios.post(STREAMER_REPORT_API, bodyParameters)
    .then((response) => {

      if (response.status == 200 && response.data.error == false) {
        NotificationManager.success("report send successfully", "", 2000, () => { return 0 }, true);
      //   setSmShow(false);
        setIsLoading(false);
      }
      else {
        setIsLoading(false);
        NotificationManager.error(response.data.error_message, "", 1500, () => { return 0 }, true);
      }
      setShowReport(false);
    }, (error) => {
      setShowReport(false);
      setIsLoading(false);
      NotificationManager.error(error.message, "", 2000, () => { return 0 }, true);
    });
  }
};
const handleChange = e => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  })
}

  return (
    <section className="home-wrapper">
      <img className="bg-mask" src="/streamer-app/assets/images/mask-bg.png" alt="Mask" />
      <div className="header-bar">
        <div className="container-fluid p-0">
          <div className="row no-gutters">
            <div className="col-lg-5 p-3">
              <div className="d-flex flex-wrap align-items-center">
                <div className="logo-tab d-flex justify-content-between align-items-start">
                  <a href="javascript:void(0)" style={{ cursor: "default" }}>
                    <img src="/streamer-app/assets/images/glitters.png" alt="Glitters" />
                  </a>
                </div>
                <div className="vc-head-title d-flex flex-wrap align-items-center ml-5">
                  <div className="vc-user-name d-flex flex-wrap align-items-center">
                    <figure>
                      {
                        !user &&
                        <img src={changeImageLinkDomain() + "1611574536_download.jpg"} alt="placeholder" />
                      }
                      {
                        !!user &&
                        <img src={user.profile_images[0]} alt="Augusta Castro" />
                      }
                    </figure>
                    {
                      !!user &&
                      <div className="name ml-2">{user.first_name} <span className="age">{user.age}</span></div>
                    }
                    {
                      !user &&
                      <div className="name ml-2"> <span className="age"> </span></div>
                    }
                  </div>
                  <div className="remaining-coins ml-4">
                    <><img src="/streamer-app/assets/images/diamond-coin.png" alt="Coins" /> </>
                    {
                      <span>{totalCoinsLeft !== null && totalCoinsLeft}</span>
                    }

                  </div>
                </div>
              </div>
            </div>
            <div>
            </div>

            <div className="col-lg-7 p-3">
              <div className="tab-top d-flex flex-wrap-wrap align-items-center">
                <div className="vc-action-tab ml-auto mr-4 position-relative">
                   <div className="vc-action-btn" onClick={actionButton}>
                <span />
                <span />
                <span />
              </div>
                   <ul className="action-menu" id="actionBtn">
                <li>
                    <a href="javascript:void(0)" onClick={() => handleOpenReport()}>Report</a> 
                
                </li>
                <li>
                  <a href="javascript:void(0)">Block</a>
                </li>
                {/* <li>
                  <a href="javascript:void(0)" onClick={() =>endCall(true)}>End Video</a>
                </li> */}
              </ul>
              <a href="javascript:void(0)" className="end-calls btn bg-grd-clr" onClick={() => endCall(true)}>End Video</a>
                </div>
                <NavLinks />
                {/* <a href="javascript:void(0)" className="end-video bg-grd-clr" onClick={() => endCall(true)}>End Video</a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="vc-screen-wrapper image-auto">
        <div className="vc-screen d-flex h-100">
          <div className="col-md-9 p-0">
            <div id="local_stream" className="local_stream" style={{ width: "400px", height: "400px" }}></div>
            <div
              id="remote_video_"
              style={{ width: "100%", height: "100%" }}
            />
        
        <div class="gift-sender" id="giftSender">
                            {
                                friendGift.map((item, index) => (
                                    <div className="gifter" id={item.gift}>
                                        <img src={item.user} alt="gifter" />
                                        <div className="gifter__info">
                                            <h6>{item.f_name + " " + item.l_name}</h6>
                                            <span>Sent a {item.gift_name}</span>
                                        </div>
                                        <div className="gifter__media">
                                            <img src={item.gift} alt="gift" />
                                        </div>
                                    </div>
                                ))

                            }

                        </div>

          {/* {
            (!!userData && !!videoCallParams && userData.user_id == videoCallParams.user_from_id) &&
            <div className="charges-reminder-txt">
              <p>You will be charged 200 coins per minute</p>
            </div>
          } */}
          <div className="vc-timer-box text-center">
            <div className="timer">
              <i className="far fa-clock"></i>
              <span>{time}</span>
            </div>
            {/* <div className="vc-sppiner">
           <a className="sppiner bg-grd-clr" href="javascript:void(0)">
             <img src="/streamer-app/assets/images/sppiner.png" alt="Sppiner"/>
           </a>
         </div> */}
          </div>
          <div className="vc-option-block d-flex flex-wrap align-items-end">
         <div className="vc-options">
           <ul>
             {/* <li>
               <a className="btn-round bg-grd-clr" href="javascript:void(0)">
                 <img src="/streamer-app/assets/images/magic-stick.png" alt="Magic"/>
               </a>
             </li>
             <li>
               <a className="btn-round bg-grd-clr" href="javascript:void(0)">
                 <img src="/streamer-app/assets/images/chat.png" alt="Chat"/>
               </a>
             </li> */}
             {
               checkLoginRole() == 1 &&
               <li>
               <a className="btn-round bg-grd-clr" href="javascript:void(0)" onClick={handleGift}>
                 <img src="/streamer-app/assets/images/gift.png" alt="Gift"/>
               </a>
             </li>
             }
             {/* <li>
               <a className="btn btn-nxt bg-grd-clr" href="javascript:void(0)">Next</a>
             </li> */}
           </ul>
         </div>
       </div>
        </div>
       
        <div class="col-md-3 live__comments_bg p-4">
                         <div class="live__comments__wrap">
                            <form autoComplete="off" onSubmit={CheckTextInputIsEmptyOrNot}>
                                {
                                    !loading && CompleteMessageList.length === 0 &&
                                    <div className="nothing-to-see text-center active">
                                        <figure>
                                            <img src="/streamer-app/assets/images/message-circle.png" alt="Message" />
                                            <figcaption>Nothing To See</figcaption>
                                        </figure>
                                    </div>
                                }
                                <div class="live__comments__items live__comments" id="chat-body">
                                    {
                                        CompleteMessageList.map((data, i) => (
                                            <>
                                                <span class="comment_username">{data.message_sender_name} :</span> {data.message} <br />
                                            </>
                                        ))
                                    }



                                </div>

                                <div class="write-comments">
                                    <div className="sweet-loading">
                                        <BarLoader color={"#fcd46f"} loading={loading} css={override} size={1000} />
                                    </div>
                                    <div class="write-comments__fields position-relative">
                                        <input type="text" name="comments" id="Message" placeholder="Message..." value={UserMessage} onChange={e => changeInput(e)} />
                                        <button type="submit" class="send-message-button bg-grd-clr"><i class="fas fa-paper-plane"></i></button>
                                        {
                                            !!chatTyping &&
                                            <div>{chatTyping} is typing...</div>
                                        }
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
        </div>
        <div className={isOn ? 'video-streaming-gift all-gifts-wrapper active' : 'all-gifts-wrapper video-streaming-gift'} >
                    <div className="all-gift-inner">
                        <a href="javascript:void(0)" className="close-gift-btn modal-close" onClick={toggleIsOn}><img src="/streamer-app/assets/images/btn_close.png" /></a>
                        <div className="all-gift-header d-flex flex-wrap align-items-center mb-3">
                            <h5 className="mb-0 mr-4">Send Gift</h5>
                            <div className="remaining-coins">
                                <img src="/streamer-app/assets/images/diamond-coin.png" alt="Coins" />
                                <span> {totalCoinsLeft !== null && totalCoinsLeft}</span>
                            </div>
                        </div>
                        <div className="all-gift-body">

                            <ul className="d-flex flex-wrap text-center gift__items">
                                {GiftData.map((items, i) => {
                                    return <li onClick={() => getGiftItem(items.id)}>
                                        <a href="javascript:void(0)" >
                                            <div>
                                                <figure>
                                                    <img onError={(e) => addDefaultSrc(e)} src={!!items.image ? items.image : returnDefaultImage()} alt={items.name} />
                                                </figure>
                                                <div className="gift-price">
                                                    <img src="/streamer-app/assets/images/diamond-coin.png" alt="Coins" />
                                                    <span>{items.coins / 2}</span>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                })}
                                <li>
                                </li>
                                <li>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
      </div>

      <Modal className="coin-gained-modal" show={showWarning} backdrop="static" keyboard={false}>
                <div className="edit-profile-modal__inner">
                    <h4 className="theme-txt text-center mb-4 ">Warning <span className="warning-emoji">⚠️</span></h4>
                </div>
                <span>It's recommended to not refresh the page when the video call is going on otherwise it may break the functionalities. If you want to end the video please click the "End Video" button.</span>
    <br/>
    <button className="btn bg-grd-clr" onClick={() => setShowWarning(false)}style={{ cursor: "pointer" }}>Got It</button>
                {/* <a href="javascript:void(0)" className="modal-close" onClick={() => setShowWarning(false)}><img src="/streamer-app/assets/images/btn_close.png" /></a> */}
            </Modal>

      <Modal className="report-modal" show={showReport} onHide={closeReport} backdrop="static" keyboard={false}>
                <div className="edit-profile-modal__inner">
                    <form>
                        <div className="choose-report d-flex flex-wrap">
                            {
                                reportList.map((data, index) => (
                            <div className="form-group">
                                <input type="radio" name="report" value={data.title} id={"option-"+index} onChange={handleChange} checked={form.report == data.title ? "checked" : ""} />
                                <label for={"option-"+index}></label>
                                <span>{data.title}</span>
                            </div>
                                ))
                            }
                        </div>
                        <a className={!!isLoading ? "btn bg-grd-clr d-block btn-countinue-3 disabled" : "btn bg-grd-clr d-block btn-countinue-3"} id="edit-second-step" href="javascript:void(0)" onClick={handleReport}>{!!isLoading ? "Processing" : "Report"}</a>
                    </form>
                </div>
                <a href="javascript:void(0)" className="modal-close" onClick={closeReport}><img src="/streamer-app/assets/images/btn_close.png" /></a>
            </Modal>
    </section>


  )
}
export default SearchProfile;



