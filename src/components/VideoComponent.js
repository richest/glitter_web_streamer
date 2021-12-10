// import AgoraRTC from "agora-rtc-sdk";
// const {parse, stringify} = require('flatted/cjs');

// let changeRtcStorage = (obj) => {
//     rtc = obj;
//     localStorage.setItem("rtc", stringify(obj))
// }

// const rtcLocal = localStorage.getItem("rtc");
// var rtc = !!rtcLocal ? parse(rtcLocal) : changeRtcStorage({
//     client: null,
//     joined: false,
//     published: false,
//     localStream: null,
//     remoteStreams: [],
//     params: {}
// })
// // Options for joining a channel
// // let url = new URL(window.location.href)
// // let params = new URLSearchParams(url.search);

// export function joinChannel(role, option, volume, is_aud) {
//     console.log(AgoraRTC, "AgoraRTC")
//     // Create a client
//     rtc.client = AgoraRTC.createClient({ mode: "live", codec: "h264" });
//     changeRtcStorage(rtc)
//     // Initialize the client
//     rtc.client.init(option.appID, function () {
//         console.log(rtc.client, "rtc.client")
//         // Join a channel
//         rtc.client.join(option.token ?
//             option.token : null,
//             option.channel, option.uid ? +option.uid : null, function (uid) {

//                 rtc.params.uid = uid;
//                 changeRtcStorage(rtc)
//                 if (role === "host") {
//                     rtc.client.setClientRole("host");
//                     // Create a local stream
//                     rtc.localStream = AgoraRTC.createStream({
//                         streamID: rtc.params.uid,
//                         audio: true,
//                         video: true,
//                         screen: false,

//                     })
//                     rtc.localStream.setVideoProfile("240p_4")
//                     // Initialize the local stream
//                     rtc.localStream.init(function () {
//                         if (is_aud == "i_am_aud") {
//                             if (volume) {
//                                 rtc.localStream.setAudioVolume(100);
//                             }
//                             else {
//                                 rtc.localStream.setAudioVolume(0);
//                             }
//                         }
//                         else {
//                             rtc.localStream.setAudioVolume(100);
//                         }
                        
//                         rtc.localStream.play("local_stream");
//                         rtc.client.publish(rtc.localStream, function (err) {
//                             console.error(err);
//                         })
//                     }, function (err) {
//                         console.error("init local stream failed ", err);
//                     });
//                     rtc.client.on("connection-state-change", function (evt) {
//                     })
//                     changeRtcStorage(rtc)
//                 }
//                 if (role === "audience") {
//                     rtc.client.on("connection-state-change", function (evt) {
//                     })
//                     rtc.client.on("stream-added", function (evt) {

//                         var remoteStream = evt.stream;
//                         var id = remoteStream.getId();
//                         if (id !== rtc.params.uid) {
//                             // removeView(id)
//                             rtc.client.subscribe(remoteStream, function (err) {
//                             })
//                         }
//                     });
//                     rtc.client.on("stream-removed", function (evt) {
//                         var remoteStream = evt.stream;
//                         var id = remoteStream.getId();
//                         remoteStream.close();
//                     });
//                     rtc.client.on("stream-subscribed", function (evt) {
//                         var remoteStream = evt.stream;
//                         var id = remoteStream.getId();
//                         remoteStream.play("remote_video_");
//                         remoteStream.setAudioVolume(100);
//                     })
//                     rtc.client.on("stream-unsubscribed", function (evt) {
//                         var remoteStream = evt.stream;
//                         var id = remoteStream.getId();
//                         remoteStream.pause("remote_video_");
//                     })
//                     changeRtcStorage(rtc)
//                 }
//             }, function (err) {
//                 console.error("client join failed", err)
//             })
//     }, (err) => {
//         console.error(err);
//     });
// }


// export function joinChannelAudio(role, option, volume, is_aud) {
//     // Create a client
//     rtc.client = AgoraRTC.createClient({ mode: "live", codec: "h264" });
//     changeRtcStorage(rtc)
//     // Initialize the client
//     rtc.client.init(option.appID, function () {
//         // Join a channel
//         rtc.client.join(option.token ?
//             option.token : null,
//             option.channel, option.uid ? +option.uid : null, function (uid) {

//                 rtc.params.uid = uid;
//                 changeRtcStorage(rtc)
//                 if (role === "host") {
//                     rtc.client.setClientRole("host");
//                     // Create a local stream
//                     rtc.localStream = AgoraRTC.createStream({
//                         streamID: rtc.params.uid,
//                         audio: true,
//                         video: false,
//                         screen: false,
//                     })
//                     rtc.localStream.setVideoProfile("240p_4")
//                     // Initialize the local stream
//                     rtc.localStream.init(function () {
//                         if (is_aud == "i_am_aud") {
//                             if (volume) {
//                                 rtc.localStream.setAudioVolume(100);
//                             }
//                             else {
//                                 rtc.localStream.setAudioVolume(0);
//                             }
//                         }
//                         else {
//                             rtc.localStream.setAudioVolume(100);
//                         }
                        
//                         rtc.localStream.play("local_stream");
//                         rtc.client.publish(rtc.localStream, function (err) {
//                             console.error(err);
//                         })
//                     }, function (err) {
//                         console.error("init local stream failed ", err);
//                     });
//                     rtc.client.on("connection-state-change", function (evt) {
//                     })
//                     changeRtcStorage(rtc)
//                 }
//                 if (role === "audience") {
//                     rtc.client.on("connection-state-change", function (evt) {
//                     })
//                     rtc.client.on("stream-added", function (evt) {
//                         var remoteStream = evt.stream;
//                         var id = remoteStream.getId();
//                         if (id !== rtc.params.uid) {
//                             // removeView(id)
//                             rtc.client.subscribe(remoteStream, function (err) {
//                             })
//                         }
//                     });
//                     rtc.client.on("stream-removed", function (evt) {
//                         var remoteStream = evt.stream;
//                         var id = remoteStream.getId();
//                         remoteStream.close();
//                     });
//                     rtc.client.on("stream-subscribed", function (evt) {
//                         var remoteStream = evt.stream;
//                         var id = remoteStream.getId();
//                         remoteStream.play("remote_video_");
//                         remoteStream.setAudioVolume(100);
//                     })
//                     rtc.client.on("stream-unsubscribed", function (evt) {
//                         var remoteStream = evt.stream;
//                         var id = remoteStream.getId();
//                         remoteStream.pause("remote_video_");
//                     })
//                     changeRtcStorage(rtc)
//                 }
//             }, function (err) {
//                 console.error("client join failed", err)
//             })
//     }, (err) => {
//         console.error(err);
//     });
// }

// export function leaveEventHost(params) {
//     if (!!rtc.client) {
//         alert(stringify(rtc))
//         // rtc.client.unpublish(rtc.localStream, function (err) {
//         //     console.error(err);
//         // })
//         // rtc.client.leave(function (ev) {
//         // })
//     }

// }
// export function leaveEventAudience(params) {
//     if (!!rtc.client) {
//     // rtc.client.leave(function () {
//     //     //……
//     // }, function (err) {
//     //     //error handling
//     // })
// }
// }


import AgoraRTC from "agora-rtc-sdk";
var rtc = {
    client: null,
    joined: false,
    published: false,
    localStream: null,
    remoteStreams: [],
    params: {}
};
// Options for joining a channel
// let url = new URL(window.location.href)
// let params = new URLSearchParams(url.search);


export function joinChannel(role, option, volume, is_aud) {
    console.log(AgoraRTC, "AgoraRTC")
    // Create a client
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "h264" });
    // Initialize the client
    rtc.client.init(option.appID, function () {
        console.log(rtc.client, "rtc.client")
        // Join a channel
        rtc.client.join(option.token ?
            option.token : null,
            option.channel, option.uid ? +option.uid : null, function (uid) {

                rtc.params.uid = uid;
                if (role === "host") {
                    rtc.client.setClientRole("host");
                    // Create a local stream
                    rtc.localStream = AgoraRTC.createStream({
                        streamID: rtc.params.uid,
                        audio: true,
                        video: true,
                        screen: false,

                    })
                    rtc.localStream.setVideoProfile("240p_4")
                    // Initialize the local stream
                    rtc.localStream.init(function () {
                        if (is_aud == "i_am_aud") {
                            if (volume) {
                                rtc.localStream.setAudioVolume(100);
                            }
                            else {
                                rtc.localStream.setAudioVolume(0);
                            }
                        }
                        else {
                            rtc.localStream.setAudioVolume(100);
                        }
                        
                        rtc.localStream.play("local_stream");
                        rtc.client.publish(rtc.localStream, function (err) {
                            console.error(err);
                        })
                    }, function (err) {
                        console.error("init local stream failed ", err);
                    });
                    rtc.client.on("connection-state-change", function (evt) {
                    })
                }
                if (role === "audience") {
                    rtc.client.on("connection-state-change", function (evt) {
                    })
                    rtc.client.on("stream-added", function (evt) {

                        var remoteStream = evt.stream;
                        var id = remoteStream.getId();
                        if (id !== rtc.params.uid) {
                            // removeView(id)
                            rtc.client.subscribe(remoteStream, function (err) {
                            })
                        }
                    });
                    rtc.client.on("stream-removed", function (evt) {
                        var remoteStream = evt.stream;
                        var id = remoteStream.getId();
                        remoteStream.close();
                    });
                    rtc.client.on("stream-subscribed", function (evt) {
                        var remoteStream = evt.stream;
                        var id = remoteStream.getId();
                        remoteStream.play("remote_video_");
                        remoteStream.setAudioVolume(100);
                    })
                    rtc.client.on("stream-unsubscribed", function (evt) {
                        var remoteStream = evt.stream;
                        var id = remoteStream.getId();
                        remoteStream.pause("remote_video_");
                    })
                }
            }, function (err) {
                console.error("client join failed", err)
            })
    }, (err) => {
        console.error(err);
    });
}


export function joinChannelAudio(role, option, volume, is_aud) {
    // Create a client
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "h264" });
    // Initialize the client
    rtc.client.init(option.appID, function () {
        // Join a channel
        rtc.client.join(option.token ?
            option.token : null,
            option.channel, option.uid ? +option.uid : null, function (uid) {

                rtc.params.uid = uid;
                if (role === "host") {
                    rtc.client.setClientRole("host");
                    // Create a local stream
                    rtc.localStream = AgoraRTC.createStream({
                        streamID: rtc.params.uid,
                        audio: true,
                        video: false,
                        screen: false,
                    })
                    rtc.localStream.setVideoProfile("240p_4")
                    // Initialize the local stream
                    rtc.localStream.init(function () {
                        if (is_aud == "i_am_aud") {
                            if (volume) {
                                rtc.localStream.setAudioVolume(100);
                            }
                            else {
                                rtc.localStream.setAudioVolume(0);
                            }
                        }
                        else {
                            rtc.localStream.setAudioVolume(100);
                        }
                        
                        rtc.localStream.play("local_stream");
                        rtc.client.publish(rtc.localStream, function (err) {
                            console.error(err);
                        })
                    }, function (err) {
                        console.error("init local stream failed ", err);
                    });
                    rtc.client.on("connection-state-change", function (evt) {
                    })
                }
                if (role === "audience") {
                    rtc.client.on("connection-state-change", function (evt) {
                    })
                    rtc.client.on("stream-added", function (evt) {
                        var remoteStream = evt.stream;
                        var id = remoteStream.getId();
                        if (id !== rtc.params.uid) {
                            // removeView(id)
                            rtc.client.subscribe(remoteStream, function (err) {
                            })
                        }
                    });
                    rtc.client.on("stream-removed", function (evt) {
                        var remoteStream = evt.stream;
                        var id = remoteStream.getId();
                        remoteStream.close();
                    });
                    rtc.client.on("stream-subscribed", function (evt) {
                        var remoteStream = evt.stream;
                        var id = remoteStream.getId();
                        remoteStream.play("remote_video_");
                        remoteStream.setAudioVolume(100);
                    })
                    rtc.client.on("stream-unsubscribed", function (evt) {
                        var remoteStream = evt.stream;
                        var id = remoteStream.getId();
                        remoteStream.pause("remote_video_");
                    })
                }
            }, function (err) {
                console.error("client join failed", err)
            })
    }, (err) => {
        console.error(err);
    });
}

export function leaveEventHost(params) {
    if (!!rtc.client) {
        rtc.client.unpublish(rtc.localStream, function (err) {
            console.error(err);
        })
        rtc.client.leave(function (ev) {
        })
    }

}
export function leaveEventAudience(params) {
    if (!!rtc.client) {
    rtc.client.leave(function () {
        //……
    }, function (err) {
        //error handling
    })
}
}
