
import React, { useState, useEffect } from "react";
import { addBodyClass } from '../components/CommonFunction';
import axios from "axios";
import { checkLiveDomain, restrictBack } from "../commonFunctions";

const SignupCompleted = (props) => {
  // Getting picture from prop
  var picture = props.location.mypicture;

  // Adding class to body with custom function
  addBodyClass('signup-completed-body')('login-body')

  // Setting image to imgData var
  if (typeof (picture) == "undefined") {
    var imgData = "/streamer-app/assets/images/profile-photo.png";
  }
  else {
    imgData = picture;
  }

  useEffect(() => {
    restrictBack()
  }, [])
  return (

    <section className="signup-wrapper">
      <img className="bg-mask" src="/streamer-app/assets/images/mask-bg.png" alt="Mask" />
      <div className="signup-page">
        <header>
          <div className="container">
            <div className="row">
              <div className="col">
                <nav className="navbar text-center">
                  <a className="navbar-brand mx-auto" href="javascript:void(0)">
                    <img src="/streamer-app/assets/images/glitters.png" alt="Glitters.png" />
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </header>
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-4 mx-auto text-center">
              <div className="signup-success-wrapper">
                <div className="signup-success-profile mb-4">
                  <figure>
                    <img src={imgData} alt="Profile Photo" />
                  </figure>
                </div>
                <div className="signup-success-content">
                  <div className="celebration-icons">
                    <img src="/streamer-app/assets/images/celebration-left.png" alt="Awesome" />
                    <img src="/streamer-app/assets/images/celebration-right.png" alt="Awesome" />
                  </div>
                  <h4 className="theme-txt">Awesome</h4>
                  <p>Your profile looks great, ready to look around.</p>
                  <a className="btn bg-grd-clr d-block" href={"/streamer-app/"}>Explore</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


  )
}
export default SignupCompleted;



