import React, { useState, useEffect, useRef } from "react";
import $ from 'jquery';
import { useSelector, useDispatch } from 'react-redux';
import axios from "axios";
import NavLinks from '../components/Nav';
import { GIFT_LIST_API, GIFT_PURCHASE_API, LIKED_LIST, VISITOR_LIST_API, FRIENDLIST_API, GET_USERPROFILE_API, VIDEOCALL_API, ACCEPT_REQUEST_API, PAID_MEDIA_CHAT, UPLOAD_VIDEO_API } from '../components/Api';
import { SOCKET } from '../components/Config';
import { v4 as uuidv4 } from 'uuid';
import { css } from "@emotion/core";
import { BarLoader, SyncLoader } from "react-spinners";
import Logo from '../components/Logo';
import { selectUser, userProfile, videoCall, audioCall, userRandomMessage, randomMessageMe } from "../features/userSlice";
import { NotificationManager } from 'react-notifications';
import useToggle, { detectMob, isMobile, removeDublicateFrds } from '../components/CommonFunction';
import { useHistory } from "react-router-dom";
import { addDefaultSrc, checkLoginRole, getCurrentDateTime, openNewWindow, restrictBack, returnDefaultImage, useForceUpdate } from "../commonFunctions";
import { setWeekYear } from "date-fns";
import { Modal } from 'react-bootstrap';
import { checkIfIamBusy } from "../api/videoApi";
import { Scrollbars } from 'react-custom-scrollbars';
import { audioToneStart } from "../blobs";

let checkLastFrdsMsgInterval, my_friends_list = [],
    medias_temp = [], new_page = 1;

// import stringLimit from '../components/CommonFunction';

const override = css`
  display: block;
  margin: 10px auto;
  border-radius: 50px !important;
  width: 95%;
`;

const removeDublicateMsg = (chatList) => {
    chatList.forEach((data_outer, i) => {
        let count = 0;
        chatList.forEach((data_inner, j) => {
            if (data_inner.message_id == data_outer.message_id) {
                count += 1;
                if (count > 1) {
                    chatList.splice(j, 1)
                }
            }
        })
    })
    return chatList
}


let messageList = [], receiver_id, userData, myInterval, myFriendUserId = "";
let allBaseImages = [], scrollPage = 1, intervalss;
const scrollToBottom = () => {
    var div = document.getElementById('message-body');
    if (!!div)
    div.childNodes[0].scroll({ top: div.childNodes[0].scrollHeight, behavior: 'smooth' });
}

var frdMesageStatus = {
    friend_id: "",
    online: { read: false, unread: false, reciever_id: "" },
    offline: false
};


const ChatBox = (props) => {
    const forceUpdate = useForceUpdate();
    const inputFile = useRef(null);
    const videoFileEl = useRef()
    const dispatch = useDispatch();
    const history = useHistory()
    // window.setTimeout()
    const [Likes, setLikes] = useState([]);
    const [Visitors, setVisitors] = useState([]);
    const [FriendList, setFriendlist] = useState([]);
    const [FriendUserId, setFriendId] = useState('');
    const [AllData, setData] = useState('');
    const [CompleteMessageList, setMessages] = useState([]);
    const [UserMessage, setuserMessage] = useState('');
    const [randomNumber, setRandomNumber] = useState('');
    const [lastMessageRandomNumber, setLastMessageRandomNumberRandomNumber] = useState('');
    const [isOn, toggleIsOn] = useToggle();
    const [uploadImage, setUploadImage] = useState('');
    const [GiftData, setGiftData] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [myFiles, setMyFiles] = useState([]);
    const [myUrls, setUrls] = useState([]);
    const [baseMultipleImage, setbase64] = useState([]);
    const [video, setVideo] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videoFileLoading, setVideoFileLoading] = useState(false);

    let [loading, setLoading] = useState(false);
    const [recording, setRecording] = useState(false);
    const [dummyMediaRc, setDummyMediaRc] = useState(null)
    const [chatTyping, setChatTyping] = useState("");
    const [threeMessageWarning, setWarningMessage] = useState("");
    const [imageFullSize, setImageFull] = useState({ open: false, media: null });

    const [selectedMedia, setSelectedMedia] = useState(null);
    const [medias, setMedias] = useState([]);
    const [openVideo, setOpenVideo] = useState(false)
    const [coins, setCoins] = useState([])

    const [videocoins, setVideoCoins] = useState(0)

    const [pageNumber, changePageNumber] = useState("");

    const [purchaseItem, showPurchaseItem] = useState({ purchase: false, message_id: "", coins: 0 });

    const [scroll, changeScroll] = useState(true);

    const [is_online, changeIsOnline] = useState(false);

    const [messagePage, setMessagePage] = useState(1)
    const [pageScrool, setPageScrool] = useState(true)

    const [audioTime, setAudioTime] = useState(null);
    new_page = pageNumber;
    console.log(coins, "coins.,s.d,fhshdbds");
    // console.log(medias, "medias...... props....")
    console.log(medias_temp, "medias_temp.....")

    console.log(medias, "qwefwgdshgdf")
    // const createNotificationCustom = (type) => {

    //     switch (type) {
    //       case 'success':
    //         NotificationManager.success('Send successfull', 'Gift');
    //         break;
    //       case 'error':
    //         NotificationManager.error('Please recharge and try again', 'Insufficient Balance!');
    //         break; 
    //   };
    //   };

    console.log(CompleteMessageList, "CompleteMessageList...")



    console.log(selectedMedia, "selectedMedia....")
    const [GetActivity, setActivity] = useState(2);

    userData = useSelector(userProfile).user.profile; //using redux useSelector here
    const directMessage = useSelector(userProfile).user.randomMessage; //using redux useSelector here

    console.log(directMessage, "directMessage....")

    const sessionId = localStorage.getItem('session_id');

    const bodyParameters = {
        session_id: sessionId,
    };



    console.log(GetActivity, "FriendUserId///")
    // Fetching details of user initial time
    const getAllDetails = async () => {
        const likes = await axios.post(LIKED_LIST, bodyParameters)
        setLikes(removeDublicateFrds(likes.data.data));

        // // Destructing response and getting data part
        // const visitor = await axios.post(VISITOR_LIST_API, bodyParameters)
        // setVisitors(removeDublicateFrds(visitor.data.result));

        const friend = await axios.post(FRIENDLIST_API, bodyParameters)
        const data = friend.data.data;
        let friendList = !!data ? data : [];
        setFriendlist(removeDublicateFrds(friendList));
    }

    // Onclick button, getting LIkes, Visitor and friends list

    const getLikes = async () => {  //Likes here
        setActivity(0);
        clearInterval(intervalss);
        setAudioTime(null)
        setDummyMediaRc(null);
    }

    const getVisitors = async () => {  // Visitors here
        setActivity(1);
        clearInterval(intervalss);
        setAudioTime(null)
        setDummyMediaRc(null);
    }

    const getFriend = async () => { //Friends here
        setActivity(2);
    }

    // fetching friends according to userID
    const getFriendDetails = async () => {
        const bodyParameters = {
            session_id: localStorage.getItem('session_id'),
            user_id: myFriendUserId,
        };
        try {
            const { data: { data } } = await axios.post(GET_USERPROFILE_API, bodyParameters)
            setData(data);
        }
        catch (error) {
            if (error.toString().match("403")) {

                localStorage.clear();
                history.push('/login');
            }
        }
    }
    // // onclick profile image open single profile
    // const handleOpenImage = () => {
    //     history.push(`/${myFriendUserId}/single-profile`)
    // }

    const purchaseMedia = async () => {
        // hit api to deduct the coins

        const bodyParameters = { session_id: localStorage.getItem("session_id"), coins: purchaseItem.coins, frd_id: myFriendUserId }
        const { data: { message, status_code, error } } = await axios.post(PAID_MEDIA_CHAT, bodyParameters)
        console.log(status, error, "dfkjghdjkfgfjg")
        if (status_code == 200) {
            showPurchaseItem({ purchase: false, message_id: "", coins: 0 });
            NotificationManager.success(message, "", 2000, () => { return 0 }, true);
            console.log(messageList, "messageList.... nowwww")
            for (let i in messageList) {
                if (messageList[i].message_id == purchaseItem.message_id) {
                    messageList[i].coins = 0;
                }
            }
            CompleteMessageList[messageList]
            changeScroll(false)
            setRandomNumber(Math.random());
            forceUpdate();
            SOCKET.emit('paid_successfull_media', { message_id: purchaseItem.message_id });
        }
        else {
            NotificationManager.error(!!message ? message : "Something went wrong!!");
        }
    }

    const AcceptUserRequest = (LikedUserId) => {

        // const bodyParameters = {
        //     session_id: sessionId,
        //     id: LikedUserId
        // }
        // axios.post(ACCEPT_REQUEST_API, bodyParameters)
        //     .then((response) => {
        //         if (response.status == 200) {
        //             NotificationManager.success(response.data.message, "", 2000, () => { return 0 }, true);
        //             getLikes();
        //         }
        //     }, (error) => {
        //         if (error.toString().match("403")) {
        //             NotificationManager.error("Something went wrong", "", 2000, () => { return 0 }, true);
        //             localStorage.clear();
        //             history.push('/login');
        //         }
        //     });

    }
    // onclick vistior list then open single profile 
    const handleVistior = (userId) => {
        history.push({
            pathname: '/' + userId + '/single-profile',
        })
    }

    const handleLike = (userId) => {
        history.push({
            pathname: '/' + userId + '/single-profile',

        })
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

    //get single  gift item
    const getGiftItem = async (giftId) => {
        const bodyParameters = {
            session_id: localStorage.getItem('session_id'),
            gift_id: giftId,
            given_to: myFriendUserId
        }
        const { data: { giftStatus } } = await axios.post(GIFT_PURCHASE_API, bodyParameters)
        // alert(giftStatus.get_gifts.image);

        if (!!giftStatus) {
            toggleIsOn(false);
            var msg = {};
            msg.file = giftStatus.get_gifts.image;
            msg.fileName = "abc_image";
            msg.sender_id = localStorage.getItem("user_id");
            msg.reciever_id = receiver_id;

            msg.sender_name = userData.first_name + " " + userData.last_name;
            msg.device_token = null;
            msg.created_at = getCurrentDateTime();
            msg.frds_acknowledged = 1;

            msg.message = null;
            msg.message_id = uuidv4();
            msg.messageStatus = frdMesageStatus;
            msg.sender_id = userData.user_id;
            msg.ignore_user_from_id = 1;
            msg.ignore_user_to_id = 1;

            msg.sender_Detail = {
                first_name: userData.first_name,
                age: userData.age,
                user_id: userData.user_id,
                profile_images: userData.profile_images[0],
            }


            SOCKET.emit('gift_send', msg);
            setLoading(true);
        }
        else {
            toggleIsOn(false);
            NotificationManager.error('Please recharge and try again', 'Insufficient Balance!');
        }
    }
    // console.log(myFiles,"myFiles..")
    //  On change getting image files 
    const handleFileChange = e => {
        let multiVideo = false
        // console.log(myFiles,"myFiles...")
        const data = e.target.files[0];
        if (!!data) {
            const fileName = data.name.split(".");
            const imageFormat = fileName[fileName.length - 1];
            if (imageFormat === "png" || imageFormat === "jpg" || imageFormat === "jpeg" || imageFormat === "PNG"
                || imageFormat === "JPG" || imageFormat === "JPEG") {
                const files = [...myFiles];
                files.push(...e.target.files);
                setMyFiles(files);
                setFileUrls(files)

                // Pusing inform with base64
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                    allBaseImages.push(reader.result);
                    setbase64(allBaseImages);
                });
                reader.readAsDataURL(e.target.files[0]);
                if (allBaseImages.length < 3) {
                    document.getElementById("image-media").style.display = "block"
                }
                else {
                    document.getElementById("image-media").style.display = "none"
                }

            }
            else {
                NotificationManager.error("Only .png, .jpg, .jpeg image formats supported.", "", 2000, () => { return 0 }, true);
            }
        }
    };

    const handleVideoChange = e => {
        var data = e.target.files[0];
        if (!!data) {
            const fileName = data.name.split(".");
            const imageFormat = fileName[fileName.length - 1];
            if (imageFormat === "mp4" || imageFormat === "MP4" || imageFormat === "mov" || imageFormat === "MOV") {
                if (data.size < 50000240) {
                    setVideo(data);
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                        setVideoFile(reader.result);
                        const coinElm = document.getElementById("coin-value1");
                        if (coinElm) {
                            coinElm.click();
                        }

                    });
                    reader.readAsDataURL(e.target.files[0]);
                }
                else {

                    NotificationManager.error("maximum upload video limit is 50 mb", "", 2000, () => { return 0 }, true);
                }
            }
            else {
                NotificationManager.error("please , Select the video", "", 2000, () => { return 0 }, true);
            }
        }
    }

    //    Setting urls for displaying here
    const setFileUrls = (files) => {
        const urls = files.map((file) => URL.createObjectURL(file));
        if (myUrls.length > 0) {
            myUrls.forEach((url) => URL.revokeObjectURL(url));
        }
        console.log(urls, "urls....sdgsf")
        setUrls(urls);
        let new_coins = coins;
        new_coins.push(0);
        setCoins(new_coins);
    }


    const sendMediaToSockets = () => {
        let count = 0;
        const imageMedia = document.getElementById("image-media");
        let photoInterval = window.setInterval(() => {

            if (count > baseMultipleImage.length - 1) {
                clearPhotoState()
                clearInterval(photoInterval);

            }
            else {
                console.log(baseMultipleImage[count], "image!!!!");
                var msg = {};
                msg.file = ((baseMultipleImage[count]).split("base64")[1]).slice(1);
                msg.fileName = ((baseMultipleImage[count]).split("base64")[1]).slice(1, 11);
                msg.sender_id = localStorage.getItem("user_id");
                msg.reciever_id = receiver_id;
                msg.coins = coins[count];


                msg.sender_name = userData.first_name + " " + userData.last_name;
                msg.device_token = null;
                msg.created_at = getCurrentDateTime();
                msg.frds_acknowledged = 1;

                msg.message = null;
                msg.message_id = uuidv4();
                msg.messageStatus = frdMesageStatus;
                msg.sender_id = userData.user_id;
                msg.ignore_user_from_id = 1;
                msg.ignore_user_to_id = 1;

                msg.sender_Detail = {
                    first_name: userData.first_name,
                    age: userData.age,
                    user_id: userData.user_id,
                    profile_images: userData.profile_images[0],
                }


                SOCKET.emit('image_file', msg);
                setLoading(true);
                count += 1;
            }
        }, 1000)
    }

    const convertBlobTobase64 = async () => {
        if (!!baseMultipleImage &&
            baseMultipleImage.length > 0) {
            const total_coins_put = coins.reduce((a, b) => a + b);
            // if (total_coins_put == 0) {
            sendMediaToSockets()
            // }
            // else {

            // }
        }
        else {
            NotificationManager.warning("select atlease one image..")
        }
    }

    const mediaClick = (index) => {
        setSelectedMedia(index);
        const fetchPrice = coins[index];
        if (checkLoginRole() == 2) {
            window.setTimeout(() => {
                document.getElementById("coin-value" + fetchPrice).click();
            }, 0)
        }
    }

    const saveThePrice = (price) => {
        let new_coins = coins;
        new_coins.splice(selectedMedia, 1, price);
        setCoins(new_coins)
    }

    // returning in html form to display 
    const displayUploadedFiles = (urls) => {
        console.log(urls, "urls...")
        return urls.map((url, i) => <div className="media-box"> {url.match("/mp4") ? <video src={url} /> : <img onClick={() => { mediaClick(i) }} key={i} src={url} />}</div>);
    }

    const stringLimit = (string, counts) => {
        var text = string;
        var count = counts;
        var result = text.slice(0, count)
        // + (text.length > count ? "*********" : "");
        for (var i = 0; i <= text.length; i++) {
            // text.replace(text.substr(1,text.length-3));
            var result = text.slice(0, count) + (text.length > count ? "*******" : "");
        }
        return result;
    }
    /************************************* Working here socket *******************************************************/

    function readThenSendFile(data) {

        var reader = new FileReader()
        reader.onload = function (evt) {

            //     var msg ={};
            //     msg.file = evt.target.result;
            //     msg.fileName = data.name;
            //     msg.sessionId = sessionId;
            //     msg.reciever_id = receiver_id;
            //     SOCKET.emit('image_file', msg);
            //     setLoading(true);

        };
        reader.readAsDataURL(data);


    }


    // const CheckBase64Type = (media) =>{
    //     const body = {profilepic:media};
    //     let mimeType = body.profilepic.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];

    //     if(mimeType == "image/png")
    //     {
    //         return <img onError={(e) => addDefaultSrc(e)} src={!!media ? media : returnDefaultImage()}/>
    //     }
    //     else
    //     {
    //         return <video id="video_preview" onError={(e) => addDefaultSrc(e)} src={!!media ? media : returnDefaultImage()} width="300" height="300" controls></video>
    //     }

    //     // return mimeType;
    // }

    // Authenicating user here
    const DetermineUser = () => {
        var secondUserDataId = FriendUserId;
        SOCKET.emit("authenticate", {
            session_id: sessionId,
            reciever_id: secondUserDataId,
            user_id: userData.user_id,
            socket_id: localStorage.getItem("socket_id"),
            is_mobile: isMobile()
        });
        // SOCKET.emit('is_user_active', {
        //     "user_id": localStorage.getItem("user_id"),
        //     is_online: 1
        // });
    }
    // Socket Methods
    const CheckTextInputIsEmptyOrNot = (e) => {
        e.preventDefault();

        console.log(frdMesageStatus, "frdMesageStatus......")
        if (UserMessage != '') {
            var secondUserDataId = myFriendUserId;
            var message = {
                "session_id": sessionId,
                "reciever_id": secondUserDataId,
                "message": UserMessage,

                sender_name: userData.first_name + " " + userData.last_name,
                device_token: null,
                created_at: getCurrentDateTime(),
                frds_acknowledged: 1,
                message_id: uuidv4(),
                messageStatus: frdMesageStatus,
                sender_id: userData.user_id,
                ignore_user_from_id: 1,
                ignore_user_to_id: 1,

                sender_Detail: {
                    first_name: userData.first_name,
                    age: userData.age,
                    user_id: userData.user_id,
                    profile_images: userData.profile_images[0],
                }
            }
            SOCKET.emit("send_message", message);
            setuserMessage(''); //Empty user input here
        } else {
        }
    }
    // Get all messages here
    const GetAllMessages = (messages) => {

    }

    const componentWillUnmount = () => {
        clearInterval(checkLastFrdsMsgInterval)

        // SOCKET.emit('is_user_active', { "user_id": localStorage.getItem("user_id"), is_online: 0 });

        //----------new addeed ----------
        SOCKET.emit('message_read_unread_status', { "session_id": sessionId, "receiver_id": FriendUserId, is_read: 0, 'sender_id': userData.user_id });
        SOCKET.emit('send_my_message_status', { 'sender_id': localStorage.getItem("user_id") });
    }

    useEffect(() => {
        if (openVideo) {
            setVideoCoins(0)
        }
    }, [openVideo])

    const handleScroolChat = (response) => {
        if (response.top == 0) {
            
            
                scrollPage = scrollPage + 1;
                setMessagePage(scrollPage)
                // console.log(new_Page, "new_page")
                setPageScrool(false)
                // dispatch(changeMessageDetail({ page: new_Page + 1 }));
                // if (page_scroll) {
                //     // const new_page = page + 1;
                //     // this.setState({page:new_page,
                //     //     is_scroll:false,
                //     //     isLoading: true 
                //     // })
                //     dispatch(changeMessageDetail({ page_scroll: false }))
                //     dispatch(changeMessageDetail({ page: new_Page }))
                //     dispatch(changeMessageDetail({ pagination_loading: true }))
                let get_messages_pagination = {
                    sender_id: userData.user_id,
                    reciever_id: receiver_id,
                    page: scrollPage,
                    is_mobile: isMobile()
                }
                SOCKET.emit('get_messages_pagination', get_messages_pagination)
                console.log(get_messages_pagination, "get_messages_pagination")
                // }
            }

    }

    useEffect(() => {
     
        $(window).scrollTop(0);
        $('#like').on('scroll', function () {
            if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                console.log("scroll likes")
                changePageNumber(new_page + 1)
            }
        })

        $('#visitors').on('scroll', function () {
            if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                console.log("scroll visitors")
                changePageNumber(new_page + 1)
            }
        })

        // $('#chat').on('scroll', function () {
        //     console.log("dkshfjsrdgb", $(this).scrollTop() + $(this).innerHeight(), $(this)[0].scrollHeight)
        //     if (($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
        //         changePageNumber(new_page + 1)
        //     }
        // })
        restrictBack()
        return () => {
            clearInterval(intervalss)
        }
    }, [])
    const handleScroolFriend = (response) => {
        if (response.top == 1) {
            changePageNumber(new_page + 1)
        }
    }
    useEffect(() => {
        if (!!directMessage) {
            setFriendId(directMessage);
            myFriendUserId = directMessage
        }
    }, [directMessage])

    useEffect(() => {
        return () => dispatch(
            randomMessageMe({
                status: false
            })
        );
    }, [])


    const getLikedList = async (page) => {
        const bodyParameters = {
            session_id: sessionId,
            page
        };
        try {
            const { data: { data, status_code, error } } = await axios.post(LIKED_LIST, bodyParameters)
            if (status_code == 200) {
                setLikes(removeDublicateFrds([...Likes, ...data]));
            }
        }
        catch (err) {
            if (err.toString().match("403")) {
                localStorage.clear();
                history.push('/login');
            }
        }
    }

    const setMediaUrl = (media) => {
        if (media.match("https://clickmystar.in/")) {
            return ""
        }

        if (media.match(".mp4")) {
            return "https://clickmystar.in:444/glitter_node/"
        }
        else {
            return "https://clickmystar.in:444/public/images/"
        }
    }

    const getVisitorsList = async (page) => {
        const bodyParameters = {
            session_id: sessionId,
            page
        };
        try {
            const response = await axios.post(VISITOR_LIST_API, bodyParameters)
            let response_data = [...Visitors, ...response.data.result];
            for (let i in response_data) {
                response_data[i]['user_id'] = response_data[i]['id']
            }
            if (response.status == 200 && !response.status.error) {
                setVisitors(removeDublicateFrds(response_data));
            }
        }
        catch (err) {
            if (err.toString().match("403")) {
                localStorage.clear();
                history.push('/login');
            }
        }
    }

    const getChatList = async (page) => {
        const bodyParameters = {
            session_id: sessionId,
            page
        };
        try {
            const { data: { data, status_code, error } } = await axios.post(FRIENDLIST_API, bodyParameters)

            if (status_code == 200) {
                let friendList = !!data ? [...FriendList, ...data] : [];
                let friends_list = [];
                my_friends_list = removeDublicateFrds(friendList)
                for (let i in friendList) {
                    friends_list.push({ user_id: friendList[i].user_id })
                }
                checkLastFrdsMsgInterval = window.setInterval(() => {
                    // if (!!userData && localStorage.getItem("user_id") !== null && localStorage.getItem("user_id") !== undefined && friendList.length > 0) {

                    //     SOCKET.emit("get_frds_last_messages", {
                    //         user_id: localStorage.getItem("user_id"),
                    //         friends_list
                    //     })
                    // }
                }, 1000)
                setFriendlist(my_friends_list);

            }
        }
        catch (err) {
            if (err.toString().match("403")) {
                localStorage.clear();
                history.push('/login');
            }
        }
    }

    useEffect(() => {

        if (!!pageNumber) {
            if (!Number.isInteger(pageNumber)) {
                // change page number to 1
                changePageNumber(1)
            }
            else {
                // hit api's for likes | visitors | chat
                if (GetActivity == 0) {
                    getLikedList(pageNumber);
                }

                if (GetActivity == 1) {
                    getVisitorsList(pageNumber);
                }

                if (GetActivity == 2) {
                    getChatList(pageNumber);
                }
            }
        }
    }, [pageNumber])

    useEffect(() => {
        if (scroll) {
            scrollToBottom();
        }
        else {
            changeScroll(true)
        }
        forceUpdate(); // force re-render
    }, [randomNumber])

    const handleMedia = (data) => {
        console.log(data, "datatdatadtadtadtadtadtadtadtadtadtadtda")
        if (data.coins > 0) {
            showPurchaseItem({ purchase: true, message_id: data.message_id, coins: data.coins })
        }
        else {
            setImageFull((data.media.match("gifts_icons")) ? { open: false, media: null } : {
                open: true, media: (!!data.media ?
                    (
                        data.coins == 50 ?
                            "/streamer-app/assets/images/Coins_50.jpg"
                            :
                            (
                                data.coins == 100 ?
                                    "/streamer-app/assets/images/Coins_100.jpg"
                                    :
                                    (
                                        data.coins == 200 ?
                                            "/streamer-app/assets/images/Coins_200.jpg"
                                            :
                                            (
                                                data.coins == 500 ?
                                                    "/streamer-app/assets/images/Coins_500.jpg"
                                                    :
                                                    (
                                                        data.coins == 2000 ?
                                                            "/streamer-app/assets/images/Coins_2000.jpg"
                                                            :
                                                            (
                                                                data.coins == 5000 ?
                                                                    "/streamer-app/assets/images/Coins_5000.jpg"
                                                                    :
                                                                    setMediaUrl(data.media) + data.media

                                                            )
                                                    )
                                            )
                                    )
                            )
                    ) : returnDefaultImage())
            })
        }
    }

    const checkPaidMedia = (data) => {
        let media = data.media;
        console.log(data, "data.coins...")
        switch (data.coins) {
            case 0:
                media = data.media
            case 50:
                media = "/streamer-app/assets/images/Coins_50.jpg"
            case 100:
                media = "/streamer-app/assets/images/Coins_100.jpg"
            case 250:
                media = "/streamer-app/assets/images/Coins_250.png"
            case 500:
                media = "/streamer-app/assets/images/Coins_500.jpg"

        }
        return media
    }

    useEffect(() => {
        document.getElementById("tab-chat").click()
        // window.setTimeout(() => {
        //     $(document).on('change', '#uploadfile', function(e) {

        //         var data = e.originalEvent.target.files[0]; 
        //         var imageData = e.target.files;
        //         const fileName = data.name.split(".");
        //         const imageFormat = fileName[fileName.length - 1];
        //         if (imageFormat === "png" || imageFormat === "jpg" || imageFormat === "jpeg" ||
        //             imageFormat === "PNG" || imageFormat === "JPG" || imageFormat === "JPEG") {  
        //             readThenSendFile(imageData); 
        //         }

        //         else {
        //             alert("Only .png, .jpg, .jpeg image formats supported.")
        //         }
        //     })
        // }, 1000);
        // getAllDetails();


        SOCKET.off('check_receiver_message_status').on('check_receiver_message_status', function (list) {
            console.log(list, "sdkjghdjf", myFriendUserId,)
            if (list.friend_id == myFriendUserId) {
                if (list.offline) {
                    list.online.read = false;
                    list.online.unread = false;
                    list.online.reciever_id = "";
                }
                else {
                    list.online.read = list.online.reciever_id == localStorage.getItem("user_id") ? true : false;
                    list.online.unread = list.online.reciever_id == localStorage.getItem("user_id") ? false : true;
                }
                frdMesageStatus = list;
                console.log(frdMesageStatus, "frdMesageStatus.......")
                let apiData = messageList;
                if (list.online.read) {
                    for (let i in apiData) {
                        if (!apiData[i].message_is_read) {
                            apiData[i].message_is_read = 1
                            apiData[i].message_is_sent = 0
                            apiData[i].message_is_not_seen = 0
                        }
                    }
                }
                if (list.online.unread) {
                    for (let i in apiData) {
                        if (apiData[i].message_is_sent) {
                            apiData[i].message_is_read = 0
                            apiData[i].message_is_sent = 0
                            apiData[i].message_is_not_seen = 1
                        }
                    }
                }
                // if (list.offline) {
                //     this.setState({is_online:false})
                // }     
                // else {
                //     this.setState({is_online:true})
                // }

                console.log(apiData, "new apidata....")

                messageList = apiData;
                setMessages(messageList);

                // this.setState({ completeMessageList: apiData })
                // this.setState({ counter: Math.random() })
                // this.forceUpdate()
                //}
            }
        });

        SOCKET.off('is_user_active').on('is_user_active', function (data) {
            console.log(data, "is_user_active")
            if (data.user_id == myFriendUserId) {
                // getAllByLabelText(12)
                // dispatch(checkIsOnline({ is_online: !!data.is_online ? true : false }))
                changeIsOnline(!!data.is_online ? true : false)
            }
        });


        SOCKET.off('get_frds_last_messages').on('get_frds_last_messages', (data) => {
            const last_messages = data.friends_list;
            if (!!userData && data.user_id == localStorage.getItem("user_id")) {

                for (let i in my_friends_list) {
                    if (my_friends_list[i].user_id == last_messages[i].user_id) {
                        my_friends_list[i].last_message = last_messages[i].message;
                        my_friends_list[i].last_message_type = last_messages[i].type
                    }
                }
                setFriendlist(my_friends_list)
                setLastMessageRandomNumberRandomNumber(Math.random())
            }
        })

        // Checking the typing user
        SOCKET.off('typing').on('typing', (typing) => {
            if (!!typing) {
                if ((typing.user_id === userData.user_id && typing.reciever_id === receiver_id)
                    ||
                    (typing.user_id === receiver_id && typing.reciever_id === userData.user_id)
                ) { // check one-to-one data sync

                    if (typing.user_id !== userData.user_id) {
                        setChatTyping(typing.typing_user)
                        window.setTimeout(() => {
                            setChatTyping("")
                        }, 2000)
                    }
                }
            }
        })

        SOCKET.off('message_data').on('message_data', (messages) => {
            let messagesList = messageList;
            if (!!messages) {
                if ((messages.obj.user_from_id == userData.user_id && messages.obj.user_to_id == receiver_id)
                    ||
                    (messages.obj.user_from_id == receiver_id && messages.obj.user_to_id == userData.user_id)
                ) { // check one-to-one data sync

                    if (!!messages.obj.warningMessage) {

                        setWarningMessage(messages.obj.warningMessage);
                        //alert(messages.obj.warningMessage)
                    }
                    else {
                        SOCKET.emit('ping_frd_my_unread_message', { "user_id": myFriendUserId, toMe: false });
                        SOCKET.emit('get_unread_frd_messages', {
                            user_id: myFriendUserId,
                            check_user: myFriendUserId,
                            toMe: false
                        });
                        setWarningMessage('');
                        messagesList.push(messages.obj);
                        messageList = messagesList;
                        setMessages(messagesList);
                        setRandomNumber(Math.random());
                        forceUpdate();
                        scrollToBottom()
                    }
                }
            }
        });


        SOCKET.off('image_file').on('image_file', (messages) => {
            let messagesList = messageList;
            if (!!messages) {
                if ((messages.obj.user_from_id === userData.user_id && messages.obj.user_to_id === receiver_id)
                    ||
                    (messages.obj.user_from_id === receiver_id && messages.obj.user_to_id === userData.user_id)
                ) {
                    if (!!messages.obj.warningMessage) {
                        setWarningMessage(messages.obj.warningMessage);
                        //alert(messages.obj.warningMessage)
                        setLoading(false);
                    }
                    else {
                        SOCKET.emit('ping_frd_my_unread_message', { "user_id": myFriendUserId, toMe: false });
                        SOCKET.emit('get_unread_frd_messages', {
                            user_id: myFriendUserId,
                            check_user: myFriendUserId,
                            toMe: false
                        });
                        setWarningMessage('');
                        messagesList.push(messages.obj);
                        messageList = messagesList;
                        setMessages(messagesList);
                        setuserMessage(''); //Empty user input here
                        setLoading(false);
                        setRandomNumber(Math.random());
                        scrollToBottom()
                        console.log(messageList, "messageList...")
                    }
                }
            }
        });

        SOCKET.off('video_file').on('video_file', (messages) => {
            let messagesList = messageList;
            if (!!messages) {
                if ((messages.obj.user_from_id === userData.user_id && messages.obj.user_to_id === receiver_id)
                    ||
                    (messages.obj.user_from_id === receiver_id && messages.obj.user_to_id === userData.user_id)
                ) {
                    if (!!messages.obj.warningMessage) {
                        setWarningMessage(messages.obj.warningMessage);
                        //alert(messages.obj.warningMessage)
                        setLoading(false);
                    }
                    else {
                        SOCKET.emit('ping_frd_my_unread_message', { "user_id": myFriendUserId, toMe: false });
                        SOCKET.emit('get_unread_frd_messages', {
                            user_id: myFriendUserId,
                            check_user: myFriendUserId,
                            toMe: false
                        });
                        setWarningMessage('');
                        messagesList.push(messages.obj);
                        messageList = messagesList;
                        setMessages(messagesList);
                        setuserMessage(''); //Empty user input here
                        setLoading(false);
                        setRandomNumber(Math.random());
                        scrollToBottom()
                        console.log(messageList, "messageList...")

                    }
                }
            }
        });

        SOCKET.off('gift_send').on('gift_send', (messages) => {
            let messagesList = messageList;
            if (!!messages) {
                if ((messages.obj.user_from_id === userData.user_id && messages.obj.user_to_id === receiver_id)
                    ||
                    (messages.obj.user_from_id === receiver_id && messages.obj.user_to_id === userData.user_id)
                ) {
                    if (!!messages.obj.warningMessage) {

                        setWarningMessage(messages.obj.warningMessage);
                        //alert(messages.obj.warningMessage)
                        setLoading(false);
                    }
                    else {
                        SOCKET.emit('ping_frd_my_unread_message', { "user_id": myFriendUserId, toMe: false });
                        SOCKET.emit('get_unread_frd_messages', {
                            user_id: myFriendUserId,
                            check_user: myFriendUserId,
                            toMe: false
                        });
                        setWarningMessage('');
                        messagesList.push(messages.obj);
                        messageList = messagesList;

                        setMessages(messagesList);
                        setLoading(false);
                        setRandomNumber(Math.random());
                        scrollToBottom();
                    }
                }
            }
        });

        SOCKET.off('voice').on('voice', function (arrayBuffer) {
            let messagesList = messageList;
            if (!!arrayBuffer) {
                if ((arrayBuffer.obj.user_from_id === userData.user_id && arrayBuffer.obj.user_to_id === receiver_id)
                    ||
                    (arrayBuffer.obj.user_from_id === receiver_id && arrayBuffer.obj.user_to_id === userData.user_id)
                ) {
                    if (!!arrayBuffer.obj.warningMessage) {
                        setWarningMessage(arrayBuffer.obj.warningMessage);

                    }
                    else {
                        SOCKET.emit('ping_frd_my_unread_message', { "user_id": myFriendUserId, toMe: false });
                        SOCKET.emit('get_unread_frd_messages', {
                            user_id: myFriendUserId,
                            check_user: myFriendUserId,
                            toMe: false
                        });
                        setWarningMessage('');
                        messagesList.push(arrayBuffer.obj);
                        messageList = messagesList;
                        setMessages(messagesList);
                        setuserMessage(''); //Empty user input here
                        setRandomNumber(Math.random());
                        scrollToBottom()
                    }
                }
            }
            // src= window.URL.createObjectURL(blob);

        });

        SOCKET.off('get_messages_pagination').on('get_messages_pagination', function (data) {
            if (data.user_id == userData.user_id) {

                const completeMessageList = messageList;
                const newPageList = data.message_list;
                let newList = [...newPageList, ...completeMessageList];
                newList = removeDublicateMsg(newList);
                setMessages(newList);
                messageList = newList
                var div = document.getElementById('message-body');
                if (!!div)
                div.childNodes[0].scroll({ top: 15, behavior: 'smooth' });
                // dispatch(changeMessageDetail({ pagination_loading: false }))
                // _self.setState({ completeMessageList: newList,
                //     isLoading:false})
            }
        });

        return () => { componentWillUnmount() }

    }, [])

    // On text typing value
    const changeInput = (e) => {
        setuserMessage(e.target.value)
        SOCKET.emit("typing", {
            user_id: userData.user_id,
            typing_user: userData.first_name + " " + userData.last_name,
            reciever_id: receiver_id
        })
    }

    useEffect(() => {
        changePageNumber(Math.random());
        if (GetActivity === 2) {
            // empty array
            setFriendlist([])
        }
        else {
            dispatch(
                randomMessageMe({
                    status: false
                })
            );
            if (GetActivity === 0) {
                // empty array 
                setLikes([])
            }
            if (GetActivity === 1) {
                // empty array
                setVisitors([])
            }
            setFriendId('')
            myFriendUserId = ""
            componentWillUnmount()
            // SOCKET.disconnect();
        }
    }, [GetActivity])

    useEffect(() => {
        if (!!FriendUserId) {
            if (GetActivity === 2) {
                setMessages([]);
                messageList = [];
                getFriendDetails();
                SOCKET.off('getMessage').on('getMessage', (messages) => { // only one time
                    setLoading(false);

                    setMessages(messages.message_list);
                    messageList = messages.message_list;
                });
            }
            console.log(FriendUserId, "ghghghghhghghghghhghg")
            if (!!FriendUserId) {
                // alert("hereeeeeeeeeeeeee")
                for (let i in FriendList) {
                    if (FriendList[i].user_id == FriendUserId) {
                        FriendList[i].count = 0;
                    }
                }
                setFriendlist(FriendList)
                setData('');
                messageList = []
                setMessages([]);
                clearPhotoState()
                receiver_id = myFriendUserId;
                setWarningMessage('');
                DetermineUser();
                console.log({ "reciever_id": myFriendUserId, "sessionId": localStorage.getItem('session_id'), sender_id: localStorage.getItem("user_id") }, "testttt")
                SOCKET.emit('check_receiver_message_status', { "reciever_id": myFriendUserId, "sessionId": localStorage.getItem('session_id'), sender_id: Number(userData.user_id) });

                SOCKET.emit('send_my_message_status', { 'sender_id': localStorage.getItem("user_id"), 'reciever_id': myFriendUserId });

                SOCKET.emit('is_frd_active_in_one_to_one_chat', { frd_id: myFriendUserId })

                setLoading(true);
                //  GetAllMessages();
                //  OnReceivedMessage();

            }
            // get messagesfrom socket...
        }

    }, [FriendUserId])

    var blobToBase64 = function (blob, callback) {
        var reader = new FileReader();
        reader.onload = function () {
            var dataUrl = reader.result;
            var base64 = dataUrl.split(',')[1];
            return callback(base64);
        };
        reader.readAsDataURL(blob);
    };

    useEffect(() => {
    }, [recording])
    const sendVoiceNote = () => {
        if (!dummyMediaRc) {
            document.getElementById("audioTone").play();
            setAudioTime(0)
            intervalss = window.setInterval(() => {
                setAudioTime((audioTime) => audioTime + 1)
            }, 1000);
            var constraints = { audio: true };
            let recordAudio = false;
            if (!!navigator.mediaDevices) {
                navigator.mediaDevices.getUserMedia(constraints).then(function (mediaStream) {
                    recordAudio = true;
                    var mediaRecorder = new MediaRecorder(mediaStream);

                    mediaRecorder.onstart = function (e) {
                        setDummyMediaRc(mediaRecorder);
                        this.chunks = [];
                    };
                    mediaRecorder.ondataavailable = function (e) {
                        this.chunks.push(e.data);
                    };
                    mediaRecorder.onstop = function (e) {
                        var blob = new Blob(this.chunks,);
                        blobToBase64(blob, (output) => {
                            SOCKET.emit('radio', {
                                blob: 'data:audio/mp3;base64,' + output,
                                sessionId,
                                reciever_id: myFriendUserId,

                                sender_name: userData.first_name + " " + userData.last_name,
                                device_token: null,
                                created_at: getCurrentDateTime(),
                                frds_acknowledged: 1,

                                message: null,
                                message_id: uuidv4(),
                                messageStatus: frdMesageStatus,
                                sender_id: userData.user_id,
                                ignore_user_from_id: 1,
                                ignore_user_to_id: 1,

                                sender_Detail: {
                                    first_name: userData.first_name,
                                    age: userData.age,
                                    user_id: userData.user_id,
                                    profile_images: userData.profile_images[0],
                                }
                            });
                        })
                    };

                    // Start recording
                    mediaRecorder.start();
                    
                }).catch(function (err) {
                    NotificationManager.error('err.message', 'Click me!', 5000, () => {

                    });
                    NotificationManager.error(err.message);
                })
            }
            else {
                NotificationManager.info("You need a secure https connection in order to record voice");

            }
        }
        else {
            clearInterval(intervalss);
            setAudioTime(null)
            dummyMediaRc.stop();
            setDummyMediaRc(null);
        }
    }

    useEffect(() => {
        if (audioTime > 20) {
            clearInterval(intervalss);
            setAudioTime(null)
            dummyMediaRc.stop();
            setDummyMediaRc(null);
        }

    }, [audioTime])

    useEffect(() => {
        if (!!pageScrool)
            scrollToBottom()
    }, [CompleteMessageList])

    /*=============================== Video Call ========================================================*/

    const handleVideo = (image) => {
        if (!detectMob()) {
            const handleCallBtn = document.getElementById("handlecall");
            const handleVideoBtn = document.getElementById("handlevideo");
            handleCallBtn.style.pointerEvents = "none";
            handleVideoBtn.style.pointerEvents = "none";
            var secondUserDataId = myFriendUserId;
            const bodyParameters = { session_id: localStorage.getItem("session_id"), to_user_id: secondUserDataId }
            checkIfIamBusy(bodyParameters, (iAmAvailable) => {
                handleCallBtn.style.pointerEvents = "all";
                handleVideoBtn.style.pointerEvents = "all";
                if (iAmAvailable == "recheck") {
                    handleVideo(image)
                }
                else {
                    if (iAmAvailable) {
                        const video_data = {
                            user_from_id: localStorage.getItem("user_id"),
                            user_to_id: secondUserDataId,
                            user_to_image: image,
                            channel_id: uuidv4(),
                            channel_name: null,
                            channel_token: null
                        }
                        localStorage.setItem("video_call", JSON.stringify(video_data))
                        dispatch(
                            videoCall(video_data)
                        );
                        // openNewWindow("/searching-profile")
                        history.push("/searching-profile");
                    }
                }
            })
        }
        else {
            NotificationManager.info(
                "Desktop and Mobile App have much higher success rates of video call and audio call. Please call from the desktop or mobile application", "", 6000, () => { return 0 }, true
            );
        }
    }


    const handleCall = (image) => {
        if (!detectMob()) {
            const handleCallBtn = document.getElementById("handlecall");
            const handleVideoBtn = document.getElementById("handlevideo");
            handleCallBtn.style.pointerEvents = "none";
            handleVideoBtn.style.pointerEvents = "none";
            var secondUserDataId = myFriendUserId;
            const bodyParameters = { session_id: localStorage.getItem("session_id"), to_user_id: secondUserDataId }
            checkIfIamBusy(bodyParameters, (iAmAvailable) => {
                handleCallBtn.style.pointerEvents = "all";
                handleVideoBtn.style.pointerEvents = "all";
                if (iAmAvailable == "recheck") {
                    handleCall(image)
                }
                else {
                    if (iAmAvailable) {
                        const audio_data = {
                            user_from_id: localStorage.getItem("user_id"),
                            user_to_id: secondUserDataId,
                            user_to_image: image,
                            channel_id: uuidv4(),
                            channel_name: null,
                            channel_token: null
                        }
                        localStorage.setItem("audio_call", JSON.stringify(audio_data))
                        dispatch(
                            audioCall(audio_data)
                        );
                        // openNewWindow("/searching-profile-call")
                        history.push("/searching-profile-call");
                    }
                }
            })
        }
        else {
            NotificationManager.info(
                "Desktop and Mobile App have much higher success rates of video call and audio call. Please call from the desktop or mobile application", "", 6000, () => { return 0 }, true
            );
        }
    }


    const openFileHandler = () => {
        if (baseMultipleImage.length < 4) {
            inputFile.current.click();
        }
        else {
            NotificationManager.error("You can upload max 4 images at a time..");
        }
    };

    const clearPhotoState = () => {
        allBaseImages = []
        setbase64([])
        setMyFiles([])
        setUrls([])
        setCoins([])
        setSelectedMedia(null)
        setUploadImage(false);
    }

    const openVideoMessage = (data, type) => {
        var videoPlayer = document.getElementById('videoPlayer');
        console.log(videoPlayer, "videoPlayer...")
        videoPlayer.play();
        if (type == "myMessage") {
            setImageFull((data.media.match("gifts_icons")) ? { open: false, media: null } : {
                open: true, media: (!!data.media ?
                    setMediaUrl(data.media) + data.media
                    : returnDefaultImage())
            })
        }
        else {
            setImageFull((data.media.match("gifts_icons") || data.coins > 0) ? { open: false, media: null } : {
                open: true, media: (!!data.media ?
                    (
                        data.coins == 50 ?
                            "/streamer-app/assets/images/Coins_50.jpg"
                            :
                            (
                                data.coins == 100 ?
                                    "/streamer-app/assets/images/Coins_100.jpg"
                                    :
                                    (
                                        data.coins == 200 ?
                                            "/streamer-app/assets/images/Coins_200.jpg"
                                            :
                                            (
                                                data.coins == 500 ?
                                                    "/streamer-app/assets/images/Coins_500.jpg"
                                                    :
                                                    (
                                                        data.coins == 2000 ?
                                                            "/streamer-app/assets/images/Coins_2000.jpg"
                                                            :
                                                            (
                                                                data.coins == 5000 ?
                                                                    "/streamer-app/assets/images/Coins_5000.jpg"
                                                                    :
                                                                    setMediaUrl(data.media) + data.media

                                                            )
                                                    )
                                            )
                                    )
                            )

                    ) : returnDefaultImage())
            })
        }
    }
    const closeUploadModel = () => {
        setVideo("")
        setVideoFile("")
        setOpenVideo(false)
    }
    const handleSendVideo = () => {
        if (!!videoFile) {
            setVideoFileLoading(true);
            console.log(video, "videFile..")
            const bodyParameters = new FormData();
            bodyParameters.append('file', video);

            axios.post(UPLOAD_VIDEO_API, bodyParameters)
                .then((response) => {
                    setVideoFileLoading(false)
                    if (response.status == 200 && response.data.error == false) {

                        var msg = {};
                        msg.sender_id = localStorage.getItem("user_id");
                        msg.reciever_id = receiver_id;
                        msg.coins = videocoins;
                        msg.video = response.data.detail.path;

                        msg.sender_name = userData.first_name + " " + userData.last_name;
                        msg.device_token = null;
                        msg.created_at = getCurrentDateTime();
                        msg.frds_acknowledged = 1;

                        msg.message = null;
                        msg.message_id = uuidv4();
                        msg.messageStatus = frdMesageStatus;
                        msg.sender_id = userData.user_id;
                        msg.ignore_user_from_id = 1;
                        msg.ignore_user_to_id = 1;

                        msg.sender_Detail = {
                            first_name: userData.first_name,
                            age: userData.age,
                            user_id: userData.user_id,
                            profile_images: userData.profile_images[0],
                        }

                        SOCKET.emit('video_file', msg);

                        setVideoFile(null);
                        setOpenVideo(false)
                    }
                    else {

                        NotificationManager.error(response.data.error_message, "", 1500, () => { return 0 }, true);
                    }
                }, (error) => {
                    setVideoFileLoading(false);
                    NotificationManager.error(error.message, "", 2000, () => { return 0 }, true);
                });
        }
        else {
            NotificationManager.error("No video file selected!!", "", 2000, () => { return 0 }, true);
        }
    }
    const handlePlay = (e) => {
        var audios = document.querySelectorAll("audio");
        audios.forEach(function (Audio) {
            Audio.pause()
        })
        var videos = document.querySelectorAll("video");
        videos.forEach(function (video) {
            if (e.currentTarget.id == video.id) {
                video.play()
            }
            else {
                video.pause()
            }
        })
    }
    const handleUploadVideo = () => {
        clearInterval(intervalss);
        setAudioTime(null)
        setDummyMediaRc(null);
        setOpenVideo(true);
        var videos = document.querySelectorAll("video");
        videos.forEach(function (video) {
            video.pause()
        })
        var audios = document.querySelectorAll("audio");
        audios.forEach(function (Audio) {
            Audio.pause()
        })
    }
    const handlePlayAudio = (e) => {
        var videos = document.querySelectorAll("video");
        videos.forEach(function (video) {
            video.pause()
        })
        var audios = document.querySelectorAll("audio");
        // console.log(audios,e,"jwdwjwd")
        audios.forEach(function (data) {
            if (e.currentTarget.id == data.id) {
                data.play()
            }
            else {
                data.pause()
            }
        })
    }
const handleOpenFriendList = (item) => {
    setFriendId(item.user_id); 
    myFriendUserId = item.user_id; 
    setMessagePage(1); 
    scrollPage = 1; 
    setPageScrool(true) ;
    setAudioTime(null);
    clearInterval(intervalss);
    setDummyMediaRc(null);
}

    return (

        <section className="home-wrapper">
            <img className="bg-mask" src="/streamer-app/assets/images/mask-bg.png" alt="Mask" />
            <div className="header-bar">
                <div className="container-fluid p-0">
                    <div className="row no-gutters align-items-center">
                        <div className="col-lg-3 p-3">
                            <div className="d-flex flex-wrap align-items-center">
                                <div className="logo-tab d-flex justify-content-between align-items-start">
                                    <a href="javascript:void(0)">
                                        <Logo />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 full-width">
                            <div className="rcall-head text-center">
                                <h4>Activity</h4>
                            </div>
                        </div>
                        <div className="col-lg-5 p-3">
                            <div className="tab-top d-flex flex-wrap-wrap align-items-center">


                                <NavLinks />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="chat-box-wrapper">
                <div className="container">
                    <div className="row panel messages-panel">
                        <div className="contacts-list col-md-4 full-width">
                            <ul className="nav inbox-categories d-flex flex-wrap mb-3" role="tablist">
                                <li className="nav-item">
                                    <a id="tab-like" href="#like" className="nav-link active" data-toggle="tab" role="tab" onClick={getLikes} >Like</a>
                                </li>
                                <li className="nav-item">
                                    <a id="tab-visitors" href="#visitors" className="nav-link" data-toggle="tab" role="tab" onClick={getVisitors} >Visitors</a>
                                </li>
                                <li className="nav-item">
                                    <a id="tab-chat" href="#chat" className="nav-link" onClick={getFriend} data-toggle="tab" role="tab">Chat</a>
                                </li>
                            </ul>
                            <div className="tab-content" role="tablist">
                                <div id="like" className="contacts-outter-wrapper tab-pane fade show active" role="tabpanel" aria-labelledby="tab-like">
                                    <div className="contacts-outter">
                                        <ul className="nav contacts" role="tablist">

                                            {Likes.map((item, i) => (
                                                (!!userData &&
                                                    <li className="nav-item  w-100">
                                                        <a className="nav-link" href="#chat-field" data-toggle="tab" data-id={item.like_id} role="tab" onClick={() => handleLike(item.user_id)}>

                                                            <img alt={item.first_name} className="img-circle medium-image" src={item.profile_images[0].replace("/glitterclone/", "/")} />
                                                            <div className="contacts_info">
                                                                <div className="user_detail">
                                                                    <span className="message-time">{item.created_at}</span>
                                                                    <h6 className="mb-0 name">{item.name} .{" " + item.age}</h6>
                                                                    {/* <div className="message-count">2</div> */}
                                                                </div>
                                                                <div className="vcentered info-combo">
                                                                    <p>{item.liked_at}</p>
                                                                </div>
                                                            </div>
                                                        </a>

                                                    </li>

                                                    // :
                                                    // <li className="nav-item w-100">
                                                    //     <a className="nav-link" href="#chat-field" style={{ cursor: "default" }} data-toggle="tab" data-id={item.like_id} role="tab">
                                                    //         <div className="chat__user__img">
                                                    //             <i className="fas fa-lock"></i>
                                                    //             <img alt={item.first_name} className="img-circle medium-image" src={item.profile_images} /></div>
                                                    //         <div className="contacts_info">
                                                    //             <div className="user_detail">
                                                    //                 <span className="message-time">{item.created_at}</span>
                                                    //                 <h6 className="mb-0 name">{stringLimit(item.name, 3) + " "}.{" " + item.age}</h6>
                                                    //                 {/* <div className="message-count">2</div> */}
                                                    //             </div>
                                                    //             <div className="vcentered info-combo">
                                                    //                 <p>{item.liked_at}</p>
                                                    //             </div>
                                                    //         </div>
                                                    //     </a>

                                                    // </li>
                                                )

                                            ))}
                                        </ul>

                                    </div>

                                </div>
                                <div id="visitors" className="contacts-outter-wrapper tab-pane fade" role="tabpanel" aria-labelledby="tab-visitors">
                                    <div className="contacts-outter">
                                        <ul className="nav contacts" role="tablist">
                                            {Visitors.map((item, i) => (
                                                (!!userData &&
                                                    <li className="nav-item w-100">
                                                        <a className="nav-link" href="#chat-field" data-toggle="tab" role="tab" onClick={() => handleVistior(item.id)} >
                                                            <img alt={item.full_name} className="img-circle medium-image" src={item.profile_images.replace("/glitterclone/", "/")} />
                                                            <div className="contacts_info">
                                                                <div className="user_detail">
                                                                    {/* <span className="message-time">{item.created_at}</span> */}
                                                                    <h6 className="mb-0 name">{item.full_name}.{" " + item.age}</h6>
                                                                    {/* {/* <div className="message-count">2</div> */}
                                                                </div>
                                                                <div className="vcentered info-combo">
                                                                    <p>{item.visited_at}</p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </li>
                                                    // :
                                                    // <li className="nav-item w-100">
                                                    //     <a className="nav-link" href="#chat-field" style={{ cursor: "default" }} data-toggle="tab" role="tab" onClick={() => handleLike(item.user_id)}>
                                                    //         <div className="chat__user__img">
                                                    //             <i className="fas fa-lock"></i>
                                                    //             <img alt={item.full_name} className="img-circle medium-image" src={item.profile_images} />
                                                    //         </div>
                                                    //         <div className="contacts_info">
                                                    //             <div className="user_detail">
                                                    //                 {/* <span className="message-time">{item.created_at}</span> */}
                                                    //                 <h6 className="mb-0 name">{item.full_name}.{" " + item.age}</h6>
                                                    //                 {/* {/* <div className="message-count">2</div> */}
                                                    //             </div>
                                                    //             <div className="vcentered info-combo">
                                                    //                 <p>{item.visited_at}</p>
                                                    //             </div>
                                                    //         </div>
                                                    //     </a>
                                                    // </li>
                                                )
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div id="chat" className="contacts-outter-wrapper tab-pane fade" role="tabpanel" aria-labelledby="tab-chat">

                                    <div className="contacts-outter">
                                        <Scrollbars onScrollFrame={handleScroolFriend} style={{ height: 400 }} autoHide >
                                            <ul className="nav contacts" role="tablist">

                                                {FriendList.map((item, i) => {
                                                    return <li className="nav-item w-100">
                                                        <a className="nav-link" href="#chat-field" data-toggle="tab" data-id={item.user_id} role="tab" onClick={() => {handleOpenFriendList(item)}}>

                                                            <img alt="Mia" className="img-circle medium-image" src={item.profile_images.replace("/glitterclone/", "/")} />
                                                            <div className="contacts_info">
                                                                <div className="user_detail">
                                                                    <span className="message-time">{item.created_at}</span>
                                                                    <h6 className="mb-0 name">{item.name}</h6>
                                                                    {
                                                                        !!item.count &&
                                                                        <div className="message-count">{item.count}</div>
                                                                    }

                                                                </div>
                                                                <div className="vcentered info-combo">
                                                                    {
                                                                        item.last_message_type === 0 &&
                                                                        <div className="chat-text">
                                                                            <p>{item.last_message}</p>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        (item.last_message_type === 1 || item.last_message_type === 3) &&
                                                                        <div className="chat-media">
                                                                            <i class="fas fa-image"></i>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        item.last_message_type === 2 &&
                                                                        <div className="chat-audio">
                                                                            <i class="fas fa-music"></i>
                                                                        </div>
                                                                    }

                                                                </div>
                                                            </div>
                                                        </a>
                                                    </li>
                                                })}
                                            </ul>
                                        </Scrollbars>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chat box here */}
                        {GetActivity === 2 ?
                            <div className="col-md-8 tab-content chat-block full-width" role="tablist">
                                {
                                    !directMessage &&
                                    <div className="nothing-to-see text-center active">
                                        <figure>
                                            <img src="/streamer-app/assets/images/message-circle.png" alt="Message" />
                                            <figcaption>Nothing To See</figcaption>
                                        </figure>
                                    </div>
                                }


                                <div className={!!directMessage ? "tab-pane active show" : "tab-pane"} id="chat-field">
                                    <div className="message-top d-flex flex-wrap align-items-center justify-content-between">
                                        {
                                            <div className="chat-header-info d-flex align-items-center">
                                                {!!AllData && !loading ? <img alt="Mia" style={{ cursor: "pointer" }} className="img-circle medium-image" onClick={() => history.push(`/${myFriendUserId}/single-profile`)} src={(AllData.profile_images[0]).replace("/glitterclone/", "/")} /> : ""}
                                                <div className="chat-user-info ml-2">
                                                    {!!AllData && !loading ? <h5 className="mb-0 name">{AllData.first_name}</h5> : <h5>  </h5>}
                                                    <div className="info">
                                                        {!!AllData && !loading &&
                                                            <>{AllData.occupation}{AllData.occupation != "" && AllData.age != "" ? " ," : ""} {AllData.age} </>
                                                        }
                                                        {<>  </>}
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {/* Video call */}
                                        {

                                            <div className="chat-call-opt d-flex">
                                                {
                                                    !loading && <>
                                                        <a className="bg-grd-clr mr-3" id="handlecall" onClick={() => handleCall(AllData.profile_images[0])} href="javascript:void(0)">

                                                            <i className="fas fa-phone-alt" /></a>
                                                        <a className="bg-grd-clr mr-3" id="handlevideo" onClick={() => handleVideo(AllData.profile_images[0])} href="javascript:void(0)">

                                                            <i className="fas fa-video" />

                                                        </a>



                                                        <a style={{ cursor: "pointer" }} className="bg-grd-clr" onClick={() => handleUploadVideo()}>


                                                            <i class="fas fa-upload"></i>


                                                        </a>
                                                    </>
                                                }
                                            </div>
                                        }
                                        {/* <label className="video-share">
                                            <a href="javascript:void(0)" onClick={() => setOpenVideo(true)} >
                                                video
                                            </a>
                                        </label> */}
                                    </div>

                                    {/*<div className="chat-date text-center my-2">Today</div>*/}
                                    <div className="message-chat">
                                    <Scrollbars className="chat-body" id="message-body"  onScrollFrame={handleScroolChat}  autoHide >
                                        {/* <div className="chat-body" id={"chat-body"}> */}
                                            {
                                                CompleteMessageList.map((data, i) => (
                                                    <div>
                                                        {
                                                            (data.user_from_id === myFriendUserId) ?
                                                                <div className="message info">
                                                                    <div className={!!data.media && data.media.match(".mp4") ? "message-body video-added" : (!!data.audio ? "message-body audio-added" : "message-body")}>
                                                                        {
                                                                            !!data.media &&


                                                                            <div className="media-socket">
                                                                                {(data.media.match(".mp4") && data.coins == 0) ?
                                                                                    <>
                                                                                        <video id={"videoPlayer" + data.message_id} onPlay={(e) => handlePlay(e)} src={"https://clickmystar.in:444/glitter_node/" + data.media}
                                                                                            //  onClick={() => openVideoMessage(data, "friendMessage")} 
                                                                                            controls />
                                                                                    </>
                                                                                    :
                                                                                    <img style={{ cursor: (data.media.match("gifts_icons")) ? "default" : "pointer" }} onClick={() => handleMedia(data)}



                                                                                        onError={(e) => addDefaultSrc(e)} src={!!data.media ?
                                                                                            (
                                                                                                data.coins == 50 ?
                                                                                                    "/streamer-app/assets/images/Coins_50.jpg"
                                                                                                    :
                                                                                                    (
                                                                                                        data.coins == 100 ?
                                                                                                            "/streamer-app/assets/images/Coins_100.jpg"
                                                                                                            :
                                                                                                            (
                                                                                                                data.coins == 200 ?
                                                                                                                    "/streamer-app/assets/images/Coins_200.jpg"
                                                                                                                    :
                                                                                                                    (
                                                                                                                        data.coins == 500 ?
                                                                                                                            "/streamer-app/assets/images/Coins_500.jpg"
                                                                                                                            :
                                                                                                                            (
                                                                                                                                data.coins == 2000 ?
                                                                                                                                    "/streamer-app/assets/images/Coins_2000.jpg"
                                                                                                                                    :
                                                                                                                                    (
                                                                                                                                        data.coins == 5000 ?
                                                                                                                                            "/streamer-app/assets/images/Coins_5000.jpg"
                                                                                                                                            :
                                                                                                                                            setMediaUrl(data.media) + data.media

                                                                                                                                    )
                                                                                                                            )
                                                                                                                    )
                                                                                                            )
                                                                                                    )

                                                                                            ) : returnDefaultImage()} />
                                                                                }
                                                                            </div>
                                                                        }


                                                                        {
                                                                            !!data.message &&
                                                                            <div className="message-text">
                                                                                <p>{data.message}</p>
                                                                            </div>
                                                                        }

                                                                        {
                                                                            !!data.audio &&
                                                                            <div className="audio-socket">
                                                                                <audio id={"audioPlayer" + data.message_id} onPlay={(e) => handlePlayAudio(e)} controls src={data.audio} className="audio-left" />
                                                                            </div>
                                                                        }

                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className="message my-message ">
                                                                 <div className={!!data.media && data.media.match(".mp4") ? "message-body video-added" : (!!data.audio ? "message-body audio-added" : "message-body")}>
                                                                        {
                                                                            !!data.media &&
                                                                            <div className="media-socket">
                                                                                {data.media.match("mp4") ?
                                                                                    <video id={"videoPlayer" + data.message_id} onPlay={(e) => handlePlay(e)} onError={(e) => addDefaultSrc(e)} src={!!data.media ?
                                                                                        "https://clickmystar.in:444/glitter_node/" + data.media
                                                                                        : returnDefaultImage()}
                                                                                        // onClick={() => openVideoMessage(data, "myMessage")} 
                                                                                        controls />
                                                                                    :
                                                                                    <img style={{ cursor: (data.media.match("gifts_icons")) ? "default" : "pointer" }} onClick={() => setImageFull((data.media.match("gifts_icons")) ? { open: false, media: null } : {
                                                                                        open: true, media: (!!data.media ?
                                                                                            setMediaUrl(data.media) + data.media
                                                                                            : returnDefaultImage())
                                                                                    })} onError={(e) => addDefaultSrc(e)} src={!!data.media ?
                                                                                        setMediaUrl(data.media) + data.media
                                                                                        : returnDefaultImage()} />
                                                                                }
                                                                            </div>
                                                                        }


                                                                        {
                                                                            !!data.message &&
                                                                            <div className="message-text">
                                                                                <p>{data.message}</p>
                                                                            </div>
                                                                        }
                                                                        {
                                                                            !!data.audio &&
                                                                            <div>
                                                                                <audio id={"audioPlayer" + data.message_id} onPlay={(e) => handlePlayAudio(e)} controls src={data.audio} className="audio-right" />
                                                                            </div>
                                                                        }

                                                                    </div>
                                                                </div>
                                                        }
                                                    </div>
                                                ))
                                            }
                                            {

                                                !!threeMessageWarning &&
                                                <div className="message-text warning-msg" >
                                                    <p>{threeMessageWarning}</p>
                                                </div>
                                            }
                                        {/* </div> */}
                                        </Scrollbars>                                                                                                                            
                                        <form className="position-relative" onSubmit={CheckTextInputIsEmptyOrNot}>
                                            <div className="sweet-loading">
                                                <BarLoader color={"#fcd46f"} loading={loading} css={override} size={1000} />
                                            </div>
                                            <div className="chat-footer">
                                                {uploadImage ?
                                                    <div className="send-photos-modal">
                                                        <a href="javascript:void(0)" className="theme-txt done-media" onClick={convertBlobTobase64}>Done</a>
                                                        <a href="javascript:void(0)" onClick={(() => clearPhotoState())} className="close-image-btn"><span className="close-image-btn "><img src="/streamer-app/assets/images/btn_msg_close.png" /></span></a>
                                                        <h6 className="text-center">Send Photos</h6>

                                                        <div className="send-photos-listing d-flex my-4">
                                                            <div id="image-media" className="media-box add-media">
                                                                <a id="upload__media" href="javascript:void(0)" onClick={openFileHandler}>
                                                                    <img src="/assets/images/add-media.png" alt="add media" />
                                                                    <input id="uploadfile" type="file" className="d-none" ref={inputFile} onChange={handleFileChange} multiple="true" accept="image/* " />
                                                                </a>

                                                            </div>
                                                            {/* Displaying image here */}

                                                            {myUrls.length > 0 &&
                                                                <>
                                                                    {displayUploadedFiles(myUrls)}
                                                                </>
                                                            }

                                                        </div>

                                                        {!!myUrls && myUrls.length > 0 && selectedMedia !== null && checkLoginRole() == 2 ?
                                                            <>
                                                                <h6>Put Price</h6>
                                                                <div className="image-coins d-flex">
                                                                    <div className="coin-price">
                                                                        <input type="radio" id="coin-value0" name="coin" onChange={() => saveThePrice(0)} />
                                                                        <label for="coin-value0">0 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds" /></label>

                                                                    </div>

                                                                    <div className="coin-price">
                                                                        <input type="radio" id="coin-value50" name="coin" onChange={() => saveThePrice(50)} />
                                                                        <label for="coin-value50">25 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds" /></label>

                                                                    </div>

                                                                    <div className="coin-price">
                                                                        <input type="radio" id="coin-value100" name="coin" onChange={() => saveThePrice(100)} />
                                                                        <label for="coin-value100">50 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds" /></label>

                                                                    </div>

                                                                    <div className="coin-price">
                                                                        <input type="radio" id="coin-value500" name="coin" onChange={() => saveThePrice(500)} />
                                                                        <label for="coin-value500">250 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds" /></label>

                                                                    </div>
                                                                </div>

                                                            </>
                                                            :
                                                            <></>
                                                        }
                                                    </div>

                                                    : ""}


                                                <label className="upload-file">
                                                    <div>
                                                        <a href="javascript:void(0)" onClick={() => setUploadImage(!uploadImage)} >
                                                            {/* <input id="uploadfile" type="file" accept=".png, .jpg, .jpeg, .PNG, .JPG, .JPEG" /> */}
                                                            <img src="/assets/images/msg-icon.png" alt="add media" />
                                                            {/* <i className="far fa-image" /> */}
                                                        </a>
                                                    </div>
                                                </label>
                                                {/* <textarea className="send-message-text" placeholder="Message..." defaultValue={UserMessage} /> */}
                                                <input className="send-message-text" autoComplete={false} name="Message" id="Message" type="text" placeholder="Message..." value={UserMessage} onChange={e => changeInput(e)} />
                                                {
                                                    checkLoginRole() == 1 &&
                                                    <label className="gift-message bg-grd-clr">
                                                        <a href="javascript:void(0)" onClick={handleGift} >
                                                            <i className="fas fa-gift" />
                                                        </a>
                                                    </label>
                                                }

                                                {
                                                    audioTime == 0 &&
                                                    <div className="timer chat-chat">

                                                        <span className="min">
                                                            00:
                                                        </span>
                                                        <span className="mili-sec">
                                                            00
                                                        </span>
                                                    </div>}
                                                 
                                                    <audio src={audioToneStart} id="audioTone" ></audio>
                                                {!!audioTime &&
                                                    <div className="timer chat-chat">
                                                        <span className="min">
                                                            00:
                                                        </span>
                                                        <span className="mili-sec">
                                                            {audioTime < 10 ? "0" + audioTime : audioTime}
                                                        </span>
                                                    </div>}
                                                <label className="record-message">

                                                    <a onClick={sendVoiceNote}>
                                                        {
                                                            dummyMediaRc &&
                                                            <i className="fas fa-microphone-slash" />
                                                        }
                                                        {
                                                            !dummyMediaRc &&
                                                            <i className="fas fa-microphone" />
                                                        }
                                                    </a>

                                                </label>


                                                <button type="submit" className="send-message-button bg-grd-clr"><i className="fas fa-paper-plane" /></button>

                                            </div>
                                            {
                                                !!chatTyping &&
                                                <div>{chatTyping} is typing...</div>
                                            }
                                        </form>
                                    </div>

                                </div>

                            </div>
                            : <div className="nothing-to-see text-center active">
                                <figure>
                                    <img src="/streamer-app/assets/images/message-circle.png" alt="Message" />
                                    <figcaption>Nothing To See</figcaption>
                                </figure>
                            </div>}

                        {/* End chat box here */}

                        <Modal className="fullSize-image-modal" show={imageFullSize.open} onHide={() => setImageFull({ open: false, media: null })} backdrop="static" keyboard={false}>
                            {!!imageFullSize.media &&
                                imageFullSize.media.match("mp4") ?
                                <video src={imageFullSize.media} controls /> :
                                <img onError={(e) => addDefaultSrc(e)} src={imageFullSize.media} />
                            }

                            <a href="javascript:void(0)" className="modal-close" onClick={() => setImageFull({ open: false, media: null })}><img src="/streamer-app/assets/images/btn_close.png" /></a>
                        </Modal>

                        <Modal className="fullSize-image-modal text-center" show={purchaseItem.purchase} onHide={() => showPurchaseItem({ purchase: false, message_id: "", coins: 0 })} backdrop="static" keyboard={false}>
                            <h4>Do you want to purchase this item ?</h4>
                            <div className="media-purchase-outer-box d-flex justify-content-center mt-4">
                                <button type="button" className="btn bg-grd-clr purchase mr-3" onClick={purchaseMedia}>Purchase</button>
                                <button type="button" className="btn bg-grd-clr no-purchase" onClick={() => showPurchaseItem({ purchase: false, message_id: "", coins: 0 })}>Cancel</button>
                            </div>

                            <a href="javascript:void(0)" className="modal-close" onClick={() => showPurchaseItem({ purchase: false, message_id: "", coins: 0 })}><img src="/streamer-app/assets/images/btn_close.png" /></a>

                        </Modal>


                        <Modal className="theme-modal" id="upload-media-modal" show={openVideo} onHide={() => setOpenVideo(false)} backdrop="static" keyboard={false}>
                            <form id="glitter_status" >
                                <div className="modal-body p-0">
                                    <div className="upload__status__opt text-center">
                                        <h4 className="theme-txt">Upload Video</h4>
                                        <div className="upload-status d-flex justify-content-center mt-3">

                                            <a className="uploadVideo bg-grd-clr" href="javascript:void(0)" onClick={() => videoFileEl.current.click()}>
                                                <i className="fas fa-video"></i>
                                                <input id="uploadfile" type="file" className="d-none" ref={videoFileEl} onChange={handleVideoChange} multiple="true" accept="video/*" />
                                            </a>

                                        </div>
                                        {!!videoFile ?
                                            <div className="video-preview">
                                                <video id="video-upload" src={videoFile} width="300" height="300" controls></video>
                                            </div> : ""}

                                        {!!videoFile && checkLoginRole() == 2 ?
                                            <>
                                                <h6>Put Price</h6>
                                                <div className="image-coins d-flex">
                                                    <div className="coin-price">
                                                        <input type="radio" id="coin-value1" onChange={() => setVideoCoins(0)} name="coin" value={0} />
                                                        <label for="coin-value1">0 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds" /></label>

                                                    </div>

                                                    <div className="coin-price">
                                                        <input type="radio" id="coin-value2" onChange={() => setVideoCoins(200)} name="coin" value={200} />
                                                        <label for="coin-value2">100 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds" /></label>

                                                    </div>

                                                    <div className="coin-price">
                                                        <input type="radio" id="coin-value3" onChange={() => setVideoCoins(500)} name="coin" value={500} />
                                                        <label for="coin-value3">250 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds" /></label>

                                                    </div>

                                                    <div className="coin-price">
                                                        <input type="radio" id="coin-value4" name="coin" onChange={() => setVideoCoins(2000)} value={2000} />
                                                        <label for="coin-value4">1000 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds" /></label>

                                                    </div>

                                                    <div className="coin-price">
                                                        <input type="radio" id="coin-value5" name="coin" onChange={() => setVideoCoins(5000)} value={5000} />
                                                        <label for="coin-value5">2500 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds" /></label>

                                                    </div>
                                                </div>
                                            </>
                                            : ""}

                                        <button
                                            type="button"
                                            disabled={videoFileLoading ? true : false}
                                            className="status-upload btn bg-grd-clr btn-small mt-4"
                                            onClick={handleSendVideo}> {videoFileLoading ? "Please wait..." : "Send video"}</button>

                                    </div>


                                </div>
                            </form>

                            {/* </div> */}
                            {/* End Modal start here */}
                            <a href="javascript:void(0)" onClick={closeUploadModel} className="modal-close" ><img src="/streamer-app/assets/images/btn_close.png" /></a>
                        </Modal>


                        <div className={isOn ? 'all-gifts-wrapper active' : 'all-gifts-wrapper '} >
                            <div className="all-gift-inner">
                                <a href="javascript:void(0)" className="close-gift-btn modal-close" onClick={toggleIsOn}><img src="/streamer-app/assets/images/btn_close.png" /></a>
                                <div className="all-gift-header d-flex flex-wrap align-items-center mb-3">
                                    <h5 className="mb-0 mr-4">Send Gift</h5>
                                    <div className="remaining-coins">
                                        <img src="/streamer-app/assets/images/diamond-coin.png" alt="Coins" />
                                        <span>152</span>
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
                </div>
            </div>
        </section>
    )
}
export default ChatBox;