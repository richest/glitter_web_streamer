import moment from "moment"
import { useCallback, useState } from "react"

export const addDefaultSrc = (ev) => {
    ev.target.src = '/streamer-app/assets/images/image-placeholder.jpg'
}

export const returnDefaultImage = (ev) => {
    return '/streamer-app/assets/images/image-placeholder.jpg'
}

export const checkLiveDomain = () => {
    // if (window.location.hostname === "clickmystar.in") {
    return true
    // }
    // return false
}

export const changeImageLinkDomain = () => {
    // if (window.location.hostname === "clickmystar.in") {
    return "https://clickmystar.in/glitter-101/public/profile_images/"
    // }
    // return "http://167.172.209.57/glitter_node/glitter-101/public/profile_images/"
}

export const changeGiftLinkDomain = () => {
    // if (window.location.hostname === "clickmystar.in") {
    return "https://clickmystar.in/glitter-101/public/gifts_icons/"
    // }
    // return "http://167.172.209.57/glitter_node/glitter-101/public/gifts_icons/"
}

export const openNewWindow = (page) => {
    const host_name = window.location.hostname
    if (host_name === "clickmystar.in") {
        window.open('https://clickmystar.in' + page, 'PoP_Up', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,' + `height=${screen.height},width=${screen.width}`)
    }
    else {
        window.open('http://localhost:3002' + page, 'PoP_Up', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,' + `height=${screen.height},width=${screen.width}`)
    }

}

export const checkLoginRole = () => {
    return (!!localStorage.getItem("role_id") ? localStorage.getItem("role_id") : 0)
}

export const getCurrentDateTime = () => {
    return moment().format('L') + " " + moment().format('LT')
}

export function useForceUpdate() {
    const [, setTick] = useState(0);
    const update = useCallback(() => {
        setTick(tick => tick + 1);
    }, [])
    return update;
}

export const restrictBack = () => {
    console.log("restrict called...", window.location.href)
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
        window.history.go(1);
    };
}

export function removeVideoListRightClick() {
    // check for all videos and remove pip mode | controls
    window.setInterval(() => {    
      const all_videos = document.querySelectorAll("video");
      console.log(all_videos, "all_videos")
      all_videos.forEach((data) => { 
        $(data).attr('controlsList', 'nodownload');
        $(data).bind('contextmenu',function() { return false; });
        $(data).attr('disablePictureInPicture', 'true');
      })
    }, 250)
  }

  export function checkIfSwitchingTheApp() {
    const host = window.location.hostname;
    console.log(host, "host")
    // if (host.match("clickmystar.in/streamer-app") || host.match("clickmystar.in")) {

    // }
    // return true
}

export function fetchPreviousPage(location) {
    if (location.pathname != "/searching-profile-call" && location.pathname != "/searching-profile") {
        return localStorage.setItem("prevPage", location.pathname)
    }
}