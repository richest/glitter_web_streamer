import React, { useState, useEffect } from "react";
import { useHistory, useParams } from 'react-router';
import axios from "axios";
import NavLinks from '../components/Nav';
import { SOCKET } from "../components/Config";
import { useDispatch, useSelector } from "react-redux";
import { userProfile, videoCall } from "../features/userSlice";
import { changeImageLinkDomain, restrictBack } from "../commonFunctions";
import { NotificationManager } from "react-notifications";
// import useSound from 'use-sound'; 
// import boopSfx from '../sounds/ring-sound.mp3';

let pickVideoCallInterval, pickVideoCallCount = 0, userData;

const AnswerCalling = () => {
    const params = useParams();
    const dispatch = useDispatch();
    // const [play] = useSound(boopSfx);
    const [wait, setWait] = useState(true);
    const history = useHistory();
    userData = useSelector(userProfile).user.profile; //using redux useSelector here
    const receiverDetails = !!localStorage.getItem("receiverDetails") ? JSON.parse(localStorage.getItem("receiverDetails")) : null
    const senderDetails = !!localStorage.getItem("receiverDetails") ? JSON.parse(localStorage.getItem("receiverDetails")).sender_details : null
    console.log(receiverDetails, "kjshfiuyrutyfuyr")
    useEffect(() => {
        console.log(document.getElementById("my_audio"), "sdfg")
        document.getElementById("my_audio").play();
        pickVideoCallInterval = window.setInterval(() => {
            console.log(localStorage.getItem("receiverDetails"), "newwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww")
            pickVideoCallCount = pickVideoCallCount + 1;
            SOCKET.emit("check_pick_video_call_status", {
                type: receiverDetails.type,
                channel_name: params.channel_name,
                user_from_id: receiverDetails.user_from_id,
                user_to_id: receiverDetails.user_to_id,
                pickVideoCallCount
            })
        }, 1000)

        SOCKET.off('somebody_trying_to_contact_streamer').on('somebody_trying_to_contact_streamer', (data) => {
            localStorage.removeItem("is_streamer_calling")
            localStorage.removeItem("videoCallPageRefresh");
            localStorage.removeItem("endCall")
            // SOCKET.disconnect();
            dispatch(videoCall(null))
            if (!!userData && (data.user_to_id == userData.user_id)) { // check one-to-one data sync
              if (window.location.pathname.match("answer-calling")) {
                const page = "/streamer-app" + localStorage.getItem("prevPage")
                // NotificationManager.info("Clients are trying to reach you. Get Ready !!");
                // history.push(page)
                // window.location.replace(page)
                window.location.href = page;
              }
            }
      
            // if (!!userData && (data.user_from_id == userData.user_id)) { // check one-to-one data sync
            //     const page = "/chat";
            //     alert("Heavy traffic detected. Streamer is busy. Please try again !!")
            //     history.push(page)
            //     // window.location.href = page;
            // }
          })

        SOCKET.off('stop_pick_video_call_status').on("stop_pick_video_call_status", (data) => {
            if (!!userData && (data.user_to_id == userData.user_id)) { // check one-to-one data sync
                clearInterval(pickVideoCallInterval);
                pickVideoCallCount = 0;
            }
        })
        window.setTimeout(() => {
            setWait(false)
        }, 2000)

        restrictBack()
        return () => { 
            localStorage.removeItem("receiverDetails"); 
            document.getElementById("my_audio").pause();
            document.getElementById("my_audio").currentTime = 0;
        }
    }, [])
    const videoChatNow = () => {
        if (!wait) {
            if (!!receiverDetails && !receiverDetails.link.match("null")) {
                history.push(receiverDetails.link)
            }
            else {
                clearInterval(pickVideoCallInterval);
                pickVideoCallCount = 0;
                console.log(receiverDetails, "receiverDetails....")
                const page = "/streamer-app" + localStorage.getItem("prevPage")
                NotificationManager.info("Line is Busy. High Traffic !! Client can call you in no time...");
                history.push(page)
            }
        }
    }
    const rejectVideoChat = () => {
        if (!!receiverDetails) {
            SOCKET.emit("receiver_decline_video_call", {
                sender: { user_from_id: receiverDetails.user_from_id },
                reciever_id: receiverDetails.user_to_id,
                channel_name: params.channel_name,
                type: Number(receiverDetails.type),
                status: 2
            });
        }
    }
    return (
        <section className="home-wrapper">
            <div className="vc-screen-wrapper">
                <div className="vc-incoming-wrapper active">
                    <div className="vc-incoming-inner">
                        {/* <span className="btn-close" style={{ cursor: "pointer" }} onClick={rejectVideoChat}>×</span> */}
                        <div className="vc-ic-user text-center">
                            <figure>
                                {
                                    !!senderDetails ?
                                        <img src={changeImageLinkDomain() + senderDetails.profilePics} alt={senderDetails.firstName} />
                                        :
                                        <img src={changeImageLinkDomain() + "1611574536_download.jpg"} alt="placeholder" />
                                }
                                {
                                    !!senderDetails &&
                                    <figcaption><h4>{senderDetails.firstName + " " + senderDetails.lastName + ", " + senderDetails.age}</h4><span>{50 + "Km, " + senderDetails.occupation}</span></figcaption>
                                }
                                {
                                    !senderDetails &&
                                    <figcaption><h4> , </h4><span> km, </span></figcaption>
                                }
                            </figure>
                        </div>
                        <div className="vc-cta-btns d-flex flex-wrap align-items-center justify-content-center mt-4"><a
                            className="btn bg-grd-clr cta-accept" href="javascript:void(0)" onClick={videoChatNow}>{wait ? "Wait..." : "Accept"}</a>
                            {/* <a
                                className="btn btn-trsp cta-reject" href="javascript:void(0)" onClick={rejectVideoChat}>Reject</a> */}
                                
                            </div>
                    </div>
                </div>
            </div>
            {/* <button id="ringtone" onClick={play}>Boop!</button> */}
        </section>
    )
}
export default AnswerCalling;