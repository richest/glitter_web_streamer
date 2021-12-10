import React, { useState, useEffect, useRef } from "react";
import Stories from 'react-insta-stories';
import $ from 'jquery';
import { useHistory, useLocation } from 'react-router';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import NavLinks from '../components/Nav';
import FilterSide from '../components/Filter';
import { ADD_STATUS, FRIENDLIST_API, GET_STATUS, LIKE_STATUS_API, DETUCT_THOUSAND_COIN, VIEW_STATUS_API } from '../components/Api';
import { Modal } from 'react-bootstrap';
import OwlCarousel from 'react-owl-carousel2';
import { SOCKET } from '../components/Config';
import { useDispatch, useSelector } from "react-redux";
import { userProfile, myLiveLoadingData, myLiveLoading } from "../features/userSlice";
import { checkIfIamBusy, generateLiveVideoChatToken } from "../api/videoApi";
import { addDefaultSrc, checkLoginRole, openNewWindow, restrictBack, returnDefaultImage } from "../commonFunctions";
import useToggle, { removeDublicateFrds } from '../components/CommonFunction';
import { SyncLoader, ClipLoader } from "react-spinners";
import { css } from "@emotion/core";
import { NotificationManager } from 'react-notifications';
import { friendStatus } from '../features/userSlice'
import StatusUser from "../pages/StatusUser";
import { Link } from "react-router-dom";
// import Select from 'react-dropdown-select';
import { getCountries } from '../components/Countries';
import { FacebookIcon, FacebookShareButton } from "react-share";
import { getNameList } from 'country-list'
import Select from 'react-select';

let isMouseClick = false, startingPos = [],
  glitterUid, friendLists = [], userData = null,
  myLiveLoadData = false, checkOnlineFrdsInterval;


let isLikedStatus = false, TLikesStatus = 0, MLikesStatus = 0, new_page = 1;


const override = css`
text-align: center;
width: 95%;
position: absolute;
left: 0;
right: 0;
margin: 0 auto;
top: 50%;
-webkit-transform: translateY(-50%);
-moz-transform: translateY(-50%);
transform: translateY(-50%);

`;

const statusOverride = css`
text-align: center;
width: 20px;
height:20px;
position: absolute;
left: 0;
right: 0;
margin: 0 auto;
top: 30%;
-webkit-transform: translateY(-30%);
-moz-transform: translateY(-30%);
transform: translateY(-30%);
`;

const SearchHome = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const inputFile = useRef(null);
  const inputVideoFile = useRef(null);
  const location = useLocation()
  const [statusModel, setStatusModel] = useState(false);
  const [randomNumber, setRandomNumber] = useState('');
  const [fetchedProfile, setFilterUser] = useState('');
  const [friendList, setFriendlist] = useState([]);
  const [liveFriendList, setLiveFriendList] = useState([]);
  const [isOn, toggleIsOn] = useToggle(false);
  const [statusData, setStatusData] = useState({});
  const [storyData, setStoryData] = useState([]);
  const [friendId, setFriendId] = useState('');
  const [statusId, setStatusId] = useState([]);
  const [statusLength, setStatusLength] = useState("");
  const [showLive, setShowLive] = useState(false);
  const [showPencil, setShowPencil] = useState(false);
  // const [pencilData, setPencilData] = useState('')
  const [picture, setPicture] = useState(null);
  const [imgData, setImgData] = useState(null);
  const [video, setVideo] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [FileName, setFileName] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [video, setVideo] = useState(null);
  const [showLivePopup, setLivePopup] = useState(false);
  const [showUploadStatus, setUploadStatus] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [LiveModel, setLiveModel] = useState({ modal: false, item: null });
  const [audLive, setAudLive] = useState(false)
  const [viewStory, setViewStory] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [countrieBlock, setCountrieBlock] = useState([]);
  const [countrieList, setCountrieList] = useState([]);
  const [statusPrice, setStatusPrice] = useState("0");

  const [pageNumber, changePageNumber] = useState(1);

  new_page = pageNumber;
  // const [statusId , setStatusId] = useState("")
  userData = useSelector(userProfile).user.profile; //using redux useSelector here
  myLiveLoadData = useSelector(myLiveLoadingData);
  const countries = getNameList();
  // const countries = getCountries();

  const shareUrl = !!userData ? 'https://clickmystar.in/' + userData.user_id + '/single-profile' : "";
  const title = 'https://clickmystar.in';

  const option = {
    loop: false,
    margin: 20,
    items: 13,
    nav: false,
    autoplay: true
  };

  const storyContent = {
    width: '100%',
    maxWidth: '100%',
    maxHeight: '468px',
    margin: 'auto'
  }

  useEffect(() => {
    let countriesList = [];
    for (var key in countries) {
      if (countries.hasOwnProperty(key)) {
        countriesList.push({ "value": countries[key], "label": key })
      }
    }
    setCountrieList(countriesList)
    // for (const [key, value] of Object.entries(countries)) {
    //   setCountrieList( { "value": value, "label": key })
    //   }
  }, [countries])


  console.log(liveFriendList, "dfkjhgdkhg")
  console.log(friendList, "friendList....")
  const customCollapsedComponent = ({ totalviews, status_id, total_likes, is_liked, paid_status }) => {
    return <>
      <div className="status_footer">
        <span className="status_view"><img src="/streamer-app/assets/images/eye-icon.png" alt="eye" />{totalviews}</span>
        <div className="status_like" style={{ cursor: paid_status ? "pointer" : "default" }} onClick={() => likeStatus(status_id, is_liked, paid_status)}>
          <span ><img src="/streamer-app/assets/images/heart-icon.svg" alt="like status" /> {TLikesStatus}</span>
        </div>
      </div>
    </>
  }
  // Like status
  const likeStatus = (Id, is_liked, paid_status) => {
    if (paid_status) {
      if (isLikedStatus) {
        if (TLikesStatus > (MLikesStatus - 1)) {
          TLikesStatus = TLikesStatus - 1 == -1 ? 0 : TLikesStatus - 1;
          isLikedStatus = false
        }
      }
      else {
        if (TLikesStatus < (MLikesStatus + 1)) {
          TLikesStatus = TLikesStatus + 1;
          isLikedStatus = true
        }
      }

      const bodyParameters = {
        session_id: localStorage.getItem("session_id"),
        status_id: Id
      }
      axios.post(LIKE_STATUS_API, bodyParameters)
        .then((response) => {
          if (response.status == 200 && !response.status.error) {
          }
        }, (error) => {

        });
    }
  }

  useEffect(() => {
    if (!!storyData) {
      for (let i in storyData) {

        storyData[i].header.heading = storyData[i].header.heading + " - " + storyData[i].header.age
        storyData[i].header.subheading = storyData[i].header.subheading.replace("Posted: ", "")
      }
    }
  }, [storyData])

  if (!!storyData) {
    for (let i in storyData) {
      if (storyData[i].paid_status == false) {
        if (storyData[i].coins == 200) { storyData[i].url = "/streamer-app/assets/images/Coins_200.jpg" }
        else if (storyData[i].coins == 500) { storyData[i].url = "/streamer-app/assets/images/Coins_500.jpg" }
        else if (storyData[i].coins == 2000) { storyData[i].url = "/streamer-app/assets/images/Coins_2000.jpg" }
        else if (storyData[i].coins == 5000) { storyData[i].url = "/streamer-app/assets/images/Coins_5000.jpg" }
        if (storyData[i].type == "video") {
          storyData[i].type = "image"
        }
      }
      storyData[i].seeMore = () => customCollapsedComponent(storyData[i]);
      storyData[i].seeMoreCollapsed = () => customCollapsedComponent(storyData[i]);
    }
  }

  const stories = !!storyData ? storyData : []

  const seeStatus = (stories, e) => {
    isLikedStatus = stories[e].is_liked;
    TLikesStatus = stories[e].total_likes;
    MLikesStatus = stories[e].total_likes;

    let status_id = stories[e].status_id
    if (!stories[e].is_seen && stories[e].paid_status) {
      const bodyParameters = {
        session_id: localStorage.getItem("session_id"),
        status_id: status_id
      }
      axios.post(VIEW_STATUS_API, bodyParameters)
        .then((response) => {

        }, (error) => {

        });
    }
  }

  const statusoptions = {
    loop: false,
    slideSpeed: 3000,
    dots: true,
    margin: 0,
    items: 1,
    smartSpeed: 1000,
    nav: false,
    autoplay: true,
    autoplayTimeout: 3000,
  };

  const SingleProfileView = (id) => {
    history.push({
      pathname: `/${id}/single-profile`
    })
  }

  const handleFileChange = e => {
    var data = e.target.files[0];
    // const filename =  e.target.files[0];
    const fileName = data.name.split(".");
    const imageFormat = fileName[fileName.length - 1];
    if (e.target.files[0]) {

      if (imageFormat === "png" || imageFormat === "jpg" || imageFormat === "jpeg" ||
        imageFormat === "SVG" || imageFormat === "svg" || imageFormat === "PNG" || imageFormat === "JPG" || imageFormat === "JPEG") {
        setPicture(e.target.files[0]);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgData(reader.result);
          setVideoData('image');
        });
        reader.readAsDataURL(e.target.files[0]);
      }
      else {
        NotificationManager.error("Only .png, .jpg, .jpeg image formats supported.", "", 2000, () => { return 0 }, true);
      }
    }
  };

  const handleVideoChange = e => {
    var data = e.target.files[0];
    const fileName = data.name.split(".");
    const imageFormat = fileName[fileName.length - 1];
    if (imageFormat === "mp4" || imageFormat === "MP4" || imageFormat === "mov" || imageFormat === "MOV") {
      if (data.size < 50000240) {
        setVideo(data);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setVideoFile(reader.result);
          setVideoData('video');

        });
        reader.readAsDataURL(e.target.files[0]);
      }
      else {

        NotificationManager.error("maximum upload video limit is 50 mb", "", 2000, () => { return 0 }, true);
        setVideoData('');
      }
    }
    else {
      NotificationManager.error("please , Select the video", "", 2000, () => { return 0 }, true);
    }
  }

  // const handleVideoChange = e => {
  //   var data = e.target.files[0];
  //   const fileName = data.name.split(".");
  //   const imageFormat = fileName[fileName.length - 1];
  //   if(imageFormat === "mp4" || imageFormat === "MP4")
  //    {
  //      setPicture(e.target.files[0]);
  //      const reader = new FileReader();
  //      reader.addEventListener("load", () => {
  //        setImgData(reader.result); 
  //        setVideoData('video');
  //      });
  //      reader.readAsDataURL(e.target.files[0]);
  //    }
  //    else
  //    {
  //     ntries...("invadi format")
  //    }
  // } 

  const handleFriendList = (page) => {
    setIsLoaded(true);
    const bodyParameters = {
      session_id: localStorage.getItem('session_id'),
      page
    }
    axios.post(FRIENDLIST_API, bodyParameters)
      .then((response) => {
        if (response.status === 200) {
          setIsLoaded(false);
          let friendList = [...friendLists, ...response.data.data];

          for (let i in friendList) {
            friendList[i].is_live = false;
          }
          friendLists = friendList;
          setFriendlist(removeDublicateFrds(friendList));
          // setStatusLength(response.data.data.statuses);
        }
        else {
          // friendLists = []
          // setFriendlist('');
          setIsLoaded(true);
        }
      }, (error) => {
        if (error.toString().match("403")) {
          
          localStorage.clear();
          history.push('/login');
      }
        // friendLists = []
        // setFriendlist('');
        setIsLoaded(true);

      });
  }

  const handleStatus = (user_id) => {
    setStatusLoading(true);
    const bodyParameters = {
      user_id
    };
    axios.post(GET_STATUS, bodyParameters)
      .then((response) => {

        if (response.status === 200 && !response.status.error) {
          setViewStory(true);
          if (!!response.data && !!response.data.result && response.data.result.length > 0) {
            // $('#modal').show(); 
            setStatusData(response.data);
            setStoryData(response.data.result);
            // toggleIsOn(true)

          }
          else {
            setStatusData({});
            setStoryData([]);
            // toggleIsOn(false)
            setFriendId('');

          }
          setStatusLoading(false);
        }
        else {
          setStatusData({});
          setStatusLoading(false);
          setFriendId('');
        }

      }, (error) => {

        setStatusData({});
        setStatusLoading(false);
        setFriendId('');
      });
  }

  useEffect(() => {
    if (!!friendId) {
      handleStatus(friendId);
    }
  }, [friendId])

  const handleVideo = () => {
    inputVideoFile.current.click();
    setVideoData('');
    setStatusPrice("0");
  }


  const changeCountries = (data) => {
    const my_countries = getCountries();
    for (let i in data) {
      for (let j in my_countries) {
        if (data[i].value == my_countries[j].code) {
          data[i].phone = "+" + my_countries[j].phone
        }
      }
    }
    setCountrieBlock(data);
  }

  const modelClose = () => {
    setUploadStatus(false);
    setLivePopup(false)
    setPicture(null);
    setVideoData(null);
    setStatusPrice("0");
    dispatch(friendStatus({ friendStatus: [] }));
    setStatusModel(false);
    setFriendId('');
  }

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    }
  }

  const closeDialog = () => {
    setViewStory(false);
    setIsLoaded(false);
    setFriendId("");
  }

  const handleUploadStatus = (e) => {
    e.preventDefault();
    if (videoData == "image" || videoData == "video" || videoData == "text") {
      if (videoData == 'image') {
        setIsLoading(true);
        const bodyParameters = new FormData();
        bodyParameters.append("session_id", "" + localStorage.getItem('session_id'));
        bodyParameters.append("status", picture);
        bodyParameters.append("status_type", "" + 1);
        bodyParameters.append("coins", "" + statusPrice);
        axios.post(ADD_STATUS, bodyParameters, config)
          .then((response) => {
            if (response.data.status_code == 200 && !response.data.error) {
              NotificationManager.success(response.data.message, "", 2000, () => { return 0 }, true);
              setIsLoading(false);
              setUploadStatus(false);
              setVideoData('');
              setStatusPrice("0");
            }
            else {
              NotificationManager.error(response.data.message, "", 2000, () => { return 0 }, true);
              setIsLoading(false);
            }
          }, (error) => {
            if (error.toString().match("403")) {
              
              localStorage.clear();
              history.push('/login');
          }            setIsLoading(false);
          });
      }
      else if (videoData == 'video') {
        setIsLoading(true);
        const bodyParameters = new FormData();
        bodyParameters.append("session_id", "" + localStorage.getItem('session_id'));
        bodyParameters.append("status", video);
        bodyParameters.append("status_type", "" + 2);
        bodyParameters.append("coins", "" + statusPrice);
        axios.post(ADD_STATUS, bodyParameters, config)
          .then((response) => {
            if (response.data.status_code == 200 && !response.data.error) {
              NotificationManager.success(response.data.message, "", 2000, () => { return 0 }, true);
              setIsLoading(false);
              setUploadStatus(false);
              setVideoData('');
              setStatusPrice("0");
            }
            else {
              NotificationManager.error(response.data.message, "", 2000, () => { return 0 }, true);
              setIsLoading(false);
            }
          }, (error) => {
            if (error.toString().match("403")) {
              
              localStorage.clear();
              history.push('/login');
          }            setIsLoading(false);

          });
      }
      else if (videoData == 'text') {
        //Converting text to image here
        var tCtx = document.getElementById('textCanvas').getContext('2d'),
          imageElem = document.getElementById('image');

        // tCtx.canvas.width = tCtx.measureText(pencilData).width;
        // tCtx.fillText(pencilData, 10, 50);

        tCtx.canvas.width = 375;
        tCtx.canvas.height = 460;

        //     tCtx.fillStyle = "#fff";
        //     tCtx.font = '20px san-serif';
        //     tCtx.canvas.setAttribute('style', 'background-color:#fff');
        //     var textString = pencilData,
        //         textWidth = tCtx.measureText(textString ).width;
        // tCtx.fillText(textString , (tCtx.canvas.width/2) - (textWidth / 2), 100);

        // here
        // var canvas = document.createElement('canvas');
        // var ctx    = canvas.getContext('2d');
        // canvas.style.border = "1px solid black";
        // document.body.appendChild(canvas);

        function todo(ctx, text, fontSize, fontColor) {
          var max_width = 375;
          var fontSize = 12;
          var lines = new Array();
          var width = 0, i, j;
          var result;
          var color = fontColor || "white";

          // Font and size is required for ctx.measureText()
          ctx.font = fontSize + "px Arial";

          // Start calculation
          while (text.length) {
            for (i = text.length; ctx.measureText(text.substr(0, i)).width > max_width; i--);

            result = text.substr(0, i);

            if (i !== text.length)
              for (j = 0; result.indexOf(" ", j) !== -1; j = result.indexOf(" ", j) + 1);

            lines.push(result.substr(0, j || result.length));
            width = Math.max(width, ctx.measureText(lines[lines.length - 1]).width);
            text = text.substr(lines[lines.length - 1].length, text.length);
          }


          // Calculate canvas size, add margin
          ctx.canvas.width = 14 + width;
          ctx.canvas.height = 8 + (fontSize + 5) * lines.length;
          ctx.font = fontSize + "px Arial";

          // Render
          ctx.fillStyle = color;
          for (i = 0, j = lines.length; i < j; ++i) {
            ctx.fillText(lines[i], 8, 5 + fontSize + (fontSize + 5) * i);
          }
        }

        todo(tCtx, pencilData, 12, "white");
        $('canvas').remove();
        document.getElementById("image").remove()
        // Working here end
        imageElem.src = tCtx.canvas.toDataURL();

        const bodyParameters = new FormData();
        bodyParameters.append("session_id", "" + localStorage.getItem('session_id'));
        bodyParameters.append("status", imageElem.src);
        bodyParameters.append("status_type", "" + 3);

        axios.post(ADD_STATUS, bodyParameters, config)
          .then((response) => {
            if (response.status == 200) {
              NotificationManager.success(response.data.message, "", 2000, () => { return 0 }, true);

              setUploadStatus(false);

              setShowPencil(false);
            }
          }, (error) => {
            
            if (error.toString().match("403")) {
              localStorage.clear();
              history.push('/login');
            }
          });
      }
    }
    else {
      NotificationManager.error("please select image or video", "", 2000, () => { return 0 }, true);
    }
  }

  useEffect(() => {
    $(window).scrollTop(0);
    $(".show-filter").click(function () {
      $(".option-bar").toggleClass("filter-active");
    });

    $(window).scroll(function () {
      if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        console.log(new_page, "new_page")
        changePageNumber(new_page + 1)
      }
    });
    restrictBack()
  }, [])


  // const uploadImage = () => {
  //  // Click event for status uplaod screen
  //  $(document).on("click", "#upload__media", function () {
  //    $('#upload_fle').trigger("click");
  //  });

  //  $(document).on("click", "#upload_fle", function (e) {
  //    e.stopPropagation();
  //    //some code
  // });

  // }z
  const openFileUploder = () => {
    inputFile.current.click();
    setVideoData('');
    setStatusPrice("0");
  }

  const componentWillUnmount = () => {
    clearInterval(checkOnlineFrdsInterval)
  }

  useEffect(() => {
    console.log(pageNumber, "pageNumber...")
    handleFriendList(pageNumber);
  }, [pageNumber])

  useEffect(() => {
    checkOnlineFrdsInterval = window.setInterval(() => {
      SOCKET.emit("authenticate_friend_list_live", {
        session_id: localStorage.getItem("session_id"),
        user_id: !!userData && userData.user_id
      });
      SOCKET.emit("fetch_online_users", {
        role_id: localStorage.getItem("role_id") == "1" ? 2 : 1
      });
    }, 1000)

    SOCKET.off('sendAudienceToLiveVideo').on('sendAudienceToLiveVideo', (data) => {
      setAudLive(false)
      if (userData.user_id === data.user_id) {
        // $('#live-modal').hide();
        // setShowLive(false)
        var newState = {};
        newState.user_id = data.user_id;
        newState.call_type = 2;
        newState.channel_id = data.channel_id;
        newState.channel_name = data.channel_name;
        newState.channel_token = data.channel_token;
        localStorage.setItem("liveVideoProps", JSON.stringify(newState));
        localStorage.setItem("prevPage", location.pathname)
        const page = '/' + data.host_id + '/' + uuidv4() + '/' + data.channel_name + '/' + data.host_socket + '/live-video-chat';
        // openNewWindow(page)
        // window.location = page
        history.push(page)
      }
    })

    SOCKET.off('fetch_online_users').on('fetch_online_users', (data) => {
      let updatedFriendList = friendLists;
      console.log(updatedFriendList, data, "jksdjfjhfdsgfsdfgdsfgsfgsdjfdfdsgf")
      for (let i in updatedFriendList) {
        let matched = false;
        for (let j in data) {
          if (data[j].id == updatedFriendList[i].user_id) {
            matched = true;
          }
        }
        // console.log(updatedFriendList[i], "updatedFriendList[i]")
        // updatedFriendList[i].is_online = matched
        updatedFriendList.splice(i, 1, {...updatedFriendList[i], ...{is_online: matched}})
      }
      console.log(updatedFriendList, "updatedFriendList...")
      setFriendlist(updatedFriendList);
    })
    
    SOCKET.off('live_friends').on('live_friends', (data, user, blockedLists) => {
      if (!!userData && user.user_id == userData.user_id) {
        let new_live_frds_list = data.new_live_frds_list;
        console.log(data, "kdjsfgjdfhgdf")
        console.log(blockedLists, "blockedLists....")
      

        let countryCode = userData.country_code.replace(" +", "");
        for (let i in new_live_frds_list) {
          if (new_live_frds_list[i].is_online && new_live_frds_list[i].is_live) {
              const frd_blocked_countries = !!new_live_frds_list[i].blocked_countries ? new_live_frds_list[i].blocked_countries.split(",") : [];
              for (let f in frd_blocked_countries) {
                if (countryCode == (frd_blocked_countries[f].replace("+", ""))) {
                  new_live_frds_list[i].is_live = false
                  // new_live_frds_list[i].channel_id = uuidv4();
                }
              }
          }
        }



        setLiveFriendList(new_live_frds_list);
        setRandomNumber(Math.random());
      }
    });

    SOCKET.off('start_your_live_video_now').on('start_your_live_video_now', (data) => {
      if ((data.user_id == userData.user_id) && data.channel_id && data.channel_name) {
        setLivePopup(false)
        window.setTimeout(() => {
          dispatch(myLiveLoading(false));
        }, 1000)
        // $('#live-modal').hide();
        // setShowLive(false)
        // history.push(data.user_id+ '/' + data.channel_id +'/'+ data.channel_name + '/live-video-chat')
        localStorage.setItem("prevPage", location.pathname)
        const page = '/streamer-app/' + data.user_id + '/' + data.channel_id + '/' + data.channel_name + '/' + localStorage.getItem("socket_id") + '/live-video-chat'
        // openNewWindow(page);
        window.location = page
      }
    });

    // uploadImage();
    return () => { componentWillUnmount() }
  }, [])

  const makeMeLive = () => {
    const makeMeLiveBtn = document.getElementById("makemelive");
    makeMeLiveBtn.disabled = true;
    const bodyParameters = { session_id: localStorage.getItem("session_id") }
    checkIfIamBusy(bodyParameters, (iAmAvailable) => {
      makeMeLiveBtn.disabled = false;
      if (iAmAvailable == "recheck") {
        makeMeLive()
    }
    else {
        if (iAmAvailable) {

        // setMyLiveLoading(true)
        dispatch(myLiveLoading(true))
        const bodyParameters = {
          session_id: localStorage.getItem("session_id"),
          user_id: userData.user_id,
          user_name: userData.first_name + " " + userData.last_name,
          type: 3
        }
        let blocked_list_data = [];
        for (let i in countrieBlock) {
          blocked_list_data.push(countrieBlock[i].phone)
        }
        const modified_block_countries = blocked_list_data.join(",");
        const call_type = 1, user_id = userData.user_id, block_countries = modified_block_countries.slice(0, modified_block_countries.length);

        generateLiveVideoChatToken(dispatch, history, bodyParameters, call_type, user_id, uuidv4(), block_countries, SOCKET);
      }
    }
    })
  }

  const watchLive = () => {
    if (!audLive) {
      const audDetails = LiveModel;
      const bodyParameters = {
        session_id: localStorage.getItem("session_id"),
        live_user_id: audDetails.item.user_id,
        channel_name: audDetails.item.channel_name
      }
      setAudLive(true)
      axios.post(DETUCT_THOUSAND_COIN, bodyParameters)
        .then((response) => {
          if (response.data.status_code == 200 && response.data.error == "false") {
            if (!!audDetails && audDetails.item.is_live) {
              SOCKET.emit("addAudienceToLiveVideo", {
                user_id: userData.user_id,
                channel_name: audDetails.item.channel_name,
                channel_token: audDetails.item.channel_token,
                is_host: false
              })
            }
          }
          else {
            NotificationManager.error(response.data.message, "", 2000, () => { return 0 }, true);
            setAudLive(false)
          }
        }, (err) => {
          NotificationManager.error(err.message, "", 2000, () => { return 0 }, true);
          setAudLive(false)
        });
    }

  }

  const makeMeAudience = (item) => {
    setLiveModel({ modal: true, item });
  }


  // const convertToHtml = (data) => {
  //    const convertedHtml =  {__html: data};
  //   return <div dangerouslySetInnerHTML={convertedHtml} />
  // }

  // const playVideo = (video) => {
  //   window.setTimeout(() => {
  //       document.getElementById(video).play();
  //   }, 1000)
  //   return <video id= {video} src={video} alt="status" />
  // }

  const savePrevPage = () => {
    if (location.pathname !== "/") {
      localStorage.setItem("prevPage", location.pathname)
    }
  }

  const goToHome = () => {
    savePrevPage();
    window.location.replace("/streamer-app");
  }

  return (
    <section className="home-wrapper">
      <img className="bg-mask" src="/streamer-app/assets/images/mask-bg.png" alt="Mask" />
      <div className="home-inner">
        <div className="container-fluid p-0">
          <div className="row no-gutters">
            <div className="col-lg-3 option-bar p-3 vh-100 position-fixed">
              <div className="logo-tab mb-5 d-flex justify-content-between align-items-start">
                <a href="javascript:void(0)" onClick={() => goToHome()}>
                  <img src="/streamer-app/assets/images/glitters.png" alt="Glitters" />
                </a>
                <a className="show-filter" href="javascript:void(0)"><img src="/streamer-app/assets/images/Filter.png" alt="filter" /></a>
                {/* <span className="chat-point position-relative">
                  <a href="javascript:void(0)">
                    <i className="fas fa-comment" />
                  </a>
                </span> */}
              </div>
              <FilterSide setFilterUser={setFilterUser} />
            </div>
            <div className="col-lg-9 main-bar p-3" style={{ marginLeft: '25%' }}>
              <div className="tab-top d-flex flex-wrap-wrap">
                {
                  checkLoginRole() == 2 &&
                  <div className="live-icon">
                  <img src="/streamer-app/assets/images/live.png" style={{ cursor: "pointer" }} onClick={() => {setLivePopup(true)}} alt="Live" />
                  {/* makeMeLive */}
                </div>
                }
                
                <NavLinks />
              </div>
              <div className="search-section-wrapper mt-4 px-4">
                <div className="users-listing">
                  {
                    checkLoginRole() == 2 &&
                      <div className="add__status" onClick={() => setUploadStatus(true)}>+</div>
                  }
                  <div className="status__slider">
                    {
                      checkLoginRole() == 1 &&
                      <OwlCarousel options={option}  >
                      {liveFriendList.map((item, i) => (
                          <div className="users-listing__slider__items" id={item.user_id}>
                            <div className="users-listing__slider__items__image" id="modal" data-toggle="modal" onClick={() => setFriendId(item.user_id)}>
                              {!!liveFriendList ? <img onError={(e) => addDefaultSrc(e)} src={!!item.image ? "https://clickmystar.in/glitter-101/public/profile_images/" + item.image : returnDefaultImage()} alt="marlene" /> : ""}
                              <ClipLoader color={"#fff"} loading={friendId == item.user_id ? statusLoading : false} css={statusOverride} />
                              <span className="circle-shape" style={{ background: item.is_online ? '#00FF31' : '#f5473bec' }} />
                            </div>
                            {
                              item.is_live === true &&
                              <span style={{ cursor: "pointer" }} onClick={() => makeMeAudience(item)} className="live">Live</span>
                            }
                          </div>
                      ))}
                    </OwlCarousel>
                    }
                  </div>
                </div>
                <div className="search-people-row">
                  <div className="row">
                    {!!friendList &&
                      <>
                        {friendList.map((item, i) => {
                          return <div className=" main col-md-3" id={item.user_id} onClick={() => SingleProfileView(item.user_id)}>
                            <div className="sp-singular">
                              <a href="javascript:void(0)">
                                <figure className="mb-0">
                                  <img onError={(e) => addDefaultSrc(e)} src={!!item.profile_images ? item.profile_images : returnDefaultImage()} alt="Marlene" />
                                </figure>
                                <div className="sp-singular-content">
                                  {!Number(item.is_online) ? <div className="status offline">Offline</div> : <div className="status online">Online</div>}
                                  <h4>{item.name} <span className="age">{item.age}</span></h4>
                                  <div className="info">{item.distance}, {item.occupation}</div>
                                </div>
                              </a>
                              {/* {item.packages.length > 0 ? <span className="vip-user bg-grd-clr"><img src="/streamer-app/assets/images/level-img.png" alt="profile level" /></span> : ""} */}
                            </div>
                          </div>
                        })}
                      </>
                    }

                  </div>

                </div>
                <SyncLoader color={"#fcd46f"} loading={isLoaded} css={override} size={20} />
              </div>
            </div>

          </div>

        </div>
      </div>

      <Modal id="status-modal" show={viewStory} onHide={() => setViewStory(false)} backdrop="static" keyboard={false}>
        <div className="story-modal" style={{ position: "relative" }}>
          <a href="javascript:void(0)" className="close-gift-btn modal-close" onClick={closeDialog}><img src="/streamer-app/assets/images/btn_close.png" /></a>
          {
            stories.length > 0 &&
            <>
              <Stories
                stories={stories}
                defaultInterval={4500}
                storyStyles={storyContent}
                width={377}
                height={468}
                onStoryStart={(e) => seeStatus(stories, e)}
                onAllStoriesEnd={closeDialog}
              />
            </>
          }
        </div>
      </Modal>

      {/* <div className="modal fade" id="status-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">

      <div className="modal-body p-0">
      <div className="status-info">
          <div className="status_image">
            <img src={statusData.profile_images} alt="user" />
          </div>
          <div className="status_heading">
            <h6>{statusData.first_name}• {statusData.age}</h6>
            <span className="timer d-block">9 Seconds</span>
            <span className="status_view"><img src="/streamer-app/assets/images/eye-icon.png" alt="eye" /></span>
           </div>
        </div>

      <OwlCarousel  options={statusoptions} id="status-bar">
     {storyData.map((items ,i) => {
       return <div className="status-bar__items">
            {items.statuses_type==1 ?
             <img onError={(e) => addDefaultSrc(e)} src={!!items.file ? items.file : returnDefaultImage()} alt="status" /> :
              (items.statuses_type == 2 ? playVideo(items.file) : 
              convertToHtml(`<p>${items.file.replace("http://167.172.209.57/glitter_node/glitter-101/public/profile_images/", "")}</p>`))
             } </div>
        })}
        </OwlCarousel>
      </div>
      <div className="status_footer">
      <div className="status_like">
        <span><img src="/streamer-app/assets/images/heart-icon.svg" alt="like status" /> 2,190</span>
      </div>
      <div className="user_connect ml-auto">
        <ul>
          <li className="bg-grd-clr"><img src="/streamer-app/assets/images/message.svg" alt="message" /></li>
          <li className="bg-grd-clr"><img src="/streamer-app/assets/images/call-answer.svg" alt="call" /></li>
          <li className="bg-grd-clr"><img src="/streamer-app/assets/images/video-call.svg" alt="video call" /></li>
          <li className="bg-grd-clr"><img src="/streamer-app/assets/images/gift.svg" alt="gift" /></li>
          <li className="bg-grd-clr"><img src="/streamer-app/assets/images/dots-icon.svg" alt="gift" /></li>
        </ul>
      </div>
      </div> 
       </div>
       </div>  */}


      <Modal className="modal fade" id="group-live-modal" show={LiveModel.modal} onHide={() => setLiveModel({ modal: false, item: null })} backdrop="static" keyboard={false}>

        <div className="modal-dialog" role="document">
          <div className="modal-content" style={{ border: "none" }}>
            <div className="modal-body p-0">
              <div className="group-live">
                <div className="group-live__header">
                  <img src="/streamer-app/assets/images/diamond-sm.png" alt="balance" /> Balance : {!!userData && userData.coins / 2}
                </div>

                <div className="group-live__content text-center">
                  <div className="total_coins d-flex align-items-center justify-content-center py-3">
                    <div className="diamong__icon"><img src="/streamer-app/assets/images/diamond-coin.png" alt="balance" /></div>
                    <h5>1000 Coins</h5>
                  </div>
                  <p>Pay 1000 coins to enter , they will also see what he is going to see inside the broadcaster room .</p>

                  <div className="watch-live d-flex">
                    <a href="javascript:void(0)" style={{ cursor: (audLive ? "default" : "pointer") }} className="btn btn-trsp" onClick={() => { if (!audLive) { setLiveModel({ modal: false, item: null }) } }}>Cancel</a>
                    <a href="javascript:void(0)" style={{ cursor: (audLive ? "default" : "pointer") }} className="btn bg-grd-clr" onClick={watchLive}>{audLive ? "Wait..." : "Watch"}</a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>


      </Modal>
      <Modal className="theme-modal" id="upload-media-modal" show={showUploadStatus} onHide={() => setUploadStatus(false)} backdrop="static" keyboard={false}>
        {/* Modal start here */}
        {/* <div className="theme-modal" id="live-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"> */}

        <form id="glitter_status" >
          <div className="modal-body p-0">
            <div className="upload__status__opt text-center">
              <h4 className="theme-txt">Upload Status</h4>
              <div className="upload-status d-flex justify-content-center mt-5">
                <a id="upload__media" className="upload__media bg-grd-clr" href="javascript:void(0)" onClick={openFileUploder}>
                  <i className="fas fa-camera"></i>
                  <input type="file" name="file" value="" ref={inputFile} id="upload_fle" className="d-none" onChange={handleFileChange} accept="image/* " />

                </a>
                <a className="upload__text bg-grd-clr" href="javascript:void(0)" onClick={handleVideo}>
                  <i className="fas fa-video"></i>
                  <input type="file" name="file" value="" ref={inputVideoFile} id="upload_fle" onChange={handleVideoChange} className="d-none" accept=" video/*" />
                </a>

              </div>
              {!!picture && videoData == 'image' ?
                <div className="preview">
                  <img onError={(e) => addDefaultSrc(e)} id="PreviewPicture" src={!!imgData ? imgData : returnDefaultImage()
                  } />
                </div>
                : videoData == 'video' ?
                  <div className="preview">
                    <video id="video_preview" src={videoFile} width="300" height="300" controls></video>
                  </div>
                  : ""
              }
              {(!!picture && videoData == "image") ?
                <>
                  <h6>Put Price</h6>
                  <div className="image-coins d-flex">
                    <div className="coin-price">
                      <input type="radio" id="coin-value1" name="coin" value={0} onChange={(e) => setStatusPrice(e.target.value)} checked={statusPrice == 0 ? "checked" : ""} />
                      <label for="coin-value1">0 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds"/></label>

                    </div>

                    <div className="coin-price">
                      <input type="radio" id="coin-value2" name="coin" value={50} onChange={(e) => setStatusPrice(e.target.value)} checked={statusPrice == 50 ? "checked" : ""} />
                      <label for="coin-value2">25 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds"/></label>

                    </div>

                    <div className="coin-price">
                      <input type="radio" id="coin-value3" name="coin" value={100} onChange={(e) => setStatusPrice(e.target.value)} checked={statusPrice == 100 ? "checked" : ""} />
                      <label for="coin-value3">50 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds"/></label>

                    </div>

                    <div className="coin-price">
                      <input type="radio" id="coin-value4" name="coin" value={500} onChange={(e) => setStatusPrice(e.target.value)} checked={statusPrice == 500 ? "checked" : ""} />
                      <label for="coin-value4">250 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds"/></label>

                    </div>

                  </div>
                </>
                : ""}


              {videoData == "video" ?
                <>
                  <h6>Put Price</h6>
                  <div className="image-coins d-flex">
                    <div className="coin-price">
                      <input type="radio" id="coin-value1" name="coin" value={0} onChange={(e) => setStatusPrice(e.target.value)} checked={statusPrice == 0 ? "checked" : ""} />
                      <label for="coin-value1">0 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds"/> </label>

                    </div>

                    <div className="coin-price">
                      <input type="radio" id="coin-value2" name="coin" value={200} onChange={(e) => setStatusPrice(e.target.value)} checked={statusPrice == 200 ? "checked" : ""} />
                      <label for="coin-value2">100 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds"/> </label> 

                    </div>

                    <div className="coin-price">
                      <input type="radio" id="coin-value3" name="coin" value={500} onChange={(e) => setStatusPrice(e.target.value)} checked={statusPrice == 500 ? "checked" : ""} />
                      <label for="coin-value3">250 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds"/></label>

                    </div>

                    <div className="coin-price">
                      <input type="radio" id="coin-value4" name="coin" value={2000} onChange={(e) => setStatusPrice(e.target.value)} checked={statusPrice == 2000 ? "checked" : ""} />
                      <label for="coin-value4">1000 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds"/></label>

                    </div>

                    <div className="coin-price">
                      <input type="radio" id="coin-value5" name="coin" value={5000} onChange={(e) => setStatusPrice(e.target.value)} checked={statusPrice == 5000 ? "checked" : ""} />
                      <label for="coin-value5">2500 <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamonds"/></label>

                    </div>

                  </div>
                </>
                : ""}

              <a className={!!isLoading ? "status-upload btn bg-grd-clr btn-small mt-4 disabled" : "status-upload btn bg-grd-clr btn-small mt-4"} onClick={handleUploadStatus}>{!!isLoading ? "Processing..." : " Publish Status"}</a>

            </div>


          </div>
        </form>

        {/* </div> */}
        {/* End Modal start here */}
        <a href="javascript:void(0)" className="modal-close" onClick={modelClose}><img src="/streamer-app/assets/images/btn_close.png" /></a>
      </Modal>

      {/* Live video screen Pop up */}
      <Modal className="live-modals" show={showLivePopup} onHide={() => setLivePopup(false)} backdrop="static" keyboard={false} style={{ display: 'block', paddingLeft: '17px' }}>
        {/* <div className="modal-dialog" role="document">  */}
        {/* <div className="modal-content"> */}
        {/* <div className="modal-body p-0"> */}
        <div className="live-wrapper">
          <div className="live__leftblk mx-auto">
            <div className="live_info d-flex justify-content-center">
              <div className="live_img">
                <img onError={(e) => addDefaultSrc(e)} src={!!userData ? userData.profile_images : returnDefaultImage()} alt="live user" />
                {/* <span>change cover</span> */}
              </div>
              {/* <div className="live_title"> */}
                {/* <h5>Add a title to chat</h5> */}
                {/* <input type="text" name="live_title" className="live-title" id="live-title" /> */}
              {/* </div> */}
            </div>
            {/* <div className="live_share">
              <span>Share to</span>
              <ul>
                <FacebookShareButton size={13} url={shareUrl} quote={title} >
                  <FacebookIcon round />
                </FacebookShareButton>
              </ul>
            </div> */}
            <div className="block-countries-outer">
            <div className="block_countries">
              <p>Block countries</p>
            </div>

            <Select
              value={countrieBlock}
              onChange={(data) => changeCountries(data)}
              options={countrieList}
              isMulti={true}
            />
              </div>
          </div>
          {/* <div className="live_rightblk  text-center">
            <h5 className="mb-4">Select Tag</h5>
            <div className="tags">
              <div className="live-tags">
                <input type="checkbox" defaultValue id="tag-1" />
                <label htmlFor="tag-1">Make friends</label>
              </div>
              <div className="live-tags">
                <input type="checkbox" defaultValue id="tag-2" />
                <label htmlFor="tag-2">Meet People</label>
              </div>
              <div className="live-tags">
                <input type="checkbox" defaultValue id="tag-3" />
                <label htmlFor="tag-3">Enjoy</label>
              </div>
              <div className="live-tags">
                <input type="checkbox" defaultValue id="tag-4" />
                <label htmlFor="tag-4">Naughty</label>
              </div>
              <div className="live-tags">
                <input type="checkbox" defaultValue id="tag-5" />
                <label htmlFor="tag-5">Lovense Lush On</label>
              </div>
              <div className="live-tags">
                <input type="checkbox" defaultValue id="tag-6" />
                <label htmlFor="tag-6">Wet Show</label>
              </div>
              <div className="live-tags">
                <input type="checkbox" defaultValue id="tag-7" />
                <label htmlFor="tag-7">Sing Show</label>
              </div>
              <div className="live-tags">
                <input type="checkbox" defaultValue id="tag-8" />
                <label htmlFor="tag-8">Modeling</label>
              </div>
              <div className="live-tags">
                <input type="checkbox" defaultValue id="tag-9" />
                <label htmlFor="tag-9">Talk About Cultures</label>
              </div>
              <div className="live-tags">
                <input type="checkbox" defaultValue id="tag-10" />
                <label htmlFor="tag-10">Spin Wheel</label>
              </div>
            </div> */}
          {/* </div> */}
          <div className="live-option w-100 text-center">
            <button className="btn bg-grd-clr" id="makemelive" disabled={myLiveLoadData ? true : false} onClick={makeMeLive}>{myLiveLoadData ? "Creating Live..." : "Go live"}</button>
            <div className="live-type mt-4">
              <span className="active">Group Chat Live</span>
              <span>Live</span>
            </div>
          </div>
        </div>

        {/* </div> */}
        {/* </div> */}
        <a href="javascript:void(0)" className="modal-close" onClick={modelClose}><img src="/streamer-app/assets/images/btn_close.png" /></a>
        {/* <div className="modal-close">
      <img src="/streamer-app/assets/images/btn_close.png" alt="close popup" onClick={() => setLivePopup(false)} />
    </div> */}
        {/* </div> */}


      </Modal>
      {/* End live video screen */}
    </section>


  )
}
export default SearchHome;
