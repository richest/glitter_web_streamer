import React, { useState, useEffect, useRef } from "react";
import { useHistory } from 'react-router';
import axios from "axios";
import NavLinks from '../components/Nav';
import { BLOCK_USER_API, COIN_HISTORY, GET_ALL_COIN_PACKAGE, INTEREST_HOBBIES_LIST, RECEIVED_GIFT_LIST, GET_GIFT_API, GET_LOGGEDPROFILE_API, EDITPROFILE_API, BLOCK_USERLIST_API, LOGOUT_API, GET_STRIPE_PACKAGE, ACTIVATE_STRIPE_PACKAGE, NOTIFICATION_ON_OFF_API, EDIT_GALLERY_API, DELETE_GALLERY_API, BLOCK_COUNTRIES_SETTINGS_API } from '../components/Api';
import useToggle from '../components/CommonFunction';
import { removeStorage } from '../components/CommonFunction';
// import Login from '../pages/Login'
import { useDispatch, useSelector } from 'react-redux';
import { logout, profile, ProfileData, stripePlanId, stripeCoinPlanId, userProfile } from '../features/userSlice';
import { Modal, ModalBody, Dropdown } from 'react-bootstrap';
import $ from 'jquery';
import Logo from '../components/Logo';
import PrivacyPolicy from '../components/PrivacyPolicy';
import AboutGlitter from '../components/AboutGlitter';
import { NotificationManager } from 'react-notifications';
import { EmailIcon, FacebookIcon, TelegramIcon, TwitterIcon, WhatsappIcon, EmailShareButton, FacebookShareButton, TelegramShareButton, WhatsappShareButton, TwitterShareButton, } from "react-share";
import StripeForm from '../components/StripeForm';
import DatePicker from 'react-date-picker';
import moment from 'moment'
import { SyncLoader } from "react-spinners";
import { css } from "@emotion/core";
import { addDefaultSrc, checkLoginRole, restrictBack, returnDefaultImage } from "../commonFunctions";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import Notifications from "react-notifications/lib/Notifications";
import { SOCKET } from "../components/Config";
import { Socket } from "socket.io-client";
import Select from 'react-select';
import { getNameList } from "country-list";
import { getCountries } from "../components/Countries";

const override = css`
    
text-align: center;
width: 95%;
position: absolute;
left: 0;
right: 0;
margin: 0 auto;
padding-top:60px;
top: 66%;
-webkit-transform: translateY(-50%);
-moz-transform: translateY(-50%);
transform: translateY(-50%);
`;

const overridePackage = css`
    
text-align: center;
width: 95%;
position: absolute;
left: 0;
right: 0;
margin: 0 auto;
padding-top:60px;
top: 35%;
-webkit-transform: translateY(-50%);
-moz-transform: translateY(-50%);
transform: translateY(-50%);
`;


const Profile = (props) => {


  //Adding class to body and removing the class
  // addBodyClass('no-bg')('login-body')

  const history = useHistory();
  const dispatch = useDispatch();
  const openFile = useRef();

  const countries = getNameList();

  const [packageList, setPackage] = useState([]);
  const [profileData, setProfile] = useState('');
  const [blockData, setBlockData] = useState([]);
  const [blockId, setBlockId] = useState('');
  const [picture, setPicture] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [imgData, setImgData] = useState(null);
  const [GiftData, setGiftData] = useState([]);
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showShare, setShowShare] = useState(false); // state for show share glitter model
  const [showCoins, setShowCoin] = useState(false);
  const [showBuyCoins, setShowBuyCoins] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [showImage, setShowImage] = useState(false); //state for edit profile image model
  const [interestData, showInterestData] = useState([]);
  const [hobbies, setHobbies] = useState([]);
  const [selectedCheck, setSlelected] = useState([]);
  const [coinPackage, setCoinPackage] = useState([]);
  const [coinHistory, setCoinHistory] = useState([]);
  const [coinSpend, setCoinSpend] = useState('');
  const [Dob, setDob] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [loadedModel, setLoadedModel] = useState(false);
  const [notificationChecked, setNotiChecked] = useState(false)

  const [showStripe, setShowStripe] = useState(false);
  const [showChecked, setMycheckbox] = useState(false);

  const [curentStripePlan, setStripPlan] = useState();

  const [galleryImages, setGalleryImages] = useState([])

  const [wheel, changeWheel] = useState(0);

  const [isOn, toggleIsOn] = useToggle();
  const [isProfile, toggleProfile] = useToggle();
  const [pageloading, setPageLoading] = useState(false);

  const [myCoins, setMyCoins] = useState(0);

  const [countrieBlock, setCountrieBlock] = useState([]);
  const [countrieList, setCountrieList] = useState([]);

  const handleShowGallery = () => {
    setShowGallery(true);
  }

  const handleShow = () => {
    setShow(true);
  } // show Edit model
  const handleSettingShow = () => setShowSetting(true); //show Setting Model

  const handleImage = () => setShowImage(true);
  const handlePrivacy = () => { setShowSetting(false); setShowPrivacy(true); }
  const handleAbout = () => { setShowSetting(false); setShowAbout(true); }
  const handleShare = () => { setShowSetting(false); setShowShare(true); } // show share glitter model

  const userData = useSelector(userProfile).user.profile; //using redux useSelector here


  var dates = moment(Dob).format('YYYY/MM/DD');

  // Getting form value here
  const [form, setForm] = useState({

    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    aboutMe: "",
    height: "",
    weight: "",
    relationStatus: "",
    looking_for: "",
    interests_hobbie: ""
  });

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }
  const handleCheck = (e) => {
    const target = e.target;
    var value = target.id;
    target.checked = target.checked
    if (target.checked) {
      let selectedArray = selectedCheck;
      selectedArray.push(value);
      setSlelected(selectedArray);
    } else {
      let selectedArray = selectedCheck;
      var index = selectedArray.indexOf(value);
      selectedArray.splice(index, 1);
      setSlelected(selectedArray);
    }
  }

  const shareUrl = 'https://clickmystar.in/streamer-app';
  const title = 'glitter-app';

  //   useEffect(()=>{
  //  var date = document.getElementsByName('dob')[0].value +=userData.dob ;

  //  document.getElementsByClassName('react-date-picker__inputGroup__day')[0].value= 1;

  //  window.setTimeout(() => {
  //   $("input[name='dob']").attr('value', '1997-05-05');
  //   $('.react-date-picker__inputGroup__day').val('05');
  //   $('.react-date-picker__inputGroup__month').val('05');
  //   $('.react-date-picker__inputGroup__year').val('1997');
  // }, 2000)
  //   },[show])
  // Fetching profile Data
  var sessionId = localStorage.getItem("session_id");
  const ProfileData = async (interests_list) => {
    const bodyParameters = {
      session_id: sessionId,
    };
    try {
      const { data: { data } } = await axios.post(GET_LOGGEDPROFILE_API, bodyParameters)
      setPageLoading(false);
      setGalleryImages(data.gallery_files)

      const my_countries = getCountries();
      console.log(my_countries, "dcnvkf")
      
      const blockedCountry = !!data.blockedCountry ? data.blockedCountry : [] ;
      let newList = [];
      for (let i in blockedCountry) {
        for (let j in my_countries) {
          console.log((blockedCountry[i].country_code).replace("+", ""), my_countries[j].phone, "khcnbktf")
          if ((blockedCountry[i].country_code).replace("+", "") == my_countries[j].phone) {
            newList.push({value: my_countries[j].code , label: my_countries[j].label, phone: blockedCountry[i].country_code})
          }
        }
      }
      console.log(newList, "blockedCountry.....")
  
        console.log(countrieList, "shnbktjbr")
        setCountrieBlock(newList);
      
      //  Setting data variable to state object 
      form.firstName = data.first_name
      form.lastName = data.last_name
      dates = !!data.dob ? data.dob : new Date();
      setDob(new Date(dates))

      form.aboutMe = data.about_me
      form.height = data.height
      form.weight = data.weight
      form.gender = data.gender
      form.looking_for = data.looking_for
      form.relationStatus = data.relationship_status
      form.interests_hobbie = data.interest_hobbies

      var obj = form.interests_hobbie
      setHobbies(obj);
      setProfile(data);
      let notifications = !!data.notification ? true : false
      setNotiChecked(notifications)
      dispatch(
        profile({
          profile: data
        })
      );
    }
    catch (error) {
      if (error.toString().match("403")) {
        
        localStorage.clear();
        history.push('/login');
    }
    }
    // var obj = [...Object.values(Object.keys(form.interests_hobbie))]
    // setHobbies(obj);
  }

  console.log(interestData, "interestData")
  //update profile data

  const changeCountries = (data) => {
    const my_countries = getCountries();
    console.log(my_countries, "dcnvkf")
    for (let i in data) {
      for (let j in my_countries) {
        if (data[i].value == my_countries[j].code) {
          data[i].phone = "+" + my_countries[j].phone
        }
      }
    }
    console.log(data, "data.....")
    setCountrieBlock(data);
  }


  useEffect(() => {
    let countriesList = [];
    for (var key in countries) {
      if (countries.hasOwnProperty(key)) {
        console.log(countriesList, "kcjsghsjdr")
        countriesList.push({ "value": countries[key], "label": key })
      }
    }
    console.log(countries, "countriesList...")

    // const countriesListNew = [];

    // for (let i in countriesList) {
    //   countriesListNew.push({value: countriesList[i].phone, label: countriesList[i].phone})
    // }
    setCountrieList(countriesList)
    // for (const [key, value] of Object.entries(countries)) {
    //   setCountrieList( { "value": value, "label": key })
    //   }
  }, [countries])

  const updateProfile = (e) => {
    setIsLoading(true);
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      }
    }

    var textinputs = document.querySelectorAll('input[class=hobbie]:checked');
    let selectedCheck = []
    for (let i in textinputs) {
      selectedCheck.push(textinputs[i].value)
    }

    const bodyParameters = new FormData();
    bodyParameters.append("session_id", "" + sessionId);
    bodyParameters.append("device_token", "uhydfdfghdertyt445t6y78755t5jhyhyy");
    bodyParameters.append("device_type", "" + 0);
    bodyParameters.append("first_name", "" + form.firstName);
    bodyParameters.append("last_name", "" + form.lastName);
    bodyParameters.append("dob", "" + dates);
    bodyParameters.append("gender", "" + form.gender);
    bodyParameters.append("aboutMe", "" + form.aboutMe);
    bodyParameters.append("height", "" + form.height);
    bodyParameters.append("weight", "" + form.weight);
    bodyParameters.append('looking_for', form.looking_for);
    bodyParameters.append("relationship_status", "" + form.relationStatus);
    bodyParameters.append('interests_hobbies[]', selectedCheck.join(","));


    axios.post(EDITPROFILE_API, bodyParameters, config)
      .then((response) => {

        if (response.status == 200 && response.data.success == true) {
          setIsLoading(false);
          NotificationManager.success(response.data.message, "", 2000, () => { return 0 }, true);
          setShow(false);
          ProfileData();
          setStep(1);
        }
        else {
          NotificationManager.error(response.data.message, "", 2000, () => { return 0 }, true);
        }
      }, (error) => {
        
        if (error.toString().match("403")) {
          localStorage.clear();
          history.push('/login');
        }

      });
  }


  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    }
  }

  //   useEffect(() => {
  //     document.addEventListener("keydown", handleKeyDown);
  //   }, [])

  //   var ESCAPE_KEY = 27;

  //  const handleKeyDown = (event) => {
  //       switch( event.keyCode ) {
  //           case ESCAPE_KEY:
  //               setPicture(null);
  //                setShowImage(true);
  //               break;
  //           default: 
  //               break;
  //       }
  //   }


  function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;
  }

  const changeStep = () => {
    setStep(step + 1);
    window.setTimeout(() => {
      for (let i in interestData) {
        CheckedItem(interestData[i].interests_or_hobbies, interestData[i].id)
      }
    }, 250)
  }

  const formValidation = () => {
    let isValid = true;

    if (picture == null) {
      NotificationManager.error(" please, add the  picture ", "", 1600, () => { return 0 }, true);

      setShowImage(true);
      isValid = false;
    }

    return isValid;
  }

  const formValidationGallery = (picture) => {
    let isValid = true;

    if (picture == null) {
      NotificationManager.error(" please, add the  picture ", "", 1600, () => { return 0 }, true);

      setShowGallery(true);
      isValid = false;
    }


    return isValid;
  }

  const updateGalleryImage = (picture) => {
    const isValid = formValidationGallery(picture);
    if (isValid) {

      var data = picture
      if (!!data) {
        setIsLoading(true);
        const fileName = data.name.split(".");
        const imageFormat = fileName[fileName.length - 1];
        if (imageFormat === "png" || imageFormat === "jpg" || imageFormat === "jpeg" ||
          imageFormat === "PNG" || imageFormat === "JPG" || imageFormat === "JPEG") {

          const bodyParameters = new FormData();
          bodyParameters.append("session_id", "" + sessionId);
          bodyParameters.append('files[]', picture);

          axios.post(EDIT_GALLERY_API, bodyParameters, config)
            .then((response) => {
              if (response.data.status == 200 && !response.data.error) {
                NotificationManager.success("gallery picture added successfully", "", 2000, () => { return 0 }, true);
                // setShowGallery(false);
                ProfileData();
                setIsLoading(false);
              }
              else{
               
                NotificationManager.error(response.data.message, "", 2000, () => { return 0 }, true);
              }
              setPicture(null);
            }, (error) => {
              setIsLoading(false);
              NotificationManager.error(error.message, "", 2000, () => { return 0 }, true);
            });
        }
        else {
          setIsLoading(false);
          NotificationManager.error("Only .png, .jpg, .jpeg image formats supported.", "", 2000, () => { return 0 }, true);
        }
      }
      else {
        setIsLoading(false);
        NotificationManager.error("Only .png, .jpg, .jpeg image formats supported.", "", 2000, () => { return 0 }, true);
      }
    }
  }

  const changeSpinWheel = (e) => {
    // alert(e.target.checked ? 0 : 1)
    SOCKET.emit("update_turn_on_wheel", { user_id: userData.user_id, socket_id: localStorage.getItem("socket_id"), spin: e.target.checked ? 1 : 0 })
  }

  const updateImage = (e) => {
    const isValid = formValidation();
    if (isValid) {

      var data = picture
      if (!!data) {
        setIsLoading(true);
        const fileName = data.name.split(".");
        const imageFormat = fileName[fileName.length - 1];
        if (imageFormat === "png" || imageFormat === "jpg" || imageFormat === "jpeg" ||
          imageFormat === "PNG" || imageFormat === "JPG" || imageFormat === "JPEG") {

          const bodyParameters = new FormData();
          bodyParameters.append("session_id", "" + sessionId);
          bodyParameters.append("device_token", "" + "uhydfdfghdertyt445t6y78755t5jhyhyy");
          bodyParameters.append("device_type", "" + 0);
          bodyParameters.append("first_name", "" + form.firstName);
          bodyParameters.append("last_name", form.lastName);
          bodyParameters.append("gender", "" + form.gender);
          bodyParameters.append("aboutMe", "" + form.aboutMe);
          bodyParameters.append("height", form.height);
          bodyParameters.append("weight", form.weight);
          bodyParameters.append("interest", "" + form.interest);
          bodyParameters.append('profile_photo[]', picture);

          bodyParameters.append("relationship_status", form.relationStatus);

          axios.post(EDITPROFILE_API, bodyParameters, config)
            .then((response) => {

              if (response.status == 200 && !response.status.error) {
                NotificationManager.success("profile picture update successfully", "", 2000, () => { return 0 }, true);
                setShowImage(false);
                ProfileData();
                setIsLoading(false);
              }
              setPicture(null);
            }, (error) => {
              setIsLoading(false);
              NotificationManager.error(error.message, "", 2000, () => { return 0 }, true);
            });
        }
        else {
          setIsLoading(false);
          NotificationManager.error("Only .png, .jpg, .jpeg image formats supported.", "", 2000, () => { return 0 }, true);
        }
      }
      else {
        setIsLoading(false);
        NotificationManager.error("Only .png, .jpg, .jpeg image formats supported.", "", 2000, () => { return 0 }, true);
      }
    }
  }

  const handleLogout = () => {
    const bodyParameters = {
      session_id: sessionId
    };
    axios.post(LOGOUT_API, bodyParameters)
      .then((response) => {
        SOCKET.emit('is_user_active', {
          "user_id": localStorage.getItem("user_id"),
          is_online: 0
        });
        SOCKET.emit("destroy_socket_connection", { socket_id: localStorage.getItem("socket_id") });
        localStorage.clear();
        history.push('/login');
        dispatch(logout());
        dispatch(profile({ profile: null }));

      }, (error) => {

      });
  }

  //block list
  const handleBlockList = async () => {
    setLoadedModel(true);
    setShowBlock(true);
    const bodyParameters = {
      session_id: sessionId,
    };
    try {
      const { data: { data, status_code, error } } = await axios.post(BLOCK_USERLIST_API, bodyParameters)
      setLoadedModel(false);
      if (status_code == 200) {
        if (data.length > 0) {
          setBlockData(data);
          setLoadedModel(false);
          setWarningMessage('');
        }
        else {
          setWarningMessage('No user blocked');
          setLoadedModel(false);
        }
      }

    }
    catch (err) {
      if (err.toString().match("403")) {
        localStorage.clear();
        history.push('/login');
        setLoadedModel(true);
      }
    }

  }
  // block user 
  const handleBlock = (blockId) => {
    const bodyParameters = {
      session_id: localStorage.getItem('session_id'),
      blocked_user: blockId,

    }
    axios.post(BLOCK_USER_API, bodyParameters)
      .then((response) => {
        if (response.status == 200 && !response.error) {
          NotificationManager.success("unblock successfully", "", 2000, () => { return 0 }, true);
          handleBlockList();
          setBlockData('');

        }
      }, (error) => {
        
        if (error.toString().match("403")) {
          localStorage.clear();
          history.push('/login');
        }
      });
  }

  // useEffect(() => {
  //    handleBlock();
  //  }, [blockId])

  // coin package
  const handleBuyCoins = () => {
    setLoadedModel(true);
    setShowBuyCoins(true);
    axios.get(GET_ALL_COIN_PACKAGE)
      .then((response) => {
        if (response.status == 200) {
          setCoinPackage(response.data.coin_list);
          setLoadedModel(false);
        }
      }, (error) => {
        
        if (error.toString().match("403")) {
          localStorage.clear();
          history.push('/login');
        }
        setLoadedModel(true);
      });
  }



  //coin history 
  const handleCoinHistory = () => {
    setLoadedModel(true);
    setShowCoin(true);
    const bodyParameters = {
      session_id: sessionId,
    }
    axios.post(COIN_HISTORY, bodyParameters)
      .then((response) => {

        if (response.data.status_code == 200 && response.data.status == true) {
          setLoadedModel(false);
          setCoinHistory(response.data.result);
          setCoinSpend(response.data.count_coins);
          setWarningMessage('');
        }
        else {
          setLoadedModel(false);
          setWarningMessage(response.data.message);

        }

      }, (error) => {
        setLoadedModel(false);
        
        if (error.toString().match("403")) {
         
          localStorage.clear();
          history.push('/login');
      }

      });

  }

  //all gift
  const handleGift = async () => {
    setLoadedModel(true);
    toggleIsOn(true);
    const bodyParameters = {
      session_id: sessionId,
    }
    try {
      const { data: { result, status_code, coins } } = await axios.post(RECEIVED_GIFT_LIST, bodyParameters)
      setLoadedModel(false);
      if (status_code == 200 && result.length > 0) {
        setMyCoins(coins)
        setGiftData(result);
        setWarningMessage('');
      }
      else {
        setMyCoins(0)
        setWarningMessage("No recieved gifts found");
      }
    }
    catch (err) {
      setLoadedModel(false);
      if (err.toString().match("403")) {
        localStorage.clear();
        history.push('/login');
      }
    }
  }

  //get interest hobbies
  const handleInterest = () => {
    setPageLoading(true);
    axios.get(INTEREST_HOBBIES_LIST)
      .then((response) => {
        if (response.status == 200) {
          showInterestData(response.data);
          ProfileData(response.data);
        }
      }, (error) => {
        setPageLoading(false);
        
        if (error.toString().match("403")) {
          localStorage.clear();
          history.push('/login');
        }
      });
  }

  const handleFileChange = e => {
    if (e.target.files[0]) {

      setPicture(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);

      });
      reader.readAsDataURL(e.target.files[0]);
    }
    if (showGallery) {
        updateGalleryImage(e.target.files[0]);
    }
  };

  const deleteGalleryImage = (id) => {
    const bodyParameters = {
      session_id: localStorage.getItem('session_id'),
      file_id: id
    }
    axios.post(DELETE_GALLERY_API, bodyParameters)
      .then((response) => {
        if (response.status == 200 && response.data.error == false) {
          NotificationManager.success("Gallery image deleted successfully", "", 2000, () => { return 0 }, true);
          ProfileData();
        }
        else {
          NotificationManager.error(response.data.error_message, "", 2000, () => { return 0 }, true);
        }
        
      }, (error) => {
        NotificationManager.error(error.message, "", 2000, () => { return 0 }, true);
      });
    }

    
  const uploadImage = () => {
    // Click event for status uplaod screen
    // $(document).on("click", ".image-uploader  a", function () {
    //  // var image_name = $('#profile-photo').val().replace("C:\\fakepath\\", "");
    //  // $(".custom-file-upload").html(image_name);

    //   $('#profile-photo').trigger("click");
    // });

    $(document).on("change", "#profile-photo", function () {
      var image_name1 = $(this).val().replace("C:\\fakepath\\", "");
      $(".custom-file-upload").html(image_name1);
    });

    //   $(document).on("click", "#profile-photo", function (e) {
    //     e.stopPropagation();
    //     //some code
    //  });

  }

  // ------------------------------ Stipe payment module -----------------------------------------------//

  const GetStipePackage = async () => {
    setIsLoaded(true);
    try {
      const { data: { plan_list, status_code, error } } = await axios.get(GET_STRIPE_PACKAGE)
      setIsLoaded(false);
      if (status_code == 200) {
        setPackage(plan_list);
      }
    }
    catch (err) {
      if (err.toString().match("403")) {
        localStorage.clear();
        history.push('/login');
      }
    }
  }

  const CheckedItem = (id, unique_id) => {
    let checkId = false;
    const elm = document.getElementById("interests_hobbie" + unique_id);
    console.log(elm, "elmudftu", hobbies)
    for (let i in hobbies) {
      // const hobbie_name =
      console.log(hobbies[i], id, "ckhekbf") 
      if (hobbies[i] == id) {
        checkId = true
      }
    }

    if (!!elm) {
      elm.checked = checkId;
    }
  }

  // Get id of current plan 
  const Stripehandler = (id) => {
    dispatch(
      stripePlanId({
        stripePlanId: id
      })
    );
    setShowStripe(true);
  }

  const StripeCoinHandler = (id) => {
    dispatch(
      stripeCoinPlanId({
        stripeCoinPlanId: id
      })
    );
    setShowStripe(true);
    setShowBuyCoins(false);
  }

  const closeStripeModel = () => {
    setShowStripe(false);
    dispatch(stripePlanId({ stripePlanId: null }));
    dispatch(stripeCoinPlanId({ stripeCoinPlanId: null }));
  }


  const closeGiftModel = () => {
    setGiftData('');
    toggleIsOn(false);
  }

  const closeCoinSpend = () => {
    setShowCoin(false);
    setCoinHistory('');
    setCoinSpend('');
    setWarningMessage('');

  }

  const closeBlockModel = () => {
    setShowBlock(false);
    setBlockData('');
    setWarningMessage('');
  }

  useEffect(() => {
    GetStipePackage();
    handleInterest();
    uploadImage();
    //handleBlock();

    SOCKET.off("do_i_have_turn_on_wheel").on('do_i_have_turn_on_wheel', (data) => {
      changeWheel(data.wheel)
    })
    restrictBack()
  }, [])


  useEffect(() => {
    if (!!userData) {
      SOCKET.emit("do_i_have_turn_on_wheel", { user_id: userData.user_id, socket_id: localStorage.getItem("socket_id") })
    }
  }, [userData])


  const closedOnClick = () => {
    setShowImage(false);
    setPicture(null);
  }

  const openFileUploader = () => {
    openFile.current.click();
  }

  const closeEditProfile = () => {
    setShow(false);
    setStep(1);
  }
  const changeNotification = (e) => {
    const bodyParameters = {
      session_id: sessionId,
    }
    axios.post(NOTIFICATION_ON_OFF_API, bodyParameters)
      .then((response) => {

        if (response.data.status_code == 200) {
          if (response.data.data == 1) {
            setNotiChecked(true)
          } else {
            setNotiChecked(false)
          }
        }


      }, (error) => {

        
        if (error.toString().match("403")) {
          localStorage.clear();
          history.push('/login');
        }

      });
  }

  const blockCountries = () => {
    console.log(countrieBlock, "countrieBlock...");
    const new_blocked_countries = [];
    for (let i in countrieBlock) {
      new_blocked_countries.push(countrieBlock[i].phone)
    }
    console.log(new_blocked_countries, "new_blocked_countries....")

    const bodyParameters = {
      session_id: sessionId,
      country_code: new_blocked_countries
    };

    const config = {
      headers: {
        Accept: "application/json"
      }
    }

    axios.post(BLOCK_COUNTRIES_SETTINGS_API, bodyParameters, config)
    .then((response) => {

      if (response.status == 200 && !response.data.error) {
        setIsLoading(false);
        NotificationManager.success(response.data.message, "", 2000, () => { return 0 }, true);
        setShow(false);
        setCountrieBlock([]);
        ProfileData();
        setStep(1);
      }
      else {
        NotificationManager.error(response.data.message, "", 2000, () => { return 0 }, true);
      }
    }, (error) => {
      
      if (error.toString().match("403")) {
        localStorage.clear();
        history.push('/login');
      }

    });
  }

  const tabScreen = () => {
    switch (step) {
      case 1:
        return (

          <div className="edit-first-step">
            <div className="position-relative w-100 mb-5">
              <h4 className="theme-txt text-center">Your Information</h4>
            </div>
            <div className="form-group">
              <label className="d-block">First Name</label>
              <input className="form-control bg-trsp" name="firstName" type="text" value={form.firstName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="d-block">Last name</label>
              <input className="form-control bg-trsp" name="lastName" type="text" value={form.lastName} onChange={handleChange} />
            </div>
            <div className="form-group dob-field">
              <label className="d-block">DOB</label>
              <DatePicker className="bg-trsp" name="dob" format="dd/MM/yyyy" clearIcon value={Dob} dayPlaceholder="dd" monthPlaceholder="mm" yearPlaceholder="yyyy" onChange={(date) => setDob(date)} />
              {/* <input className="form-control bg-trsp" name="dob" type="text" value={form.dob} onChange={handleChange}  /> */}
            </div>

            <div className="choose-gender d-flex my-4">

              <div className="form-group">

                {form.gender == 1}
                <input type="radio" id="female" name="gender" value={1} checked={form.gender == 1 ? "checked" : ""} onChange={handleChange} placeholder="Female" />
                <label htmlFor="female">Female</label>
              </div>
              <div className="form-group">
                <input type="radio" id="male" name="gender" value={2} checked={form.gender == 2 ? "checked" : ""} onChange={handleChange} placeholder="Male" />
                <label htmlFor="male">Male</label>
              </div>

              <div className="form-group">
                <input type="radio" id="prefer not to say" value={3} checked={form.gender == 3 ? "checked" : ""} onChange={handleChange} name="gender" />
                <label htmlFor="prefer not to say">prefer not to say</label>
              </div>
              <div className="form-group">
                <input type="radio" id="non binary" value={4} checked={form.gender == 4 ? "checked" : ""} onChange={handleChange} name="gender" />
                <label htmlFor="non binary">non binary</label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="">About Me</label>
              <input className="form-control bg-trsp" name="aboutMe" type="text" value={form.aboutMe} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label for="">Relationship status</label>
              <select name="relationStatus" id="" value={form.relationStatus} onChange={handleChange}>
                <option value={1}>Single</option>
                <option value={2}>Married</option>
                <option value={3}>UnMarried</option>
              </select>
            </div>

            <a className="btn bg-grd-clr d-block btn-countinue-3" id="edit-first-step" href="javascript:void(0)" onClick={changeStep}>Next</a>
          </div>

        );
      case 2:
        return (

          <div className="edit-second-step">
            <div className="position-relative w-100 mb-5">
              <a href="javascript:void(0)" className="login-back-2 btn-back  mb-4" onClick={() => setStep(step - 1)} ><i className="fas fa-chevron-left" /></a>
              <h4 className="theme-txt text-center mb-4 ml-3">Your Information</h4>
            </div>
            <div className="form-group">
              <label for="">Height</label>
              <input className="form-control bg-trsp" name="height" type="text" value={form.height} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label for="">Weight</label>
              <input className="form-control bg-trsp" name="weight" type="text" value={form.weight} onChange={handleChange} />
            </div>


            <div className="choose-gender ft-block d-flex flex-wrap">

              <div className="tab-title">
                <label>Looking For</label>
              </div>
              <div className="form-group">
                <input type="radio" id="female" name="looking_for" value={1} checked={form.looking_for == 1 ? "checked" : ""} onChange={handleChange} placeholder="Female" />
                <label htmlFor="female">Men</label>
              </div>
              <div className="form-group">
                <input type="radio" id="male" name="looking_for" value={2} checked={form.looking_for == 2 ? "checked" : ""} onChange={handleChange} placeholder="Male" />
                <label htmlFor="male">Women</label>
              </div>
              <div className="form-group">
                <input type="radio" id="more" value={3} checked={form.looking_for == 3 ? "checked" : ""} onChange={handleChange} name="looking_for" />
                <label htmlFor="more">Both</label>
              </div>
            </div>

            <div className="choose-intersest ft-block d-flex flex-wrap"  >
              <div className="tab-title">
                <label>Interest hobbies</label>
              </div>
              <div className="form-group">
                {interestData.map((item, i) => (
                  <>
                    <input type="checkbox" className="hobbie" id={"interests_hobbie" + item.id}
                      onClick={handleCheck} name={"interests_hobbie" + i} value={item.id} />
                    <label for={"interests_hobbie" + item.id}>{item.interests_or_hobbies}</label>
                  </>
                ))}
              </div>
            </div>
            <a className={!!isLoading ? "btn bg-grd-clr d-block btn-countinue-3 disabled" : "btn bg-grd-clr d-block btn-countinue-3"} id="edit-second-step" href="javascript:void(0)" onClick={updateProfile}>{!!isLoading ? "Processing..." : "update"}</a>

          </div>

        );
      default:
        return 'foo';
    }
  }

  return (
    <div>
      <section className="home-wrapper">
        <img className="bg-mask" src="/streamer-app/assets/images/mask-bg.png" alt="Mask" />
        <div className="header-bar">
          <div className="container-fluid p-0">
            <div className="row no-gutters">
              <div className="col-lg-5 p-3">
                <div className="d-flex flex-wrap align-items-center">
                  <div className="logo-tab d-flex justify-content-between align-items-start">
                    <a href="javascript:void(0)">
                      <Logo />
                    </a>
                  </div>
                  {/* <div className="vc-head-title d-flex flex-wrap align-items-center ml-5">
                <div className="vc-user-name d-flex flex-wrap align-items-center">
                  <figure>
                    <img onError={(e) => addDefaultSrc(e)} src={!!profileData.profile_images ? profileData.profile_images : returnDefaultImage()} alt="Augusta Castro"  />
                  </figure>
                  <div className="name ml-2">{profileData.first_name +' '+ profileData.last_name }  <span className="age">{profileData.age}</span></div>
                </div>
                <div className="remaining-coins ml-4">
                  <img src="/streamer-app/assets/images/diamond-coin.png" alt="Coins" />
                  <span> {!!userData&& userData.coins!=0 ?  userData.coins :  "0" }</span>
                </div>
              </div> */}
                </div>
              </div>
              <div className="col-lg-7 p-3">
                <div className="tab-top d-flex flex-wrap-wrap align-items-center">
                  <NavLinks />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container becomevip-wrapper">
          <div className="row">
            <div className="col-md-4 border-rt full-width">
              <div className="user-profile becomevip-wrapper__innerblock p-0">
                <div className="user-profile__details text-center">
                  <img style={{ cursor: "pointer" }} onError={(e) => addDefaultSrc(e)} src={!!profileData.profile_images ? profileData.profile_images : returnDefaultImage()} alt="user" className="user-profile__image img-circle" onClick={handleImage} />

                  <div className="user-profile__details__data">
                    <h5 className="user-profile__name">{!!profileData ? `${profileData.first_name} ${profileData.last_name}` : ""} </h5>
                    <div className="user-profile__level d-inline-block">
                      {!!userData &&
                        <>
                          {userData.packages.length > 0 ?
                            <span className="d-block"><img src="/streamer-app/assets/images/level-img.png" alt="profile level" />Premium, VIP</span>
                            : ""}
                        </>
                      }
                      <span className="d-block"><img src="/streamer-app/assets/images/diamond-sm.png" alt="balance" />Balance: {!!userData && userData.coins != 0 ? userData.coins / 2 : "0"}</span>
                    </div>
                  </div>
                </div>
                <div className="user-profile__status py-3 mt-4">
                  <ul className="d-flex flex-wrap justify-content-center">
                    <li><span className="user-profile__status__heading d-block text-uppercase">Liked</span>
                      <span className="user-profile__status__counter d-block">
                        {!!profileData ? profileData.likes != 0 ? profileData.likes : "0" : "0"}</span>
                    </li>
                    <li><span className="user-profile__status__heading d-block text-uppercase">Story</span>
                      <span className="user-profile__status__counter d-block">{!!userData ? userData.statuses.length : "0"}</span>
                    </li>
                    <li><span className="user-profile__status__heading d-block text-uppercase">Diamonds</span>
                      <span className="user-profile__status__counter d-block">
                        {!!userData ?
                          userData.coins != 0 ? userData.coins / 2 : "0"
                          : "0"}

                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="user-profile__options becomevip-wrapper__innerblock">
                <ul>
                  {
                    checkLoginRole() == 2 &&
                    <li><a href="javascript:void(0)" id="gift-modal" onClick={handleGift}><img src="/streamer-app/assets/images/gift-icon.png" alt="gifts" />
                        <h6 className="mb-0">Gifts</h6> <i className="fas fa-chevron-right" />
                    </a></li>
                  }
                  
                  {
                    !pageloading &&
                    <li><a href="javascript:void(0)" id="edit-profile" onClick={handleShow}><img src="/streamer-app/assets/images/edit-profile.png" alt="Edit Profile" />
                      <h6>Edit Profile</h6> <i className="fas fa-chevron-right" />
                    </a>

                    </li>
                  }

{
                    !pageloading &&
                  <li><a href="javascript:void(0)" id="edit-profile" onClick={handleShowGallery}><img src="/streamer-app/assets/images/gallery.png" style={{width: "25px"}} alt="Edit Profile" />
                    <h6>Gallery</h6> <i className="fas fa-chevron-right" />
                  </a>
                  
                  </li>
                  }

                  <li><a href="javascript:void(0)" id="edit-profile" onClick={() => history.push("/recent-call")}><img src="/streamer-app/assets/images/edit-profile.png" alt="Edit Profile" />
                    <h6>Recent Call</h6> <i className="fas fa-chevron-right" />
                  </a></li>
                  <li><a href="javascript:void(0)" id="coin-spend" onClick={handleCoinHistory}><img src="/streamer-app/assets/images/diamond-coin.png" alt="Coins" />
                    <h6 className="mb-0">Diamonds</h6> <i className="fas fa-chevron-right" />
                  </a></li>
                </ul>
              </div>
              <div className="user-profile__options becomevip-wrapper__innerblock">
                <ul>
                  <li><a href="javascript:void(0)" id="blacklist" onClick={handleBlockList}>
                    <h6 className="mb-0"><img src="/streamer-app/assets/images/blacklist-icon.png" alt="Blacklist" />Blocklist</h6> <i className="fas fa-chevron-right" />
                  </a></li>
                  <li><a href="javascript:void(0)" id="setting" onClick={handleSettingShow}>
                    <h6 className="mb-0"><img src="/streamer-app/assets/images/setting-icon.png" alt="setting" />Settings</h6> <i className="fas fa-chevron-right" />
                  </a></li>
                  {
                    checkLoginRole() == 1 &&
                    <li><a href="javascript:void(0)" id="coin-spend" onClick={handleBuyCoins}><img src="/streamer-app/assets/images/diamond-coin.png" alt="Coins" />
                      <h6 className="mb-0">Buy Coins</h6> <i className="fas fa-chevron-right" />
                    </a></li>
                  }

                </ul>
              </div>
              <div className="user-profile__logout becomevip-wrapper__innerblock text-center">
                <a href="javascript:void(0)" className="text-white signout-btn" onClick={handleLogout}>Sign out</a>
              </div>
            </div>

            <div className="col-md-4 full-width">
              <div className="membership-plans">
                {/* {!!userData &&
                  <>
                    {userData.packages.length > 0 ?
                      ""
                      : <h5 className="text-white text-uppercase"><img src="/streamer-app/assets/images/Crown-white.png" alt="crown" /> Become vip</h5>}
                  </>
                } */}
                {/* {packageList.map((item, i) => (
                  (!!item && item.duration === "12") ?
                    <div className="membership-plans__block active mt-5">
                      <a href="javascript:void(0)" key={i} onClick={(e) => Stripehandler(item.plan_id)}>
                        <span className="membership-discount">{`save ${item.save}`}</span>
                        <h5 className="text-white text-uppercase mb-0">{item.name}</h5>
                        <div className="membership-plans__price">
                          <span>{`$${item.rate}.00`} </span>
                          <span>{`${item.per_monthRate}`}</span>
                        </div>
                      </a>
                    </div>
                    : <div className="membership-plans__block" key={i} onClick={(e) => Stripehandler(item.plan_id)}>
                      <a href="javascript:void(0)">
                        <h5 className="text-uppercase mb-0">{item.name}</h5>
                        <div className="membership-plans__price">
                          <span>{`$${item.rate}.00`}</span>
                          <span>{`${!!item.per_monthRate ? item.per_monthRate : ""}`}</span>
                        </div>
                      </a>
                    </div>
                ))} */}
                <SyncLoader color={"#fcd46f"} loading={isLoaded} css={overridePackage} size={18} />
              </div>

            </div>

            {/* <div className="col-md-4 full-width">
              <div className="user-actions">
                <div className="becomevip-wrapper__innerblock">
                  <ul>
                    <li><a href>
                      <span><img src="/streamer-app/assets/images/more-views.png" alt="gifts" /></span>
                      <h6 className="mb-0">More Views </h6>
                    </a></li>
                    <li><a href>
                      <span><img src="/streamer-app/assets/images/text-msg.png" alt="Edit Profile" /></span>
                      <h6 className="mb-0">Unlimited text messages </h6>
                    </a></li>
                    <li><a href>
                      <span><img src="/streamer-app/assets/images/like-profile.png" alt="Coins" /></span>
                      <h6 className="mb-0">See who likes my profile</h6>
                    </a></li>
                    <li><a href>
                      <span><img src="/streamer-app/assets/images/top-streamer.png" alt="Coins" /></span>
                      <h6 className="mb-0">View top streamers on the search Criteria first</h6>
                    </a></li>
                    <li><a href>
                      <span><img src="/streamer-app/assets/images/turnoff-ads.png" alt="Coins" /></span>
                      <h6 className="mb-0">Turn Off Ads</h6>
                    </a></li>
                  </ul>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      <Modal className=" edit-profile-modal" show={showGallery} onHide={() => setShowGallery(false)} backdrop="static" keyboard={false}>
        
        <div className="edit-profile-modal__inner">
          <form>
      
          <div className="edit-first-step">
            <div className="position-relative w-100 mb-5">
              <h4 className="theme-txt text-center">Gallery
             
          <div className="image-uploader position-relative">
            {/* {
              !!picture &&
              <label className="custom-file-upload"></label> 
            } */}
            <a href="javascript:void(0)" className="btn bg-grd-clr mt-3" onClick={openFileUploader}><i class="fas fa-plus"></i> Add Photo</a>

            <input type="file" id="profile-photo" ref={openFile} name="profile-photo" onChange={handleFileChange} className="d-none" accept=".png, .jpg, .jpeg, .PNG, .JPG, .JPEG" />
          </div>
          {/* <a href="javascript:void(0)" onClick={updateGalleryImage} className={!!isLoading ? "btn bg-grd-clr disabled" : "btn bg-grd-clr"}>{!!isLoading ? "Processing..." : "Publish Photo"}</a> */}
      </h4>
     
            </div>  
            
            </div>

          </form>
        </div>
        {
              
              <div className="form-group">
                {
                galleryImages.length > 0 &&
                <div className="image-gallery">
                {
                  galleryImages.map((data_pics, i) => (
                    <div className="col-md-12 edit-image-outer">
                    <img className="edit-image" style={{cursor: "default"}} src={data_pics.file_name.replace("/glitterclone/", "/")} />
                    <i onClick={() => {deleteGalleryImage(data_pics.id)}} class="fa fa-times" aria-hidden="true"></i>
                    </div>
                    ))
                }
                </div>
            }
  {
  galleryImages.length == 0 &&
  <div style={{textAlign: "center"}}> No Gallery Photos...</div>
  }
                </div>
              }
        <a href="javascript:void(0)" className="modal-close" onClick={() => setShowGallery(false)}><img src="/assets/images/btn_close.png" /></a>
      </Modal>

      <Modal className="edit-payment-modal" show={showStripe} onHide={() => setShowStripe(false)} backdrop="static" keyboard={false}>
        <div className="edit-payment-modal__inner">

          <h4 className="theme-txt text-center mb-4">Your Card details</h4>

          <StripeForm />

        </div>

        <a href="javascript:void(0)" id="stripe-close" className="modal-close" onClick={closeStripeModel}><img src="/streamer-app/assets/images/btn_close.png" /></a>
      </Modal>

      <Modal className="Image-model" show={showImage} onHide={closedOnClick}>
        <form>
          <h6>Upload File</h6>
          <div className="image-uploader position-relative">
            <label className="custom-file-upload"></label>
            <a href="javascript:void(0)" className="btn bg-grd-clr" onClick={openFileUploader}>Select Photo</a>

            <input type="file" id="profile-photo" ref={openFile} name="profile-photo" onChange={handleFileChange} className="d-none" accept=".png, .jpg, .jpeg, .PNG, .JPG, .JPEG" />
          </div>
          <a href="javascript:void(0)" onClick={updateImage} className={!!isLoading ? "btn bg-grd-clr disabled" : "btn bg-grd-clr"}>{!!isLoading ? "Processing..." : "Publish Photo"}</a>

        </form>
      </Modal>
      {/* <div class="edit-profile-modal modal-wrapper"> */}
      <Modal className=" edit-profile-modal" show={show} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
        <div className="edit-profile-modal__inner">
          <form>
            {tabScreen()}
          </form>
        </div>
        <a href="javascript:void(0)" className="modal-close" onClick={closeEditProfile}><img src="/streamer-app/assets/images/btn_close.png" /></a>
      </Modal>

      <Modal className="coin-spend-modal" show={showCoins} onHide={() => setShowCoin(false)} backdrop="static" keyboard={false}>
        <div className="edit-profile-modal__inner">
          <h4 className="theme-txt text-center mb-4 ">Diamond Earned</h4>
          <h5 className="total-coins-spend text-center mb-4">{coinSpend}</h5>
          {!!coinHistory && coinHistory.map((item, index) => {
            return <div className="coin-spend">
              <div className="coin-spend__host">
                {item.receiver_image != "" ? <img src={item.sender_image} style={{ cursor: "pointer" }} onClick={() => history.push(`/${item.sender_id}/single-profile`)} alt="host" /> : <img onError={(e) => addDefaultSrc(e)} src={returnDefaultImage()} alt="host" />}
              </div>
              <div className="coins-spend__hostname">
              <span>{item.receiver_name}</span> <span>{"("+item.coins_spend_on+")"}</span>
                <div className="coin-spend__total mt-2"><img src="/streamer-app/assets/images/diamond-sm.png" />{item.coins / 2}</div>
              </div>
              <div className="coin-spend__gift">
                {item.gift_image != "" ? <img src={item.gift_image} alt="gift" /> : ""}
              </div>
            </div>
          })}

          {
            !!warningMessage ?
              <h6 className="text-center">
                {warningMessage}
              </h6>
              :
              ""
          }

          <SyncLoader color={"#fcd46f"} loading={loadedModel} css={override} size={18} />
        </div>
        <a href="javascript:void(0)" className="modal-close" onClick={closeCoinSpend}><img src="/streamer-app/assets/images/btn_close.png" /></a>
      </Modal>

      <Modal className="blacklist-modal" show={showBlock} onHide={() => setShowBlock(false)} backdrop="static" keyboard={false}>
        <div className="edit-profile-modal__inner">
          <h4 className="theme-txt text-center mb-4">Blocklist</h4>

          {!!blockData &&
            <>
              {!!blockData && blockData.map((item, i) => {

                return <div className="coin-spend">
                  <div className="coin-spend__host">
                    <img onError={(e) => addDefaultSrc(e)} src={!!item.profile_images ? item.profile_images : returnDefaultImage()} style={{ cursor: "pointer" }} onClick={() => history.push(`/${item.user_id}/single-profile`)} alt="host" />
                  </div>
                  <div className="coins-spend__hostname">
                    <span>{item.first_name}</span> <span className="counter">{item.age}</span>
                    <div className="coin-spend__total" >
                      <a className="theme-txt" href="javascript:void(0)" onClick={() => handleBlock(item.user_id)}>Unblock</a>

                    </div>

                  </div>

                </div>
              })}</>}
          {
            !!warningMessage ?
              <h6 className="text-center">
                {warningMessage}
              </h6>
              :
              ""
          }
          <SyncLoader color={"#fcd46f"} loading={loadedModel} css={override} size={18} />
        </div>

        <a href="javascript:void(0)" className="modal-close" onClick={closeBlockModel}><img src="/streamer-app/assets/images/btn_close.png" /></a>

      </Modal>

      <Modal className="setting-modal" show={showSetting} onHide={() => setShowSetting(false)} backdrop="static" keyboard={false}>
        <div className="edit-profile-modal__inner">
          <h4 className="theme-txt text-center mb-4 ">Settings</h4>
          <div className="user-profile__options becomevip-wrapper__innerblock">
            <ul>
              {/* <li><a href="javascript:void(0)">
                <h6>Notification</h6>
                <i className="fas fa-chevron-right" />
              </a>
              </li> */}
              <li><a href="javascript:void(0)" onClick={() => history.push("/privacy-policy")}>
                <h6>Privacy</h6>
                <i className="fas fa-chevron-right" />
              </a></li>

              {/* <li><a href="javascript:void(0)">
                <h6>General</h6>
                <i className="fas fa-chevron-right" />
              </a>
              </li> */}
            </ul>
          </div>
          <div className="user-profile__options becomevip-wrapper__innerblock">
            <ul>
              {/* <li><a href="javascript:void(0)">
                <h6>Help Center</h6>
                <i className="fas fa-chevron-right" />
              </a>
              </li> */}
              <li><a href="javascript:void(0)" onClick={handleAbout}>
                <h6>About Glitters</h6>
                <i className="fas fa-chevron-right" />
              </a>
              </li>
              <li><a href="javascript:void(0)" onClick={handleShare}>
                <h6>Share Glitters</h6>
                <i className="fas fa-chevron-right" />
              </a>
              </li>
            </ul>
          </div>
          <div className="user-profile__options becomevip-wrapper__innerblock custom-checkbox">
            <ul>
              {/* <li>
                <h6>Lovense</h6>
                <div className="custom-checkbox__status">
                  <span className="checkbox-state">Active</span>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider" />
                  </label>
                </div>
              </li> */}
              <li>
                <h6>Spin Wheel</h6>
                <div className="custom-checkbox__status">
                  <span className="checkbox-state">{wheel ? "Active" : "Inactive"}</span>
                  <label className="switch">
                    <input type="checkbox" checked={wheel ? "checked" : ""} onChange={(e) => changeSpinWheel(e)} />
                    <span className="slider" />
                  </label>
                </div>
              </li>
              <li>
                <h6>Notifications</h6>
                <div className="custom-checkbox__status">
                  <span className="checkbox-state">{!!notificationChecked ? "Active" : "Inactive"}</span>
                  <label className="switch">
                    <input type="checkbox" checked={!!notificationChecked ? "checked" : ""} onChange={(e) => changeNotification(e)} />
                    <span className="slider" />
                  </label>
                </div>
              </li> 

              <li>
              <div className="block_countries" style={{display: "block", width: "100%"}}>
              <h6>Block countries</h6>
            

            <Select
              value={countrieBlock}
              onChange={(data) => changeCountries(data)}
              options={countrieList}
              isMulti={true}
            />
            <button className="btn bg-grd-clr" type="reset" onClick={blockCountries}>BLOCK</button>
          </div>
              </li>
              
            </ul>
          </div>
        </div>
        <a href="javascript:void(0)" className="modal-close" onClick={() => setShowSetting(false)}><img src="/streamer-app/assets/images/btn_close.png" /></a>

      </Modal>

      <Modal className="buy-coin-model" show={showBuyCoins} onHide={() => setShowBuyCoins(false)} >
        <div className="edit-profile-modal__inner">
          <h4 className="theme-txt text-center mb-4 ">Get coins</h4>

          <div className="membership-plans">
            {coinPackage.map((item, i) => (
              <div className="membership-plans__block  active mt-2">
                <a href="javascript:void(0)" className="justify-content-start" onClick={(e) => StripeCoinHandler(item.id)}>
                  <div className="buy-gifts__image">
                    <img src="/streamer-app/assets/images/diamond-sm.png" alt="diamond" />
                  </div>

                  <div className="buy-gifts_price text-white">
                    <h5 className="mb-0">{`${item.coins / 2}coins`}</h5>
                    <span className="rate">{`$${item.rates}.00`}</span>
                  </div>
                  {!!item.tags ? <span className='gift__discount'>{item.tags}</span> : ""}

                </a>
              </div>
            ))}
            <SyncLoader color={"#fcd46f"} loading={loadedModel} css={override} size={18} />
          </div>
          <a href="javascript:void(0)" className="modal-close" onClick={() => { setShowBuyCoins(false); setCoinPackage([]) }}><img src="/streamer-app/assets/images/btn_close.png" /></a>

        </div>

      </Modal>

      <Modal className="about-model" show={showAbout} onHide={() => setShowAbout(false)} >
        <h4 class="theme-txt text-center mb-4 ">About Glitter</h4>
        <AboutGlitter />
        <a href="javascript:void(0)" className="modal-close" onClick={() => setShowAbout(false)}><img src="/streamer-app/assets/images/btn_close.png" /></a>
      </Modal>

      <Modal className="privacy-model" show={showPrivacy} onHide={() => setShowPrivacy(false)} >
        <h4 className="theme-txt text-center mb-4 ">Privacy Policy</h4>
        <PrivacyPolicy />
        <a href="javascript:void(0)" className="modal-close" onClick={() => setShowPrivacy(false)}><img src="/streamer-app/assets/images/btn_close.png" /></a>

      </Modal>

      <Modal className="share-model" show={showShare} onHide={() => setShowShare(false)} >
        <h4 class="theme-txt text-center mb-4 ">Share Glitter</h4>
        <div className="share__icons d-flex justify-content-center">
          <div className="some-network">
            <FacebookShareButton url={shareUrl} quote={title} className="share-button" >
              <FacebookIcon round />
            </FacebookShareButton>
          </div>

          <div className="some-network">
            <TwitterShareButton url={shareUrl} title={title} className="share-button" >
              <TwitterIcon round />
            </TwitterShareButton>
          </div>

          <div className="some-network">
            <TelegramShareButton url={shareUrl} title={title} className="share-button">
              <TelegramIcon round />
            </TelegramShareButton>
          </div>

          <div className="some-network">
            <EmailShareButton url={shareUrl} subject={title} body="body" className="share-button">
              <EmailIcon round />
            </EmailShareButton>
          </div>


          <div className="some-network">
            <WhatsappShareButton url={shareUrl} title={title} separator=":: " className="share-button">
              <WhatsappIcon round />
            </WhatsappShareButton>
          </div>

        </div>
        <a href="javascript:void(0)" className="modal-close" onClick={() => setShowShare(false)}><img src="/streamer-app/assets/images/btn_close.png" /></a>

      </Modal>

      <div className={isOn ? 'all-gifts-wrapper active' : 'all-gifts-wrapper '} >
        <div className="all-gift-inner">
          <a href="javascript:void(0)" className="close-gift-btn modal-close" onClick={closeGiftModel}><img src="/streamer-app/assets/images/btn_close.png" /></a>
          <div className="all-gift-header d-flex flex-wrap align-items-center mb-3">
            <h5 className="mb-0 mr-4">Received Gift</h5>
            <div className="remaining-coins">
              <img src="/streamer-app/assets/images/diamond-coin.png" alt="Coins" />
              <span> {myCoins / 2}</span>
            </div>
          </div>
          <div className="all-gift-body">

            <ul className="d-flex flex-wrap text-center">
              {!!GiftData && GiftData.map((items, i) => {
                return <li >
                  <a href="javascript:void(0)" style={{ cursor: "default" }} >
                    <div>
                      <figure>
                        <img src={items.gift_image} alt={items.gift_name} />
                      </figure>
                      <div className="gift-price">
                        <img src="/streamer-app/assets/images/diamond-coin.png" alt="Coins" />
                        <span>{items.gift_coins / 2}</span>
                      </div>
                    </div>
                  </a>
                </li>
              })}

            </ul>
          </div>
          <SyncLoader color={"#fcd46f"} loading={loadedModel} css={override} size={18} />
        </div>

      </div>
    </div>


  )
}
export default Profile;



