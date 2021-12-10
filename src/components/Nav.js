import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { videoCall } from "../features/userSlice";

const NavLinks = () => {
  //  const {route} = useRouter()
  const location = useLocation()
  const dispatch = useDispatch();
  const history = useHistory();

  const [path, setPath] = useState("")

  let pathname = window.location.pathname;
  console.log(history,"jhxxeegu")

  useEffect(() => {
    // alert(location.pathname)
    // alert(window.location.href)
    pathname = window.location.pathname;
    // if (pathname !==)/chat   /searching-profile  /video-chat  /answer-calling
    if (pathname !== "/chat" &&
      pathname !== "/searching-profile" &&
      !pathname.match("/answer-calling") &&
      !pathname.match("/video-chat") &&
      !pathname.match("/audio-chat") &&
      !pathname.match("/live-video-chat")
    ) {
      localStorage.removeItem("is_streamer_calling")
      localStorage.removeItem("videoCallPageRefresh");
      localStorage.removeItem("endCall")
      dispatch(videoCall(null))
    }
    setPath(pathname)

  }, [window.location.pathname]);

  // useEffect(() => {
  //   return () => {
  //     // && history.location.pathname === "any specific path")
  //     if (history.action === "POP") {
  //       alert("pop")
  //       history.replace(history.location.pathname, /* the new state */);
  //     }
  //   };
  // }, [history])
useEffect(()=>{
return ()=>{
  if(location.pathname!="/searching-profile-call" && location.pathname!="/searching-profile"){
  localStorage.setItem("prevPage", location.pathname)
  }
}
},[])

const savePrevPage = () => {
  if (location.pathname !== "/") {
    localStorage.setItem("prevPage", location.pathname)
  }
}
  return (
    !path.match("/live-video-chat") && !path.match("/searching-profile") &&
    !path.match("/audio-chat") && !path.match("/video-chat") &&
    <ul className="feature-menu ml-auto">
      <li className={`${pathname === '/streamer-app' ? 'active' : ''}`}>
        <a href="/streamer-app" onClick={() => savePrevPage()}>
          <i className="fas fa-compass" />
          <span>Discover</span>
        </a>
      </li>
      {/* <li className={`${pathname.match('/searching-profile') ? 'active' : ''}`}>
                    <Link to="/searching-profile">
                     <i className="fas fa-video" />
                    <span>Video Chat</span>
                  </Link>
                </li> */}
      <li className={`${pathname === '/streamer-app/chat' ? 'active' : ''}`}>
        <Link to="/chat">
          <i className="fas fa-layer-group" />
          <span>Activity</span>
        </Link>
      </li>
      <li className={`${pathname === '/streamer-app/profile' ? 'active' : ''}`}>
        <Link to="/profile">
          <i className="fas fa-user" />
          <span>Profile</span>
        </Link>
      </li>
    </ul>
  )
}
export default NavLinks;



