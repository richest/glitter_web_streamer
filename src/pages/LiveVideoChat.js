import React, { useState, useEffect } from "react";
import $ from "jquery";
import { useHistory, useParams } from 'react-router';
import OwlCarousel from 'react-owl-carousel2';
import axios from "axios";
import Logo from '../components/Logo';
import { toast as toastFlash } from 'react-hot-toast';
import { Scrollbars } from 'react-custom-scrollbars';
import { toast } from 'react-toastify';
import { SOCKET } from '../components/Config';
import NavLinks from '../components/Nav';
import { Modal, ModalBody, Dropdown } from 'react-bootstrap';
import { joinChannel } from "../components/VideoComponent";
import { useSelector, useDispatch } from "react-redux";
import { css } from "@emotion/core";
import BarLoader from "react-spinners/BarLoader";
import { userProfile, liveVideoCall, liveVideoCallUser } from "../features/userSlice";
import { func } from "prop-types";
import { addDefaultSrc, checkLiveDomain, removeVideoListRightClick, restrictBack, returnDefaultImage } from "../commonFunctions";
import { GIFT_LIST_API, GIFT_PURCHASE_API, REPORT_USER_API, SPINNER_API, STREAMER_REPORT_API, TARGET_DEVICE_API } from "../components/Api";
import useToggle from "../components/CommonFunction";
import { changeImageLinkDomain, changeGiftLinkDomain } from "../commonFunctions"
import { Number } from "core-js";
import Wheel from 'lottery-wheel'
import { NotificationManager } from "react-notifications";
import { leaveEventAudience, leaveEventHost } from "../components/VideoComponent";

var totalSeconds = 0, timeCounterLive,
connectedPeopleInterval, updateConnectedPeopleTimeInterval,
changeConnectedPeople = [],
    timerVar, is_first_time_coin_check = true, myEntryCoins = 0, myTotalTimeSpent = "00:00:00", is_audience_decline = false;

const reportList = [{ "id": "1", "title": "Illegal Activity" },
{ "id": "2", "title": "Spam" },
{ "id": "3", "title": "Harassment or Bullying" },
{ "id": "4", "title": "Hate Speech/Discrimination" },
{ "id": "5", "title": "Nudity or Pornography" },
{ "id": "6", "title": "Underage" },
{ "id": "7", "title": "Impersonation" },
{ "id": "8", "title": "Something Else" }]

const data = [
    { text: 'spray', desc: 'The streamer should spray some glitter spray on her body in a very sensual way for 1 minute' },
    { text: 'Siluete', desc: 'The streamer must moisten her body with water, lather herself or massage her body with some oil for 30 seconds.' },
    { text: 'Lips', desc: 'The streamer must lick a lollipop, ice cream or a sex toy in a very sensual way, play with her mouth and her tongue for 30 seconds' },
    { text: 'Bra', desc: 'The streamer must put on some nipple covers and model in a very sensual way for the client for 30 seconds.' },
    { text: 'Diamond', desc: 'The user (client) must send a gift ring to the Streamer. :ring::gift: And she must do what he asks of her (as long as it is not a violent or illegal act) in return for 60 seconds.' },
    { text: 'Twerking', desc: 'The streamer must dance twerking in her underwear or naked in a very sensual way for 30 seconds.' },
    { text: 'Hand', desc: 'The streamer should pat her bottom for 30 seconds.' },
    { text: 'Feet', desc: 'The streamer must show her feet to the camera, massage them and if she has a sex toy on hand, play with her feet and her toy for 30 seconds. It should be noted that the girl should have her feet delicately groomed to make a better impression.' },
    { text: 'Diamond', desc: 'The client must send a diamond as a gift, to do so the streamer must play with an anal plug (preferably in the shape of a Diamond) and insert it into her body for 30 seconds.' },
    { text: 'Streap', desc: 'The streamer must do an erotic dance, you can remove clothes and massage her body for 60 seconds.' },
    { text: 'EyeBrows', desc: 'The streamer must be dressed up, with a very sensual makeup (preferably that she has a sexy outline and false eyelashes) she must look at the client in a very sensual way for 30 seconds, she can also make gestures with her mouth in this option.' },
    { text: 'Lotion', desc: 'The streamer should massage her body with body lotion in her underwear or completely naked for 30 seconds.' }
];

const toastFlashOptions = {
    duration: 5000,
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

const option = {
    loop: false,
    margin: 10,
    items: 13,
    nav: false,
    autoplay: true
};

let wheel, spinChange = false, videoCallStatus = 0, videoCallParams, interval, userData,
    messageList = [], receiver_id, removeGiftInterval, allGifts = [], audienceInterval,

    manageCoinsTimeViewsInterval, manageCoinsTimeViewsCounter = 0

const override = css`
  display: block;
  margin: 10px auto;
  border-radius: 50px !important;
  width: 95%;
`;

const clearChatState = (dispatch) => {
    dispatch(liveVideoCall(null))
}
const LiveVideoChat = () => {
    const params = useParams();
    const [user, setUserData] = useState(null);
    const [GiftData, setGiftData] = useState([]);
    const [isOn, toggleIsOn] = useToggle();
    const [givenGift, setGivenGift] = useState();
    const [CompleteMessageList, setMessages] = useState([]);
    const [randomNumber, setRandomNumber] = useState('');
    const [randomNumberGift, setRandomNumberGift] = useState('');
    const [reRenderGifts, setReRenderGifts] = useState('');
    let [loading, setLoading] = useState(false);

    const [time, changeTime] = useState("00:00:00");


    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);

    const [spin, setSpin] = useState(false);

    const [form, setForm] = useState({ report: "" })

    console.log(prizeNumber, "prizeNumber....")

    const history = useHistory();
    const dispatch = useDispatch();
    const videoCallState = !!localStorage.getItem("liveVideoProps") ? JSON.parse(localStorage.getItem("liveVideoProps")) : null; //using redux useSelector here

    const [isExpired, setIsExpired] = useState(false);
    const [UserMessage, setuserMessage] = useState('');

    const sessionId = localStorage.getItem('session_id');
    const [chatTyping, setChatTyping] = useState("");
    const [friendGift, setFriendGift] = useState([]);

    const [totalCoinsLeft, setTotalCoinsLeft] = useState(null);
    const [totalViews, setTotalViews] = useState([]);
    const [totalTimeLeft, setTotalTimeLeft] = useState(null);

    const [playWheel, setPlayWheel] = useState(true);

    const [showGainedCoins, setShowGainedCoin] = useState(false);

    const [showWarning, setShowWarning] = useState(null);

    const [showAudiences, setShowAudiences] = useState(false);

    const [showReport, setShowReport] = useState({ model: false, id: null });

    const [showEndVideo, setShowEndVideo] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [totalAudienceJoined, setTotalAudienceJoined] = useState([]);

    let doMyWheelPlaying = false;
    console.log(totalViews, "totalViews...")
    userData = useSelector(userProfile).user.profile; //using redux useSelector here




    console.log(CompleteMessageList, "CompleteMessageList,,,,,")
    console.log(userData, "userData.....")
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


    const componentWillUnmount = () => {
        if (!!localStorage.getItem("user_id") && localStorage.getItem("user_id") != params.user_id) { // audience
            if (is_audience_decline) {
                SOCKET.emit("audience_left_live_video_call", {
                    name: localStorage.getItem("name"),
                    image: null,
                    user_id: localStorage.getItem("user_id"),
                    channel_name: videoCallState.channel_name,
                    host_id: Number(videoCallParams.user_id)
                })
            }
        }

        // if (videoCallStatus == 4) {
        //     SOCKET.emit("unauthorize_live_video_call", {
        //         user_id: Number(videoCallParams.user_id),
        //         channel_name: videoCallParams.channel_name,
        //         type: 1,
        //         status: 4
        //     });
        //     videoCallStatus = 0;
        // }
        // localStorage.removeItem("videoCallPageRefresh");
        localStorage.removeItem("liveVideoProps");
        clearChatState(dispatch);
        clearInterval(audienceInterval);
        clearInterval(removeGiftInterval);
        clearInterval(connectedPeopleInterval);
        clearInterval(updateConnectedPeopleTimeInterval);
        clearInterval(manageCoinsTimeViewsInterval);
        clearInterval(timerVar);
        // window.location.href = "/search-home";
        window.location.replace("/streamer-app" + localStorage.getItem("prevPage"))
    }

    const actionButton = () => {
        document.getElementById("actionBtn").classList.toggle("show-hide-action-btns");
    }

    useEffect(() => {
        if (showWarning == false) {
            endForceCall()
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
        if (!showGainedCoins) {
            clearInterval(audienceInterval);
        }
    }, [showGainedCoins])

    const closeCoinGained = () => {
        setShowGainedCoin(false);
    }

    const closeReport = () => {
        setIsLoading(false)
        setForm({ report: "" })
        setShowReport({ model: false, id: null });
    }
    const handleOpenReport = (Id) => {
        setForm({ report: "" })
        setShowReport({ model: true, id: Id })
    }
    const sendReport = () => {

    }

    const handleChange = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const getHostOldTime = (people, hostID) => {
        for (let i in people) {
            if (people[i].user_id == hostID) {
                return people[i].call_time
            }
        }
        return "00:00:00"
    }

    const getHostNewTime = (people, hostID) => {
        for (let i in people) {
            if (people[i].user_id == hostID) {
                return people[i].call_time
            }
        }
        return "00:00:00"
    }

    const checkAudienceTime = (changeConnectedPeople, latestConnectedPeople) => {
        for (let i in latestConnectedPeople) {
            for (let j in changeConnectedPeople) {
                if (changeConnectedPeople[j].user_id == latestConnectedPeople[i].user_id) {
                    if (changeConnectedPeople[j].call_time == latestConnectedPeople[i].call_time) {
                        // audience has left --- remove the audience from deadlock....  (offline and delete token from table)
                        SOCKET.emit("remove_browser_storage", { "user_id": Number(latestConnectedPeople[i].user_id) });
                         SOCKET.emit("is_user_active", { "user_id": Number(latestConnectedPeople[i].user_id), is_online: 0 });
                         SOCKET.emit("destroy_socket_connection", { user_id: Number(latestConnectedPeople[i].user_id) });
                         SOCKET.emit("destroy_session", { "user_id": Number(latestConnectedPeople[i].user_id)});
                        SOCKET.emit("end_live_video_call_audience", {
                            host_id: Number(videoCallParams.user_id),
                            user_id: Number(latestConnectedPeople[i].user_id),
                            channel_name: videoCallParams.channel_name,
                            type: 1,
                            is_host: false
                        })
                        SOCKET.emit("audience_left_live_video_call", {
                            name: "",
                            image: null,
                            user_id: Number(latestConnectedPeople[i].user_id),
                            channel_name: videoCallState.channel_name,
                            host_id: Number(videoCallParams.user_id)
                        })
                       }
                       else {
                         console.log(latestConnectedPeople[i].user_id + " audience is safe")
                       }
                }
            }
        }
    }

    useEffect(() => {
        // window.onbeforeunload = function() {
        //     event.preventDefault();
        //     setTimeout(userDidNotLeave,10);
        //     return event.returnValue = "Are you sure you want to exit?";
            
        //     // return "Are you sure you want to leave? changes will be lost";
        // }
        
        // function userDidNotLeave() {
        //     $("body").css("background", "#df34ef");
        // }
    //     window.onbeforeunload = function(event)
    //     {
    //       return !!localStorage.getItem("videoCallPageRefresh") ? confirm("Confirm refresh") : false;
    //   }

    //   window.onunload = (event) => {
    //     alert("page is unloaded...")
    // };

        // $("#wheel").click(function(){
        //     const myWheel = document.getElementById("wheel");
        //     if ()
        //     myWheel.style.pointerEvents = "none";
        // });
        document.getElementById("spinner-outer").style.visibility = "hidden";
        if (!params.channel_name) {
        } else {
            console.log(params, "params......jhfd")
            videoCallParams = {
                user_id: params.user_id,
                channel_id: params.channel_id,
                channel_name: params.channel_name,
                host_socket: params.host_socket,
                channel_token: null
            }
            if (!localStorage.getItem("videoCallPageRefresh")) {
                dispatch(liveVideoCall(videoCallParams))
                // }
                localStorage.setItem("videoCallPageRefresh", "1");
            // check with backend + socket if this channel exist...
            setLoading(true);

              // fetch the client and streamer w.r.t channel name.... once
        SOCKET.emit("get_connected_people_live_video_call_once", {
            channel_name: videoCallParams.channel_name,
            socket_id: localStorage.getItem("socket_id")
        });
          
  
        //   // update the time after 1 sec
  
          updateConnectedPeopleTimeInterval = window.setInterval(() => {
            SOCKET.emit("update_connected_people_live_video_call_time", {
                channel_name: videoCallParams.channel_name,
                user_id: localStorage.getItem("user_id"),
                time: timeCounterLive
            });
          }, 1000)
  
  
        //    // fetch the client and streamer w.r.t channel name.... after 5 sec
  
          connectedPeopleInterval = window.setInterval(() => {
            SOCKET.emit("get_connected_people_live_video_call", {
                channel_name: videoCallParams.channel_name,
                socket_id: localStorage.getItem("socket_id")
            });
        }, 120000)

            SOCKET.emit("authenticate_live_video_call", {
                host_id: Number(videoCallParams.user_id),
                user_id: videoCallState.user_id,
                channel_name: videoCallParams.channel_name,
                type: 1,
                is_host: Number(videoCallParams.user_id) === videoCallState.user_id,
                // videoCallProps: Number(videoCallParams.user_id) === userData.user_id ?
            });
            SOCKET.emit("authenticate_live_video_message", {
                sender_id: Number(videoCallParams.user_id),
                user_id: Number(videoCallState.user_id),
                channel_name: videoCallParams.channel_name
            });

            SOCKET.off('get_audience_connected_live_video_call').on('get_audience_connected_live_video_call', (data) => {
                if (data.channel == videoCallParams.channel_name) {
                    console.log(data.audiences, "data.audiences..")
                    setTotalAudienceJoined(data.audiences)
                }
            })

            SOCKET.off('end_live_video_call_host_warning').on('end_live_video_call_host_warning', (data) => {
                if (data.channel_name == videoCallParams.channel_name) {
                    alert("Live video call is closing soon. Something went wrong...")
                    SOCKET.emit("end_live_video_call_host", {
                        host_id: Number(videoCallParams.user_id),
                        user_id: Number(videoCallParams.user_id),
                        channel_name: videoCallParams.channel_name,
                        type: 1,
                        is_host: true
                    })
                }
            })

            SOCKET.off('end_live_video_call_audience_warning').on('end_live_video_call_audience_warning', (data) => {
                if (data.user_id === videoCallState.user_id && data.channel_name == videoCallParams.channel_name) {
                    if (Number(videoCallParams.user_id) === data.user_id) {
                        // alert("host")

                    }
                    else { // audience..
                        // alert("decline audience with id:"+ data.user_id);
                        alert(data.msg)
                        SOCKET.emit("end_live_video_call_audience", {
                            host_id: Number(videoCallParams.user_id),
                            user_id: Number(data.user_id),
                            channel_name: videoCallParams.channel_name,
                            type: 1,
                            is_host: false
                        })
                    }
                }
            })



            SOCKET.off('live_video_manage_coins_time_views').on('live_video_manage_coins_time_views', (data) => {
                if (data.channel_name === videoCallState.channel_name && videoCallState.user_id == data.user_id) {
                    if (data.msg === "") {
                        setTotalCoinsLeft(data.coins / 2);
                        if (is_first_time_coin_check) {
                            myEntryCoins = data.coins / 2;
                            is_first_time_coin_check = false;
                        }
                    }
                    else {
                        alert(data.msg)
                    }
                }
            })



            SOCKET.off('unauthorize_live_video_call').on('unauthorize_live_video_call', (data) => {
                if (data.is_host) {

                }
                else { // audience..
                    // if (data.user_id === userData.user_id) {
                    //     SOCKET.emit("change_live_video_call_status", {
                    //         host_id: Number(videoCallParams.user_id),
                    //         user_id: userData.user_id,
                    //         channel_name: videoCallParams.channel_name,
                    //         type: 1,
                    //         is_host: Number(videoCallParams.user_id) === userData.user_id,
                    //         status: 4
                    //     });
                    // }
                }
            });

            const liveVideoManageCoinsTimeViews = () => {
                SOCKET.emit("live_video_manage_coins_time_views", {
                    channel_name: videoCallState.channel_name,
                    user_id: videoCallState.user_id,
                    sender_id: videoCallParams.user_id,
                    counter: manageCoinsTimeViewsCounter
                })
            }

            const manageLiveAudienceHostDetails = () => {
                liveVideoManageCoinsTimeViews()
                manageCoinsTimeViewsInterval = window.setInterval(() => {
                    liveVideoManageCoinsTimeViews()
                    manageCoinsTimeViewsCounter = manageCoinsTimeViewsCounter + 10
                }, 10000)
            }

            SOCKET.off('get_connected_people_live_video_call_once').on('get_connected_people_live_video_call_once', (data) => {
                if (data.channel_name == videoCallParams.channel_name) { 
                    // check one-to-one data sync
                  console.log(data, "jsgdjfgsgc")
                  changeConnectedPeople = data.details;
                }
            });

            SOCKET.off('get_connected_people_live_video_call').on('get_connected_people_live_video_call', (data) => {
                if (data.channel_name == videoCallParams.channel_name) {
                     // check one-to-one data sync
                    const hostID = Number(params.user_id);
                //   console.log(changeConnectedPeople, data.details, params.user_id, "htcbfdjvjfm")
                  const latestConnectedPeople = data.details;
                  if (!!changeConnectedPeople && !!latestConnectedPeople) {
                      const hostOldTime = getHostOldTime(changeConnectedPeople, hostID);
                      const hostNewTime = getHostNewTime(latestConnectedPeople, hostID);
                    
                      console.log(hostOldTime, hostNewTime, "time diff")
                  if (hostOldTime != hostNewTime) {
                    console.log("host is safe")
                   // check audience...
                    checkAudienceTime(changeConnectedPeople, latestConnectedPeople);
                  }
                  else {
                    // host has left --- remove the host from deadlock....  (offline and delete token from table)
                //     SOCKET.emit("remove_browser_storage", { "user_id": hostID });
                //     SOCKET.emit("is_user_active", { "user_id": hostID, is_online: 0 });
                //     SOCKET.emit("destroy_socket_connection", { user_id: hostID });
                //     SOCKET.emit("destroy_session", { "user_id": hostID});
                //     window.setTimeout(() => {
                //         SOCKET.emit("end_live_video_call_host", {
                //             host_id: Number(videoCallParams.user_id),
                //             user_id: videoCallState.user_id,
                //             channel_name: videoCallParams.channel_name,
                //             type: 1,
                //             is_host: true
                //         })
                //   }, 250)
                  }
                  changeConnectedPeople = latestConnectedPeople;
                }
              }
              });


            SOCKET.off('authorize_live_video_call').on('authorize_live_video_call', (data) => {
                if (data.user_id === videoCallState.user_id) {
                    if (Number(videoCallParams.user_id) === data.user_id) {
                        timerVar = setInterval(countTimer, 1000);
                        manageLiveAudienceHostDetails()

                        // opnen host camera
                        const option = {
                            appID: "5ea417359e3a431eb385142711de92da",
                            channel: videoCallState.channel_name,
                            uid: 0,
                            token: videoCallState.channel_token,
                            key: '',
                            secret: ''
                        }
                        const volume = true;
                        joinChannel('host', option, volume);
                        setShowEndVideo(true)
                    }
                    else { // audience..
                        timerVar = setInterval(countTimer, 1000);
                        console.log({
                            name: userData.first_name,
                            image: userData.profile_images[0],
                            user_id: userData.user_id,
                            channel_name: videoCallState.channel_name,
                            host_id: Number(videoCallParams.user_id)
                        }, "audddddddddddddddddddddddddd")

                        SOCKET.emit("audience_joined_live_video_call", {
                            name: userData.first_name + " " + userData.last_name,
                            image: userData.profile_images[0],
                            user_id: userData.user_id,
                            channel_name: videoCallState.channel_name,
                            host_id: Number(videoCallParams.user_id)
                        })
                        manageLiveAudienceHostDetails()
                        // open audience camera...
                        const option = {
                            appID: "5ea417359e3a431eb385142711de92da",
                            channel: videoCallState.channel_name,
                            uid: 0,
                            token: videoCallState.channel_token,
                            key: '',
                            secret: ''
                        }
                        const volume = true;
                        joinChannel('audience', option, volume);
                    }
                }
            });

            function animate(elem, style, unit, from, to, time) {
                if (!elem) return;
                var start = new Date().getTime(),
                    timer = setInterval(function () {
                        var step = Math.min(1, (new Date().getTime() - start) / time);
                        elem.style[style] = (from + step * (to - from)) + unit;
                        if (step == 1) clearInterval(timer);
                    }, 25);
                elem.style[style] = from + unit;
            }


            SOCKET.off('audience_joined_live_video_call').on('audience_joined_live_video_call', (data) => {
                if ((userData.user_id == params.user_id) &&  // host
                    (data.channel_name == videoCallState.channel_name)) {
                    // add counter + 1 in viewers...
                    let views = totalViews;
                    views.push({ image: data.image, user_id: data.user_id, name: data.name });
                    setTotalViews(views);
                    toastFlashOptions.icon = '👋';
                    toastFlash(data.name + " has joined the live stream!!", toastFlashOptions)
                    // NotificationManager.info(data.name + " has joined the live stream!!", "", 3000, () => { return 0 }, true);
                }
            })

            SOCKET.off('audience_left_live_video_call').on('audience_left_live_video_call', (data) => {
                if ((userData.user_id == params.user_id) &&  // host
                    (data.channel_name == videoCallState.channel_name)) {
                    // remove counter - 1 in viewers...
                    let views = totalViews;
                    let is_presence = false;
                    let audience_name = "";
                    for (let i in views) {
                        if (views[i].user_id == data.user_id) {
                            is_presence = true;
                            audience_name = views[i].name;
                            views.splice(i, 1)
                        }
                    }
                    setTotalViews(views)
                    if (is_presence) {
                        toastFlashOptions.icon = '🚶';
                        toastFlash(audience_name + " has left the live stream!!", toastFlashOptions)
                    }
                    // NotificationManager.info(data.name + " has left the live stream!!", "", 3000, () => { return 0 }, true);
                }
            })


            SOCKET.off('send_live_video_item').on('send_live_video_item', (message) => {
                let messagesList = messageList;

                if (
                    // message.sender_id == videoCallParams.user_id &&
                    // message.user_id == videoCallState.user_id &&
                    videoCallParams.channel_name == message.channel_name) { //check one-to-one data sync
                    if (!!message.message.message) {
                        if (message.sender_id == videoCallParams.user_id &&
                            message.user_id == videoCallState.user_id) {
                            alert(message.message.message)
                        }
                    }
                    else {
                        if (message.message.chat_type === 0) {

                            console.log(userData, userData.user_id, message.user_id, "kjdhsgbfgjdbghdfgjdfgvdfg")
                            const new_message = {
                                message: message.message.text_message,
                                message_sender_name: message.message.message_sender_name,
                                receiver_id: videoCallState.user_id,
                                user_id: videoCallParams.user_id,
                                report: (videoCallParams.user_id == message.user_id) ? false : true
                            }
                            messagesList.push(new_message);
                            messageList = messagesList;
                            setMessages(messagesList);
                            setRandomNumber(Math.random());
                            scrollToBottom()
                        }
                        if (message.message.chat_type === 1) {
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
                        if (message.message.chat_type === 2) {
                            let count = 0;
                            let heartInterval = window.setInterval(() => {
                                if (count < 5) {

                                    document.getElementById("next").click();
                                    count++;
                                }
                                else {
                                    clearInterval(heartInterval)
                                }
                            }, 500)
                            // animate heart
                        }
                        if (message.message.chat_type === 3) {
                            const gift = {
                                user: message.message.sender_image,
                                gift: "/streamer-app/assets/images/lush.jpg",
                                f_name: message.message.message_sender_name,
                                l_name: "",
                                gift_name: "Lush - (Lovense APP is offline!)",
                                dateTime: new Date()
                            }
                            let newGift = friendGift;
                            newGift.unshift(gift);
                            setFriendGift(newGift);
                            allGifts = newGift;
                            setRandomNumberGift(Math.random());
                        }
                        if (message.message.chat_type === 4) {
                            console.log(message, "sdkfhdfjgdfn,")
                            if (userData.user_id == message.sender_id) {

                                toast.dark("Earned 250 Diamonds from " + message.stripMessage, {
                                    position: "bottom-right",
                                    autoClose: false,
                                    hideProgressBar: true,
                                    closeOnClick: false,
                                    pauseOnHover: false,
                                    draggable: false,
                                    progress: undefined
                                });
                                // NotificationManager.success(message.stripMessage, "", 10000, () => { return 0 }, true);
                            }
                        }
                    }
                }
            });

            SOCKET.off('get_messages_live_video').on('get_messages_live_video', (messages) => { // only one time
                if (messages.sender_id == videoCallParams.user_id &&
                    messages.user_id == videoCallState.user_id &&
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

            SOCKET.off('typing_live_video_message').on('typing_live_video_message', (typing) => { // only one time
                if (videoCallParams.channel_name == typing.channel_name) {
                    if (typing.user_id !== userData.user_id) {
                        setChatTyping(typing.typing_user)
                        window.setTimeout(() => {
                            setChatTyping("")
                        }, 2000)
                    }
                }
            })


            SOCKET.off('tell_live_video_call_spinner_status').on('tell_live_video_call_spinner_status', (data) => { // only one time
                if (videoCallParams.channel_name == data.channel_name) {

                    setPlayWheel(data.spin);
                }
            })

        
        const modal = document.getElementsByClassName("modal-backdrop")[0]
        if (!!modal) {
            modal.remove()
        }
        if (Number(videoCallParams.user_id) == videoCallState.user_id) {
            // sender
            const remoteVideo = document.getElementById("remote_video_");
            if (!!remoteVideo) {
                remoteVideo.remove()
            }
        }
        else {
            // receiver
            const local_stream = document.getElementById("local_stream");
            if (!!local_stream) {
                local_stream.remove()
            }
        }

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

        $("#next").on("click", function () {
            var b = Math.floor((Math.random() * 100) + 1);
            var d = ["flowOne", "flowTwo", "flowThree"];
            var a = ["colOne", "colTwo", "colThree", "colFour", "colFive", "colSix"];
            var c = (Math.random() * (1.6 - 1.2) + 1.2).toFixed(1);
            $('<div class="heart part-' + b + " " + a[Math.floor((Math.random() * 6))] + '" style="font-size:' + Math.floor(Math.random() * (50 - 22) + 22) + 'px;"><i class="fa fa-heart"></i></div>').appendTo(".hearts").css({
                animation: "" + d[Math.floor((Math.random() * 3))] + " " + c + "s linear"
            });
            $(".part-" + b).show();
            setTimeout(function () {
                $(".part-" + b).remove()
            }, c * 900)
        });

        // return () => { SOCKET.removeAllListeners()}
        wheel = new Wheel({
            el: document.getElementById('wheel'),
            data,
            theme: 'dark',
            color: {
                border: 'rgba(189, 125, 13, 1)',
                prize: '#f7d081',
                button: 'rgba(189, 125, 13, 1)',
                line: 'orange',
                prizeFont: 'black',
                buttonFont: 'lightyellow'
            },
            // image: {
            //     turntable: 'turntable.png',
            //     button: 'button.png',
            //     offset: -10
            //   },
            onSuccess(data) {
                setPlayWheel(true);
                // fire event to tell the channel to pause the spinner... to play
                SOCKET.emit("tell_live_video_call_spinner_status", {
                    channel_name: videoCallParams.channel_name,
                    spin: true
                });
                doMyWheelPlaying = false;
                stopTheSpinner(data)
                document.getElementById("spinTheWheel").click();
            },
            radius: 250,
            buttonWidth: 75
        })
    } 
    else {
        setShowWarning(true)
      }

      SOCKET.off('end_live_video_call_host').on('end_live_video_call_host', (data) => {
        if (data.channel_name == videoCallParams.channel_name) {
            // alert("channel is closing....")
            componentWillUnmount();
        }
    })

    SOCKET.off('end_live_video_call_audience').on('end_live_video_call_audience', (data) => {
        if (data.user_id === videoCallState.user_id && data.channel_name == videoCallParams.channel_name) {
            if (Number(videoCallParams.user_id) === data.user_id) {
                // alert("host")

            }
            else { // audience..
                // alert("decline audience with id:"+ data.user_id);
                is_audience_decline = true;
                componentWillUnmount();
            }
        }
    })
    }
    restrictBack()
}, [])

const endForceCall = () => {
    if (Number(videoCallParams.user_id) === videoCallState.user_id) { // host
        leaveEventAudience()
        leaveEventHost()
        SOCKET.emit("end_live_video_call_host", {
            host_id: Number(videoCallParams.user_id),
            user_id: videoCallState.user_id,
            channel_name: videoCallParams.channel_name,
            type: 1,
            is_host: true
        })
    }
    else { // audience
        leaveEventAudience()
        SOCKET.emit("end_live_video_call_audience", {
            host_id: Number(videoCallParams.user_id),
            user_id: videoCallState.user_id,
            channel_name: videoCallParams.channel_name,
            type: 1,
            is_host: false
        })
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

    const endCall = () => {

        if (Number(videoCallParams.user_id) === videoCallState.user_id) { // host
            audienceInterval = window.setInterval(() => {
                console.log("skdjhfjskgbf")
                SOCKET.emit("get_audience_connected_live_video_call", {
                    channel_name: videoCallParams.channel_name
                })
            }, 1000)
            myTotalTimeSpent = time;
            setShowGainedCoin(true)
        }
        else { // audience
            leaveEventAudience();
            SOCKET.emit("end_live_video_call_audience", {
                host_id: Number(videoCallParams.user_id),
                user_id: videoCallState.user_id,
                channel_name: videoCallParams.channel_name,
                type: 1,
                is_host: false
            })
        }
    }

    useEffect(() => {
        scrollToBottom();
    }, [randomNumber])

    useEffect(() => {
        scrollToTop();
    }, [randomNumberGift])

    const CheckTextInputIsEmptyOrNot = (e) => {
        e.preventDefault()
        if (UserMessage != '') {
            var message = {
                "firstName": userData.first_name,
                "lastName": userData.last_name,
                "user_id": Number(videoCallState.user_id),
                "text_message": UserMessage,
                "channel_name": videoCallParams.channel_name,
                "sender_id": Number(videoCallParams.user_id),
                "type": 0,
                "gift_id": null,
                "is_send_heart": 0,
                "coins": 0,
                "message_sender_name": userData.first_name + " " + userData.last_name,
                "lovesense": false,
                "spinner": false
            }
            SOCKET.emit("send_live_video_item", message);
            setuserMessage(''); //Empty user input here
        } else {
        }
    }

    const changeInput = (e) => {
        setuserMessage(e.target.value)
        SOCKET.emit("typing_live_video_message", {
            user_id: videoCallState.user_id,
            typing_user: userData.first_name + " " + userData.last_name,
            channel_name: videoCallParams.channel_name
        })
    }

    const sendHeart = () => {
        var message = {
            "user_id": Number(videoCallState.user_id),
            "text_message": "",
            "channel_name": videoCallParams.channel_name,
            "sender_id": Number(videoCallParams.user_id),
            "type": 2,
            "gift_id": null,
            "is_send_heart": 1,
            "coins": 0,
            "message_sender_name": userData.first_name + " " + userData.last_name,
            "lovesense": false,
            "spinner": false
        }
        SOCKET.emit("send_live_video_item", message);
    }

    const stripperActionOnSpinner = (stripMessage) => {
        toast.dark(stripMessage, {
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined
        });
        var obj_data = {
            "user_id": Number(videoCallState.user_id),
            "text_message": "",
            "channel_name": videoCallParams.channel_name,
            "sender_id": Number(videoCallParams.user_id),
            "type": 4, // spinner
            "gift_id": null,
            "is_send_heart": 0,
            "coins": 0,
            "lovesense": false,
            "spinner": true,
            "stripMessage": stripMessage,
            "message_sender_name": userData.first_name + " " + userData.last_name,
            "sender_image": userData.profile_images.length > 0 ? userData.profile_images[0] : ""
        }
        SOCKET.emit("send_live_video_item", obj_data);
    }

    const lovesenseSend = () => {
        var obj_data = {
            "user_id": Number(videoCallState.user_id),
            "text_message": "",
            "channel_name": videoCallParams.channel_name,
            "sender_id": Number(videoCallParams.user_id),
            "type": 3, // lovesense
            "gift_id": null,
            "is_send_heart": 0,
            "coins": 0,
            "lovesense": true,
            "message_sender_name": userData.first_name + " " + userData.last_name,
            "sender_image": userData.profile_images.length > 0 ? userData.profile_images[0] : ""
        }
        SOCKET.emit("send_live_video_item", obj_data);
    }


    const lovesenseHer = async () => {
        const bodyParameters = { session_id: localStorage.getItem("session_id"), to_user_id: Number(videoCallParams.user_id) }
        const { data: { message, status, error } } = await axios.post(TARGET_DEVICE_API, bodyParameters)
        if (status == 200 && !error) {
            lovesenseSend()
        }
        else {
            if (message == "Lovense APP is offline!") {
                lovesenseSend()
            }
            else {
                alert(!!message ? message : "Something went wrong!!")
            }
        }
    }

    //all gift
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


    const closeMyCoinGained = () => {
        leaveEventAudience()
        leaveEventHost()
        SOCKET.emit("end_live_video_call_host", {
            host_id: Number(videoCallParams.user_id),
            user_id: videoCallState.user_id,
            channel_name: videoCallParams.channel_name,
            type: 1,
            is_host: true
        })
    }

    //get single  gift item
    const getGiftItem = async (giftId) => {
        var message = {
            "user_id": Number(videoCallState.user_id),
            "text_message": "",
            "channel_name": videoCallParams.channel_name,
            "sender_id": Number(videoCallParams.user_id),
            "type": 1,
            "gift_id": giftId,
            "is_send_heart": 0,
            "coins": 0,
            "message_sender_name": userData.first_name + " " + userData.last_name,
            "lovesense": false,
            "spinner": false
        }

        SOCKET.emit('send_live_video_item', message);
        setGivenGift('');
        //  setLoading(true);
        toggleIsOn(false);
    }

    const handleReport = () => {
        let userId = showReport.id

        setIsLoading(true);
        if (!!form.report) {

            const bodyParameters = {
                session_id: localStorage.getItem('session_id'),
                to_user_id: userId,
                message: form.report,
                type: 3
            }
            axios.post(STREAMER_REPORT_API, bodyParameters)
                .then((response) => {

                    if (response.status == 200 && response.data.error == false) {
                        NotificationManager.success("report send successfully", "", 3000, () => { return 0 }, true);
                        //   setSmShow(false);
                        setIsLoading(false);
                    }
                    else {
                        setIsLoading(false);
                        NotificationManager.error(response.data.error_message, "", 1500, () => { return 0 }, true);
                    }
                    setShowReport({ model: false, id: null });
                }, (error) => {
                    setShowReport({ model: false, id: null });
                    setIsLoading(false);
                    NotificationManager.error(error.message, "", 2000, () => { return 0 }, true);
                });
        }
    };

    useEffect(() => {
        //   Listing gift here
        SOCKET.off('gift_send').on('gift_send', (messages) => {
            setGivenGift(messages.obj.media)
        });
    }, [])

    if (!!givenGift) {
    }

    const handleSpinClick = () => {
        const newPrizeNumber = Math.floor(Math.random() * data.length)
        setPrizeNumber(newPrizeNumber)
        setMustSpin(true)
    }

    const stopTheSpinner = async (luck) => {
        console.log(luck, "luck.......")
        setMustSpin(false)
        const bodyParameters = { session_id: localStorage.getItem("session_id"), host_id: Number(videoCallParams.user_id), channel_name: videoCallParams.channel_name }
        const { data: { message, status_code, error } } = await axios.post(SPINNER_API, bodyParameters)
        console.log(status, error, "dfkjghdjkfgfjg")
        if (status_code == 200 && error == false) {
            const stripMessage = luck.desc;
            stripperActionOnSpinner(stripMessage);
        }
        else {
            alert(!!message ? message : "Something went wrong!!")
        }
    }

    const spinTheWheel = () => {
        spinChange = !spinChange;
        const spinnerOuter = document.getElementById("spinner-outer");
        spinnerOuter.style.visibility = spinnerOuter.style.visibility == "hidden" ? "visible" : "hidden";
        // fire event to tell the channel to pause the spinner... to play
        if (spinChange) {
            SOCKET.emit("tell_live_video_call_spinner_status", {
                channel_name: videoCallParams.channel_name,
                spin: false
            });
            doMyWheelPlaying = true;
        }
        setSpin(spinChange);
    }

    return (
        <section className="home-wrapper">
            {/* <div class="hearts"></div> */}
            <img className="bg-mask" src="/streamer-app/assets/images/mask-bg.png" alt="Mask" />
            <div className="header-bar" style={{ zIndex: 99999 }}>
            {
                    (!!userData && userData.user_id != params.user_id && playWheel) &&
                    <button className="btn bg-grd-clr spin-wheel-class" id="spinTheWheel" onClick={spinTheWheel}><i class="fas fa-fan"></i></button>
                }
                {/* {
                    (!!userData && userData.user_id != params.user_id && playWheel) &&
                    <button className="btn bg-grd-clr spin-wheel-class" onClick={spinTheWheel}>Spin</button>
                } */}
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
                                            <img onError={(e) => addDefaultSrc(e)} src={!!user ? user.profile_images[0] : returnDefaultImage()} alt="Augusta Castro" />
                                        </figure>
                                        {
                                            !!user &&
                                            <div className="name ml-2">
                                                {user.first_name}
                                                <span className="age"> {user.age}</span>
                                                <span className="d-block small">{totalTimeLeft}</span>
                                                {
                                                    (!!userData && userData.user_id == params.user_id) &&
                                                    <span className="small">
                                                        <img src="/streamer-app/assets/images/eye-icon.png" /> {totalViews.length}</span>
                                                }

                                            </div>

                                        }
                                        {
                                            !user &&
                                            <div className="name ml-2">

                                                <span className="age"> </span>
                                                <span className="d-block small"> </span>
                                                {
                                                    (!!userData && userData.user_id == params.user_id) &&
                                                    <span className="small">
                                                        <img src="/streamer-app/assets/images/eye-icon.png" /> </span>
                                                }

                                            </div>

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
                            <div className="video-live tab-top d-flex flex-wrap-wrap align-items-center">
                                <div className="vc-action-tab ml-auto mr-4 position-relative">
                                    <div className="vc-action-btn" onClick={actionButton}>
                                        <span />
                                        <span />
                                        <span />
                                    </div>
                                    <ul className="action-menu" id="actionBtn">

                                        <li>
                                            <a href="javascript:void(0)">Block</a>
                                        </li>
                                        {/* <li>
                                            {
                                                (showEndVideo || (!!userData && userData.user_id != params.user_id)) &&
                                                <a href="javascript:void(0)" onClick={endCall}>End Video</a>
                                            }
                                        </li> */}
                                    </ul>
                                    {
                                                (showEndVideo || (!!userData && userData.user_id != params.user_id)) &&
                                    <a href="javascript:void(0)" className="end-calls btn bg-grd-clr" onClick={endCall}>End Video</a>
                                    }
                                </div>
                                <NavLinks />

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="vc-screen-wrapper image-auto video-live">

                <div className="users-listing join-user">
                    {
                        (totalViews.length > 0) &&
                        <button className="btn bg-grd-clr" onClick={() => setShowAudiences(true)} style={{ cursor: "pointer" }} ><i class="fas fa-users"></i></button>
                    }

                    <div className="status__slider">
                        <OwlCarousel options={option}>
                            {totalViews.map((item, i) => (
                                <div className="users-listing__slider__items">
                                    <div className="users-listing__slider__items__image" id="modal" data-toggle="modal">
                                        <img onError={(e) => addDefaultSrc(e)} src={!!item.image ? item.image : returnDefaultImage()} alt="marlene" /> : ""
                                    </div>
                                </div>
                            ))}
                        </OwlCarousel>
                    </div>
                </div>
                <div className="vc-screen d-flex h-100">

                    <div className="spinner-onkar" id="spinner-outer">
                        {

                            <>
                                <svg id="wheel"></svg>
                                {/* <Wheel
                                    mustStartSpinning={mustSpin}
                                    prizeNumber={prizeNumber}
                                    data={data}
                                    backgroundColors={['rgba(189, 125, 13, 1)', 'rgba(189, 125, 13, 1)']}
                                    textColors={['#ffffff']}
                                    innerBorderWidth={10}
                                    outerBorderColor="rgba(189, 125, 13, 1)"
                                    innerBorderColor="rgba(189, 125, 13, 1)"
                                    radiusLineColor="rgba(189, 125, 13, 1)"
                                    radiusLineWidth={1}
                                    outerBorderWidth={10}
                                    fontSize={15}
                                    innerRadius={2}
                                    textDistance={60}
                                    onStopSpinning={(e) => { stopTheSpinner(e) }}
                                /> */}
                                <button className="btn bg-grd-clr" style={{ cursor: "default" }} >500 Coins per spin</button>
                            </>
                        }
                    </div>
                    <div className="col-md-9 p-0">
                        <div id="local_stream" className="local_stream" style={{ width: "400px", height: "400px" }}></div>
                        <div
                            id="remote_video_"
                            className="video_live"
                            style={{ width: "400px", height: "400px" }}
                        />
                        {/* <img src="/streamer-app/assets/images/video-chat-bg.jpg" alt="Video Calling"/> */}
                        <div class="gift-sender" id="giftSender">
                            {
                                friendGift.map((item, index) => (
                                    <div className="gifter" id={item.gift}>
                                        <img src={item.user} alt="gifter" />
                                        <div className="gifter__info">
                                            <h6>{item.f_name + " " + item.l_name}</h6>
                                            <span className={item.gift_name.match("Lush") ? "lush-class" : ""}>Sent a {item.gift_name}</span>
                                        </div>
                                        <div className="gifter__media">
                                            <img style={{ borderRadius: "25px" }} src={item.gift} alt="gift" />
                                        </div>
                                    </div>
                                ))

                            }

                        </div>
                        {/* {
                            (!!userData && userData.user_id != params.user_id) &&
                            <div className="charges-reminder-txt">
                                <p>After 25 Seconds, you will be charged 120 coins per minute</p>
                            </div>
                        } */}
                        <div className="vc-timer-box text-center">
                            <div className="timer">
                                <i className="far fa-clock"></i>
                                <span>{time}</span>
                            </div>
                            {/* <div className="vc-sppiner">
                                <a className="sppiner bg-grd-clr" href="javascript:void(0)">
                                    <img src="/streamer-app/assets/images/sppiner.png" alt="Sppiner" />
                                </a>
                            </div> */}
                        </div>
                        <div className="vc-option-block d-flex flex-wrap align-items-end" style={{ right: "15px" }}>
                            <div className="vc-options">
                                <ul>
                                    {/* <li>
                                        <a className="btn-round bg-grd-clr" href="javascript:void(0)">
                                            <img src="/streamer-app/assets/images/magic-stick.png" alt="Magic" />
                                        </a>
                                    </li>
                                    <li>
                                        <a className="btn-round bg-grd-clr" href="javascript:void(0)">
                                            <img src="/streamer-app/assets/images/chat.png" alt="Chat" />
                                        </a>
                                    </li> */}
                                    {
                                        (!!userData && userData.user_id != params.user_id) &&
                                        <li>
                                            <a className="btn-round bg-grd-clr" href="javascript:void(0)" onClick={handleGift}>
                                                <img src="/streamer-app/assets/images/gift.png" alt="Gift" />
                                            </a>
                                        </li>
                                    }

                                    <li style={{ display: "none" }}>
                                        <a id="next" className="btn btn-nxt bg-grd-clr" href="javascript:void(0)">Next</a>
                                    </li>
                                    {
                                        <li className="send-heart">
                                            <div class="hearts" style={{ left: (!!userData && userData.user_id != params.user_id) ? "0px" : "-50px", zIndex: 999999 }}></div>
                                            {
                                                (!!userData && userData.user_id != params.user_id) &&
                                                <a className="btn-round bg-grd-clr" style={{ zIndex: 999999 }} href="javascript:void(0)" id="heart" onClick={sendHeart}><i class="fa fa-heart"></i></a>
                                            }
                                        </li>
                                    }
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

                                            //    data.user_id != params.user_id &&



                                            <>
                                                <span class="comment_username">{data.message_sender_name} :</span> {data.message}
                                                {
                                                    (data.report && (!!userData && userData.user_id == params.user_id)) &&
                                                    <div className="reportMe" title="report" style={{ cursor: "pointer" }} onClick={() => handleOpenReport(data.user_id)}> <i class="far fa-flag"></i></div>
                                                }

                                                <br />

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
                                            <div className="msg-type"><b>{chatTyping}</b> is typing...</div>
                                        }
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className={isOn ? 'video-streaming-gift all-gifts-wrapper active' : 'all-gifts-wrapper video-streaming-gift'} >
                    <div className="all-gift-inner">
                        <a href="javascript:void(0)" style={{ zIndex: 999999 }} className="close-gift-btn modal-close" onClick={toggleIsOn}><img src="/streamer-app/assets/images/btn_close.png" /></a>
                        <div className="all-gift-header d-flex flex-wrap align-items-center mb-3">
                            <h5 className="mb-0 mr-4">Send Gift</h5>
                            <div className="remaining-coins">
                                <img src="/streamer-app/assets/images/diamond-coin.png" alt="Coins" />
                                <span> {totalCoinsLeft !== null && totalCoinsLeft}</span>
                                <img className="lush" src="/streamer-app/assets/images/lush.jpg" onClick={lovesenseHer} />
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
                <span>It's recommended to not refresh the page when the video streaming is going on otherwise it may break the functionalities. If you want to end the video please click the "End Video" button.</span>
                <br/>
                <button className="btn bg-grd-clr" onClick={() => setShowWarning(false)}style={{ cursor: "pointer" }}>Got It</button>
                {/* <a href="javascript:void(0)" className="modal-close" onClick={() => setShowWarning(false)}><img src="/streamer-app/assets/images/btn_close.png" /></a> */}
            </Modal>

            <Modal className="coin-gained-modal" show={showGainedCoins} onHide={() => setShowGainedCoin(false)} backdrop="static" keyboard={false}>
                <div className="edit-profile-modal__inner">
                    <h4 className="theme-txt text-center mb-4 ">Diamonds Earned: {totalCoinsLeft - myEntryCoins}</h4>
                    <h4 className="theme-txt text-center mb-4 ">Clients Joined: {totalAudienceJoined}</h4>
                    <h4 className="theme-txt text-center mb-4 ">Call Time: {time.split(":")[0] + "hr " + time.split(":")[1] + "min " + time.split(":")[2] + "sec "}</h4>
                </div>
                <button className="btn bg-grd-clr" style={{ cursor: "pointer" }} onClick={closeMyCoinGained}>End Video</button>
                <a href="javascript:void(0)" className="modal-close" onClick={() => setShowGainedCoin(false)}><img src="/streamer-app/assets/images/btn_close.png" /></a>
            </Modal>


            <Modal className="blacklist-modal" show={showAudiences} onHide={() => setShowAudiences(false)} backdrop="static" keyboard={false}>
                <div className="edit-profile-modal__inner">
                    <h4 className="theme-txt text-center mb-4">Clients Watching</h4>
                    <div className="audiences-outer">

                    <Scrollbars style={{ height: 250 }}>
                        {!!totalViews && totalViews.map((item, i) => {
                            return <div className="coin-spend">
                                <div className="coin-spend__host">
                                    <img onError={(e) => addDefaultSrc(e)} src={!!item.image ? item.image : returnDefaultImage()} alt="host" />
                                </div>
                                <div className="coins-spend__hostname">
                                    <span>{item.name}</span>
                                </div>
                            </div>
                        })}
                        </Scrollbars>
                    </div>
                </div>

                <a href="javascript:void(0)" className="modal-close" onClick={() => setShowAudiences(false)}><img src="/streamer-app/assets/images/btn_close.png" /></a>

            </Modal>




            <Modal className="report-modal" show={showReport.model} onHide={closeReport} backdrop="static" keyboard={false}>
                <div className="edit-profile-modal__inner">
                    <form>
                        <div className="choose-report d-flex flex-wrap">
                            {
                                reportList.map((data, index) => (
                                    <div className="form-group">
                                        <input type="radio" name="report" value={data.title} id={"option-" + index} onChange={handleChange} checked={form.report == data.title ? "checked" : ""} />
                                        <label for={"option-" + index}></label>
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
export default LiveVideoChat;