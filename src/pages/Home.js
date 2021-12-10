import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router'

import { Profile } from '../pages'

import { audioCall, profile, randomMessageMe, selectUser, videoCall } from '../features/userSlice';
import NavLinks from '../components/Nav';
import Loader from '../components/Loader';
import axios from 'axios';
import Logo from '../components/Logo';
import $ from 'jquery';
import * as GlitterCard from "react-tinder-card";
import useToggle, { detectMob, isMobile, removeDublicateFrds } from '../components/CommonFunction';
import SyncLoader from "react-spinners/SyncLoader";
import { NotificationManager } from 'react-notifications';
import { css } from "@emotion/core";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Typography, Slider } from '@material-ui/core';
import { FILTER_LIST_API, LIKE_USER, DISLIKE_USER } from '../components/Api';
import { filterData } from '../features/userSlice';
import { addDefaultSrc, restrictBack, returnDefaultImage } from '../commonFunctions';
import { checkIfIamBusy } from '../api/videoApi';
import { v4 as uuidv4 } from 'uuid';

const alreadyRemoved = [];
let isMouseClick = false, startingPos = [], glitterUid, childRefs = [], cDetails = null;;

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


const useStyles = makeStyles({
  root: {
    backgroundcolor: '#f4c862',
    height: 5,
  },
});

const PrettoSlider = withStyles({
  root: {
    color: '#707070',
    height: 5,
    padding: 0,
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 5,
    backgroundColor: '#f4c862',
    borderRadius: 4,
  },
  rail: {
    height: 5,
    borderRadius: 4,
  },
})(Slider);

const Home = (props) => {

  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(selectUser); //using redux useSelector here
  const [fetchedProfile, setFilterUser] = useState([]);
  const [filterPage, setfilterPage] = useState(null)
  // const [mouseIsClicked, setmouseIsClicked] = useState("false");
  const [cardClick, setCardClick] = useState(false);
  const [totalCounts, setTotalCounts] = useState(null);
  const [cardStartPosition, setStartPosition] = useState([])
  const [userData, setUserData] = useState([]);
  // const [isOn, toggleIsOn] = useToggle(false);
  const [liked_clicked, setLiked] = useState(false);
  const [disliked_clicked, setDislike] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  // const filters = useSelector(filterDataUser); //using redux useSelector here


  // const handleUserData = () => {
  //   setIsLoaded(true);
  //   const bodyParameters = {
  //     session_id: localStorage.getItem("session_id"),
  //   };
  //   axios.post(GETALLUSER_API, bodyParameters)
  //     .then((response) => {
  //       setIsLoaded(false);
  //       if (response.status == 200) {
  //         setUserData(removeDublicateFrds(response.data.data));
  //       }
  //     },
  //       (error) => {
  //         // if (error.toString().match("403")) {
  //         //   localStorage.clear();
  //         //   history.push('/login');
  //         // }
  //         setIsLoaded(false);

  //       }
  //     );

  // };

  // Click here
  console.log(filterPage, "filterPage....")
  const handleUserId = (e, userId) => {

  }

  // const swiped = (direction, userId) => {
  //   if (direction == "left") {
  //     const bodyParameters = {
  //       session_id: localStorage.getItem("session_id"),
  //       user_id: userId,
  //     };
  //     axios.post(DISLIKE_USER, bodyParameters)
  //       .then(
  //         (response) => {
  //           setDislike(false);
  //           if (response.status == 200) {
  //           }
  //         },
  //         (error) => {
  //           // NotificationManager.error(error.message, "", 2000, () => { return 0 }, true);
  //           setDislike(false);
  //         }
  //       );
  //     const cardsLeft = fetchedProfile.filter(
  //       (currentUser) => !alreadyRemoved.includes(currentUser.user_id)
  //     );
  //     console.log(cardsLeft, "cardsLeft...")
  //     if (cardsLeft.length == 0) {
  //       setfilterPage(filterPage + 1)
  //     }
  //     alreadyRemoved.push(userId);
  //   } else if (direction == "right") {
  //     const bodyParameters = {
  //       session_id: localStorage.getItem("session_id"),
  //       user_id: userId,
  //     };
  //     axios.post(LIKE_USER, bodyParameters).then(
  //       (response) => {
  //         setLiked(false)
  //         if (response.status == 200) {
  //           setTimeout(() => {
  //             setLiked(false)
  //           }, 2);
  //         }
  //       },
  //       (error) => {
  //         // NotificationManager.error(error.message, "", 2000, () => { return 0 }, true);
  //         setLiked(false);
  //       }
  //     );
  //     const cardsLeft = fetchedProfile.filter(
  //       (currentUser) => !alreadyRemoved.includes(currentUser.user_id)
  //     );
  //     console.log(cardsLeft, "cardsLeft...")
  //     if (cardsLeft.length == 0) {
  //       setfilterPage(filterPage + 1)
  //     }
  //     alreadyRemoved.push(userId);
  //   }
  // };

  console.log(history,"jdnejdnej")
  const isLastPage = (total_counts, current_page) => {
    console.log(total_counts, current_page, "abccccccccc")
    let last_page = 1;
    if (Number.isInteger(total_counts / 10)) {
      if ((total_counts / 10) !== 0) {
        last_page = total_counts / 10;
      }
    }
    else {
      last_page = Number((total_counts / 10).toString().split(".")[0]) + 1;
    }
    if (last_page == current_page) {
      return true
    }
    return false
  }

  useEffect(() => {
    childRefs = Array(fetchedProfile.length).fill(0).map(i => React.createRef()), []
  }, [fetchedProfile])
  
  const swipe = (direction) => {
    const cardsLeft = fetchedProfile.filter(
      (currentUser) => !alreadyRemoved.includes(currentUser.random_user_id)
    );
    console.log(cardsLeft, "cardsLeft...")
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].random_user_id; // Find the card object to be removed
      const index = fetchedProfile
        .map((person) => person.random_user_id)
        .indexOf(toBeRemoved); // Find the index of which to make the reference to
      alreadyRemoved.push(toBeRemoved); // Make sure the next card gets removed next time if this card do not have time to exit the screen
      if (!!childRefs && childRefs[index] && !!childRefs[index].current) {
        childRefs[index].current.swipe(direction);
      }
      const new_index = index - 1;
      cDetails = !!fetchedProfile[new_index] ? fetchedProfile[new_index] : "over";
    }
    if (cardsLeft.length == 1) {
      if (isLastPage(totalCounts, filterPage)) {
        localStorage.setItem("filterPage", 1)
        setfilterPage(1)
      }
      else {
        localStorage.setItem("filterPage", filterPage + 1)
        setfilterPage(filterPage + 1)
      }
      // alert(cardsLeft.length)
    }
  };

  useEffect(() => {
    if (!!filterPage) {
      console.log(fetchedProfile ,"fetchedProfile...")
      // alert(filterPage)
      getIntialUser();
    }
  }, [filterPage])
  useEffect(() => {
    if (!!cardClick) {
      history.push('/' + glitterUid + '/single-profile')
    }
  }, [cardClick])
 
  useEffect(() => {
    setfilterPage(!!localStorage.getItem("filterPage") ? Number(localStorage.getItem("filterPage")) : 1)
    $(document).mousemove(function(){
      if($(".main_wrapper:hover").length != 0){
        console.log(cDetails, "sdgfg")
        if (!!cDetails && document.getElementById(cDetails.user_id)) {
          console.log(document.getElementById(cDetails.user_id), "sgdcfhdgh") 
          document.getElementById(cDetails.user_id).childNodes[0].style.setProperty('transition', 'none', 'important');
          document.getElementById(cDetails.user_id).childNodes[0].style.setProperty('transform', 'none', 'important');
        }
        // const allSwipes = document.querySelectorAll(".main_wrapper");
        // for (let i in allSwipes) {
        //   if (!!allSwipes[i].style) {
        //     allSwipes[i].childNodes[0].style.setProperty('transition', 'none', 'important');
        //     allSwipes[i].childNodes[0].style.setProperty('transform', 'none', 'important');
        //   }
        // }
    } else{
      // const allSwipes = document.querySelectorAll(".main_wrapper");
      // for (let i in allSwipes) {
      //   if (!!allSwipes[i].style) {
      //     allSwipes[i].childNodes[0].style.setProperty('transition', 'auto', 'important');
      //     allSwipes[i].childNodes[0].style.setProperty('transform', 'auto', 'important');
      //   }
      // }
    }
    });
    window.setTimeout(() => {
      $(".main_wrapper")
        .mousedown(function (evt) {
          isMouseClick = true;
          glitterUid = $(".main_wrapper")
          // setCardClick(isMouseClick)
          startingPos = [evt.pageX, evt.pageY]
          glitterUid = evt.currentTarget.id
          // setStartPosition(startingPos);
        })
        .mousemove(function (evt) {
          if (!(evt.pageX === startingPos[0] && evt.pageY === startingPos[1])) {
            isMouseClick = false;
          }
        })
        .mouseup(function () {
          if (!isMouseClick) {
            setCardClick(isMouseClick);
          } else {
            isMouseClick = true;
            setCardClick(isMouseClick);
          }
          startingPos = [];
          setStartPosition(startingPos);
        });
    }, 1000);
    restrictBack()
  }, []);

  function valuetextHeight(value) {
    return '${valueHeight}°C';
  }

  function valuetextAge(value) {
    return '${valueAge}°C';
  }

  function valuetextweight(value) {
    return '${valueweight}°C';
  }
  const filter = {
    gender: 2,
    age: { from: 18, to: 25 },
    distance: 5,
    height: { from: 100, to: 170 },
    weight: { from: 30, to: 60 }
  };
  const [valueHeight, setValueHeight] = useState([filter.height.from, filter.height.to]);
  const handleChangeHeight = (event, newValue) => {
    // setLoading('true');
    setValueHeight(newValue);
  };


  const [valueweight, setValueweight] = useState([filter.weight.from, filter.weight.to]);
  const handleChangeweight = (event, newValue) => {
    setValueweight(newValue);
  };

  const [valueAge, setValueAge] = useState([filter.age.from, filter.age.to]);
  const handleChangeAge = (event, newValue) => {
    setValueAge(newValue);
  };


  const [valueDistance, setValueDistance] = useState(filter.distance);
  const handleChangeDistance = (event, newValue) => {
    setValueDistance(newValue);

  };

  // Radio button value
  const [valueGender, setGender] = useState(filter.gender);
  const radioHandle = (e) => {
    setGender(e.target.value);
  }

  const [isLoading, setLoading] = useState();
  const [path, setPath] = useState('');

  const handleReset = (e) => {
    setGender(filter.gender);
    setValueDistance(filter.distance);
    setValueAge([filter.age.from, filter.age.to]);
    setValueHeight([filter.height.from, filter.height.to]);
    setValueweight([filter.weight.from, filter.weight.to]);
  }
  const currentStreamer = () => {
    const cardsLeft = fetchedProfile.filter(
      (currentUser) => !alreadyRemoved.includes(currentUser.random_user_id)
    );
    if (cardsLeft.length) {
      const toBeRemoved = cardsLeft[cardsLeft.length - 1].random_user_id; // Find the card object to be removed
      const index = fetchedProfile
        .map((person) => person.random_user_id)
        .indexOf(toBeRemoved); // Find the index of which to make the reference to
      // alreadyRemoved.push(toBeRemoved); // Make sure the next card gets removed next time if this card do not have time to exit the screen 

      if (!!childRefs && childRefs[index] && !!childRefs[index].current) {
        console.log(fetchedProfile[index], "dwjdwjdwdjw")
        return fetchedProfile[index]

      }
    }
    return null
  }
  const handleComment = () => {
    const currentStreamerActive = currentStreamer();
    if (currentStreamerActive) {
      dispatch(
        randomMessageMe({
          status: currentStreamerActive.user_id
        })
      );    
      history.push("/chat")
    }
  }
  const sendMeToVideoCall = () => {
    const currentStreamerActive = currentStreamer();
    if (currentStreamerActive) {
      if (!detectMob()) {
        const handleCallBtn = document.getElementById("handlecall");
        const handleVideoBtn = document.getElementById("handlevideo");
        handleCallBtn.style.pointerEvents = "none";
        handleVideoBtn.style.pointerEvents = "none";
        var secondUserDataId = currentStreamerActive.user_id;
        const bodyParameters = { session_id: localStorage.getItem("session_id"), to_user_id: secondUserDataId }
        checkIfIamBusy(bodyParameters, (iAmAvailable) => {
          handleCallBtn.style.pointerEvents = "all";
          handleVideoBtn.style.pointerEvents = "all";
          if (iAmAvailable == "recheck") {
            sendMeToVideoCall()
          }
          else {
            if (iAmAvailable) {
              const video_data = {
                user_from_id: localStorage.getItem("user_id"),
                user_to_id: secondUserDataId,
                user_to_image: currentStreamerActive.profile_images,
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
  }

  const handleAudioCall = () => {
    const currentStreamerActive = currentStreamer();

    if (currentStreamerActive) {
      if (!detectMob()) {
        const handleCallBtn = document.getElementById("handlecall");
        const handleVideoBtn = document.getElementById("handlevideo");
        handleCallBtn.style.pointerEvents = "none";
        handleVideoBtn.style.pointerEvents = "none";
        var secondUserDataId = currentStreamerActive.user_id;
        const bodyParameters = { session_id: localStorage.getItem("session_id"), to_user_id: secondUserDataId }
        checkIfIamBusy(bodyParameters, (iAmAvailable) => {
          handleCallBtn.style.pointerEvents = "all";
          handleVideoBtn.style.pointerEvents = "all";
          if (iAmAvailable == "recheck") {
            handleAudioCall()
          }
          else {
            if (iAmAvailable) {
              const audio_data = {
                user_from_id: localStorage.getItem("user_id"),
                user_to_id: secondUserDataId,
                user_to_image: currentStreamerActive.profile_images,
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
  }
  const getIntialUser = () => {
    // e.preventDefault();
    setLoading(true);
    const bodyParameters = {
      page: filterPage,
      session_id: localStorage.getItem('session_id'),
      age_from: "",
      show: "",
      age_to: "",
      distance: "",
      height_from: "",
      height_to: "",
      weight_from: "",
      weight_to: "",
      latitude: "",
      longitude: ""
    };
    axios.post(FILTER_LIST_API, bodyParameters)
      .then((response) => {
        setLoading(false);
        if (response.status == 200) {
          let filterCrds = response.data.data.reverse();
          for (let i in filterCrds) {
            filterCrds[i].random_user_id = uuidv4();
          }
          setTotalCounts(response.data.total_record);
          setFilterUser(filterCrds);
          dispatch(
            filterData({
              filterData: response.data.data
            })
          );

          const new_index = (filterCrds).length - 1;
          cDetails = !!filterCrds[new_index] ? filterCrds[new_index] : "over";

          setTimeout(() => {
          }, 600);
        }
        else {
        }
      }, (error) => {
        setLoading(false);
        if (error.toString().match("403")) {
          localStorage.clear();
          history.push('/login');
        }
      });
  }

  const filterHandle = (e) => {
    if (!!e)
      e.preventDefault();
    setLoading(true);
    const bodyParameters = {
      session_id: localStorage.getItem('session_id'),
      age_from: valueAge[0],
      show: valueGender.toString(),
      age_to: valueAge[1],
      distance: valueDistance,
      height_from: valueHeight[0],
      height_to: valueHeight[1],
      weight_from: valueweight[0],
      weight_to: valueweight[1],
      latitude: "",
      longitude: ""
    };
    axios.post(FILTER_LIST_API, bodyParameters)
      .then((response) => {
        setLoading(false);
        if (response.status == 200) {
          setFilterUser(removeDublicateFrds(response.data.data));
          dispatch(
            filterData({
              filterData: removeDublicateFrds(response.data.data)
            })
          );
          setTimeout(() => {
          }, 600);
        } else {
        }
      }, (error) => {
        setLoading(false);
        if (error.toString().match("403")) {
          
          localStorage.clear();
          history.push('/login');
      }
        // localStorage.clear();
      });
  }

  const handleButton = () => {
    const pathname = window.location.pathname;
    setPath(pathname);
  }
  useEffect(() => {
    // filterHandle();
    handleButton();
  }, [])

  const handleChat = () => {
    history.push("/search-home");
  }
  useEffect(() => {
    $(".show-filter").click(function () {
      $(".option-bar").toggleClass("filter-active");
    });
  }, [])

  const reload = () => {
    if (filterPage == 1) {
      setFilterUser([])
      getIntialUser() 
    }
    else {
      localStorage.setItem("filterPage", 1)
      setfilterPage(1)
    }
  }
  
  return (
    <section className="home-wrapper h-100">
      {/* <Loader isLoading={isLoading} />  */}

      <div className="home-inner h-100">
        <div className="container-fluid p-0 h-100">
          <div className="row no-gutters h-100">
            <div className="col-lg-3 option-bar p-3 vh-100 position-fixed">
              <div className="logo-tab mb-5 d-flex justify-content-between align-items-start">
                <Logo />
                {
                  isMobile() &&
                  <button className={isLoading ? "btn bg-grd-clr reload-mobile disable-btn" : "btn bg-grd-clr reload-mobile"} type="button" onClick={reload}>
                    <i class="fa fa-undo"></i> RELOAD</button>
                }
                <a className="show-filter" href="javascript:void(0)"><img src="/streamer-app/assets/images/Filter.png" alt="filter" /></a>
                {/* <span className="chat-point position-relative">
                  <a href="javascript:void(0)" onClick={handleChat}>
                    <i className="fas fa-comment" />
                  </a>
                </span> */}

                <div class="live-icon-top" onClick={handleChat}>
                  <img src="/streamer-app/assets/images/live.png" alt="Live" style={{cursor: "pointer"}} />
                </div>

              </div>

              {/* Sidebar filter */}

              <div className="filter-tab">

                {/* <Loader isLoading={isLoading} /> */}
                <h4 className="mb-4">Filter</h4>
                <form action="#" method="post" className="form" >
                  <div className="tab-title">
                    <h5>Show Me</h5>
                  </div>
                  <div className="show-gender ft-block d-flex flex-wrap justify-content-between" onChange={radioHandle}>
                    <div className="form-group">
                      <input type="radio" name="gender" value={1} id="man" />
                      <label htmlFor="man">Man</label>
                    </div>
                    <div className="form-group">
                      <input type="radio" defaultChecked name="gender" value={2} id="woman" />
                      <label htmlFor="woman">Woman</label>
                    </div>
                    <div className="form-group">
                      <input type="radio" name="gender" value={"1,2"} id="both" />
                      <label htmlFor="both">Both</label>
                    </div>
                  </div>
                  <div className="age-group ft-block">
                    <div className="tab-title">
                      <h5>Age</h5>
                    </div>

                    <Typography id="age" className="two-range"  >
                      {`+${valueAge[0]} - ${valueAge[1]}`}
                    </Typography>
                    <PrettoSlider value={valueAge} min={18} max={50} onChange={handleChangeAge} valueLabelDisplay="auto"
                      aria-labelledby="range-slider" getAriaValueText={valuetextAge} />

                  </div>

                  <div className="distance-group ft-block">
                    <div className="tab-title">
                      <h5>Distance</h5>
                    </div>
                    <div className="range-slider">
                      <Typography id="distance" className="two-range"  >
                        {`${valueDistance} miles`}
                      </Typography>
                      <PrettoSlider value={valueDistance} max={10} onChange={handleChangeDistance} valueLabelDisplay="auto"
                        aria-labelledby="range-slider" aria-labelledby="continuous-slider" />
                    </div>
                  </div>
                  <div className="height-group ft-block">
                    <div className="tab-title">
                      <h5>Height</h5>
                      {/*                                    <span class="point-calcu">1.60-1.78m</span>*/}
                    </div>
                    <Typography id="Height" className="two-range"  >
                      {`${valueHeight[0]} - ${valueHeight[1]} cm`}
                    </Typography>

                    <PrettoSlider value={valueHeight} min={130} max={200} onChange={handleChangeHeight} valueLabelDisplay="auto"
                      aria-labelledby="range-slider" getAriaValueText={valuetextHeight} />

                  </div>
                  <div className="weight-group ft-block">
                    <div className="tab-title">
                      <h5>Weight</h5>
                      {/*                                    <span class="point-calcu">50-65kg</span>*/}
                    </div>
                    <Typography id="weight" className="two-range"  >
                      {`${valueweight[0]} - ${valueweight[1]} kg`}
                    </Typography>

                    <PrettoSlider value={valueweight} onChange={handleChangeweight} valueLabelDisplay="auto"
                      aria-labelledby="range-slider" min={30}
                      max={100} getAriaValueText={valuetextweight} />
                  </div>
                  <div className="btns-group d-flex justify-content-between flex-wrap my-5">
                    {path == "/streamer-app" ? <> <button className="btn bg-grd-clr" id="done-filter" type="submit" disabled onClick={filterHandle}>Done</button>
                      <button className="btn bg-grd-clr" type="reset" disabled onClick={handleReset}>Reset</button></>

                      : path == "/streamer-app/search-home" ? <> <button className="unknown-home btn bg-grd-clr" type="submit" disabled>Done</button>
                        <button className="unknown-home btn bg-grd-clr" type="reset" disabled>Reset</button></>

                        : <> <button className="unknown-home btn bg-grd-clr" disabled type="submit" onClick={filterHandle}>Done</button>
                          <button className="unknown-home btn bg-grd-clr" disabled type="reset" onClick={handleReset}>Reset</button></>}
                  </div>
                </form>
              </div>

              {/* End filter here */}
            </div>
            <div className="col-lg-9 main-bar p-3" style={{ marginLeft: '25%' }}>
              <div className="tab-top d-flex flex-wrap">
                {/* <div className="live-icon">
                    <img src="/streamer-app/assets/images/live.png" alt="Live" />
                  </div> */}
                  {
                  !isMobile() &&
                  <button className={isLoading ? "btn bg-grd-clr reload-web disable-btn" : "btn bg-grd-clr reload-web"} type="button" onClick={reload}>
                    <i class="fa fa-undo"></i> RELOAD</button>
                }
                <NavLinks />
              </div>
              <div className="profile-swipe-wrapper">
                <div className="cardContainer">
                  {fetchedProfile.map((currentUser, index) => (
                      <div className="main_wrapper" id={currentUser.user_id} >
                      <GlitterCard
                        ref={childRefs[index]}
                        // flickOnSwipe={true}
                        preventSwipe={['right', 'left', 'up', 'down']}
                        className="swipe"
                        id="swipe"
                        key={currentUser.user_id}
                        // onSwipe={(dir) => swiped(dir, currentUser.user_id)}
                         >
                        <div className="user__card position-relative">
                          {liked_clicked ? <div className="accept__user"><img src="/streamer-app/assets/images/accept-icon.png" width="auto" height="auto" /></div> : ""}
                          {disliked_clicked ? <div class="accept__user"><img src="/streamer-app/assets/images/country-close.svg" width="auto" height="auto" /></div> : ""}
                          <img onError={(e) => addDefaultSrc(e)} src={!!currentUser.profile_images ? (currentUser.profile_images).replace("clickmystar.in", "clickmystar.in") : returnDefaultImage()} alt={currentUser.name} width="100%" />
                          <div className="card-titles">
                            <h3>
                              {currentUser.name}, {currentUser.age}
                            </h3>
                            <span>
                              {currentUser.distance}{currentUser.occupation != "" ? " , " : ""}{currentUser.occupation}
                            </span>
                          </div>
                        </div>
                      </GlitterCard>
      
                    </div>
                  
                  ))}
                  <SyncLoader color={"#fcd46f"} loading={isLoaded} css={override} size={18} />

                </div>

                {
                  !isLoaded &&
                  <div className="action-tray global-actions d-flex flex-wrap justify-content-center align-items-center mt-3">
                    <div className="close-btn tray-btn-s">
                      <a className="left-action" href="javascript:void(0)" onClick={() => swipe("left")}>×</a>
                    </div>
                     <div className="chat tray-btn-l">
            <a href="javascript:void(0)" onClick={handleComment}>
                <i className="fas fa-comment"></i>
            </a>
        </div>
        <div className="audio-chat tray-btn-l">
                      <a className="bg-grd-clr mr-3" id="handlecall" href="javascript:void(0)" onClick={() => handleAudioCall()}>
                        <i className="fas fa-phone-alt" /></a>
                    </div>
                    <div className="video-chat tray-btn-l">
                      <a href="javascript:void(0)" id="handlevideo" onClick={sendMeToVideoCall}>
                        <i className="fas fa-video"></i>
                      </a>
                    </div>
                    <div className="like-profile tray-btn-s">
                      <a className="right-action" href="javascript:void(0)" onClick={() => swipe("right")}>
                        <i className="fas fa-heart"></i>
                      </a>
                    </div>

                    {/* <div className="close-btn tray-btn-s">
                        <a className="left-action" href="javascript:void(0)" onClick={swiped} >×</a>
                      </div>
                      <div className="like-profile tray-btn-s">
                        <a className="right-action" href="javascript:void(0)" onClick={swiped} >
                          <i className="fas fa-heart" />
                        </a>
                      </div> */}
                  </div>
                }

              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )

}

export default Home;
