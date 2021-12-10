import { format } from 'date-fns';
import { useDispatch } from 'react-redux';
import { login, profile } from '../features/userSlice';
import React, { useState, useEffect, useRef } from "react";
// import DateFnsUtils from '@date-io/date-fns';
import { useHistory } from 'react-router'
import axios from "axios";
import DatePicker from 'react-date-picker';
import moment from 'moment'
import { addBodyClass, detectMob } from '../components/CommonFunction';
import { getCountries } from '../components/Countries';
import LoginSidebar from '../components/LoginSidebar';
import { SENDOTP_API, VERIFY_API, SIGNUP_API } from '../components/Api';
import $ from 'jquery';
import { FacebookProvider, Like, LoginButton } from 'react-facebook';
import { usePosition } from 'use-position';
import OtpInput from 'react-otp-input';
import { NotificationManager } from 'react-notifications';
import { GoogleLogin } from 'react-google-login';
import TwitterLogin from 'react-twitter-auth';
import { SOCKET } from '../components/Config';
import { Scrollbars } from 'react-custom-scrollbars';
import { Modal } from 'react-bootstrap';
import TermPolicy from '../components/TermPolicy';
import { restrictBack } from '../commonFunctions';

// Working on login functional component
const Login = () => {
  if (localStorage.getItem("session_id")) {
    window.location.href = "/streamer-app/"
  }
  const { latitude, longitude, speed, timestamp, accuracy, error } = usePosition();
  const openRegisterFile = useRef();
  // Adding class to body with custom function
  addBodyClass('login-body')('')
  const [step, setStep] = useState(1);
  const history = useHistory();

  const dispatch = useDispatch();
  //  const config = {  
  //     headers: { Authorization: `Bearer ${token}` }
  //   };

  const [phoneNumber, setPhone] = useState('');   //For past users
  const [cntCode, setCntCode] = useState('57');
  const [cntCodeName, setCntCodeName] = useState('co');   //For past users



  // Only numbers allowed
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
  };

  const changeCountry = (e) => {
    const target = e.target;
    setCntCode(target.getAttribute("data-cid"))
    setCntCodeName(target.getAttribute("data-code"))
  }

  // OTP fields in state
  const [otp_1, setOtp1] = useState('');
  const [otp_2, setOtp2] = useState('');
  const [otp_3, setOtp3] = useState('');
  const [otp_4, setOtp4] = useState('');

  // All form fields
  const [otp, setOtp] = useState('');
  const [Dob, setDob] = useState();
  const [FirstName, setFirst] = useState('');
  const [LastName, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [genderName, setGender] = useState('');
  const [agencyCode, setAgencyCode] = useState("")
  const [picture, setPicture] = useState(null);
  const [imgData, setImgData] = useState(null);
  const [phoneErr, setPhoneErr] = useState({});
  const [firstErr, setFirstErr] = useState({});
  const [lastErr, setLastErr] = useState({});
  const [dobErr, setDobErr] = useState({});
  const [emailErr, setEmailErr] = useState({});
  const [genderErr, setGenderErr] = useState({});
  const [agencyCodeErr, setAgencyCodeErr] = useState({});
  const [termPolicyErr, setTermPolicyErr] = useState({});
  const [clickTerm, setClickTerm] = useState(true);
  const [termPolicyModel , setTermPolicyModel] =useState(false)
  const dates = moment(Dob).format('YYYY/MM/DD');

  {/* { divToggle ? "signup-inner" : "signup-inner active-tab-2"} */ }
  //  Setting value here radio button
  const handleChange = e => {
    setGender(e.target.value);
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
  };

  // Managing token here 
  const tokencheck = () => {

    const token = localStorage.getItem('session_id');
    if (token != null) {
      history.push("/");
    }
    else {
      localStorage.clear();
    }
  }
  //  useEffect(() => {
  //     tokencheck();
  //   });


  // Send OTP handle
  const sendHandle = () => {

    const isValid = formValidation();

    if (isValid) {
      const bodyParameters = {
        phone: phoneNumber,
        country_code: '+' + cntCode,
        user_type: 2
      };
      axios.post(SENDOTP_API, bodyParameters)
        .then((response) => {
          if (!response.data.error && response.data.status_code == 200) {
            setStep(step + 1)
          }
          else {
            NotificationManager.error(response.data.message);
          }
        }, (error) => {
          NotificationManager.error(error.message);
        });
    }
  }

  //resend otp
  const handleResend = () => {
    const bodyParameters = {
      phone: phoneNumber,
      country_code: '+' + cntCode,
      user_type: 2
    };
    axios.post(SENDOTP_API, bodyParameters)
      .then((response) => {
        if (!response.data.error && response.data.status_code == 200) {
          NotificationManager.success(response.data.message);
        }
        else {
          NotificationManager.error(response.data.message);
        }
      }, (error) => {
        NotificationManager.error(error.message);
      });
  }
  const handleNextClick = () => {
    const Valid = registrationvalidation();
    if (Valid) {
      setStep(step + 1)
    }
  }
  const registrationvalidation = () => {
    const firstErr = {};
    const lastErr = {};
    const dobErr = {};
    const genderErr = {};
    const emailErr = {};
    const agencyCodeErr = {}
    let Valid = true;
    if (FirstName.length == "") {
      firstErr.firstShort = "First name is Empty";
      Valid = false;
    }

    if (LastName.length == "") {
      lastErr.lastShort = "Last name is empty"
      Valid = false;
    }

    if (Dob == null) {
      dobErr.dobShort = "date of birth is empty"
      Valid = false;
    }
    if (genderName == "") {
      genderErr.genderShort = "select the gender"
      Valid = false;
    }
    if (email == "") {
      emailErr.emailShort = "Email is Empty"
      Valid = false;
    }

    if (agencyCode == "") {
      agencyCodeErr.agencyShort = "Agency code is Empty"
      Valid = false;
    }
    setFirstErr(firstErr);
    setLastErr(lastErr);
    setDobErr(dobErr);
    setGenderErr(genderErr);
    setAgencyCodeErr(agencyCodeErr)
    setEmailErr(emailErr)
    return Valid;
  }

  const formValidation = () => {
    const phoneErr = {};
    const termPolicyErr = {};
    let isValid = true;

    if (phoneNumber.length == "") {
      phoneErr.phoneShort = "Phone number is Empty";
      isValid = false;
    }
    if (clickTerm == false) {
      termPolicyErr.termShort = "Please accept term and condition";
      isValid = false;
    }

    setPhoneErr(phoneErr);
    setTermPolicyErr(termPolicyErr);
    return isValid;
  }

  //  var otp = otp_1+otp_2+otp_3+otp_4;
  // Verify OTP Function 
  const verifyHandle = () => {

    const bodyParameters = {
      phone: phoneNumber,
      country_code: '+' + cntCode,
      otp: otp,
      device_type: 0,
      device_token: "",
    };

    axios.post(VERIFY_API, bodyParameters)
      .then((response) => {
        if (response.data.status_code === 200 && !response.data.error) {
        if (response.data.data != null) {
          localStorage.setItem('session_id', response.data.data.session_id);
          history.push("/");
          console.log(response.data.data, "resppppppppppppppppppppp")
          localStorage.setItem("socket_id", SOCKET.id)
          localStorage.setItem("role_id", response.data.data.role_id)
          localStorage.setItem("user_id", response.data.data.user_id)
          SOCKET.emit('establish_socket_connection', { "u_id": response.data.data.user_id, socket_id: SOCKET.id });
          SOCKET.connect()
          dispatch(
            login({
              logged: response.data.data,
              loggedIn: true,
            })
          );
          dispatch(profile({ profile: response.data.data }))
        }
        else {
          const ifvalid = otpValidation();
          if (ifvalid) {
            setStep(step + 1)
            localStorage.clear();
          }

        }
      }
      else {
        NotificationManager.error(response.data.message);
      }

      }, (error) => {
        NotificationManager.error(error.message);
        localStorage.clear();
      });
  }
  // otp validation
  const otpValidation = () => {
    const phoneErr = {};
    let ifvalid = true;

    if (otp.length == "") {
      ifvalid = false;
    }
    return ifvalid;
  }


  // Register user here
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    }
  }

  // Verify OTP Function 
  const registerHandle = (e) => {
    const bodyParameters = new FormData();
    bodyParameters.append("first_name", "" + FirstName);
    bodyParameters.append("last_name", LastName);
    bodyParameters.append("dob", "" + dates);
    bodyParameters.append("gender", "" + genderName);
    bodyParameters.append("device_token", "" + "null");
    bodyParameters.append("device_type", "" + 0);
    bodyParameters.append("country_code", "+" + cntCode);
    bodyParameters.append("phone", "" + phoneNumber);
    bodyParameters.append("agency_code", "" + agencyCode);
    bodyParameters.append("email", "" + email);
    bodyParameters.append("latitude", "" + !!latitude ? (( latitude == "undefined" || latitude == undefined) ? ""  : latitude) : "");
    bodyParameters.append("longitude", "" + !!longitude ? (( longitude == "undefined" || longitude == undefined) ? ""  : longitude) : "");
    bodyParameters.append('profile_photo', picture);

    axios.post(SIGNUP_API, bodyParameters, config)
      .then((response) => {

        if (response.data.status_code == 200 && response.data.error == false) {
          localStorage.setItem('session_id', response.data.data.session_id);
          history.push({
            pathname: '/signup-completed',
            mypicture: imgData // your data array of objects
          })

          localStorage.setItem("socket_id", SOCKET.id)
          localStorage.setItem("role_id", response.data.data.role_id)
          localStorage.setItem("user_id", response.data.data.user_id)
          SOCKET.emit('establish_socket_connection', { "u_id": response.data.data.user_id, socket_id: SOCKET.id });
          SOCKET.connect()

        }
        else {
          localStorage.clear();
          NotificationManager.error(response.data.message);

        }

      }, (error) => {
        localStorage.clear();
        NotificationManager.error(error.message);

      });
  }
  // End here 

  // Testing here
  //login with google here
  const responseGoogle = (response) => {
  }
  //End here

  //login with twitter code
  const onSuccess = (response) => {
    // response.json().then(body => {
    // });
  }

  const onFailed = (error) => {
    alert(error);
  }
  // End here

  const handleResponse = (data) => {
  }

  const handleError = (error) => {
  }
  const changeDate = (date) => {
    $('.react-date-picker').find(':input[type="number"]').each(function () {
      $(this).attr('readOnly', true);
      $(this).attr('readOnly', true);
    });
    setDob(date)
  }

  const handlePhoneSumbit =(e)=> {
    e.preventDefault();
    if(step==1){
    sendHandle()
    }
 }
  const tabScreen = () => {

    switch (step) {
      case 1:
        return (
          <div className="signup-inner" id="login-tab-1">
           
            <div className="signup-header">
              <h4 className="theme-txt">Glad to see you!</h4>
              <p>Hello there, sign in to continue!</p>
            </div>
            <div className="form-group">
              <div className="country text-left">
                <div id="country" className="select" ><img src={"https://flagcdn.com/16x12/" + cntCodeName.toLowerCase() + ".png"} />+{cntCode}</div>
                <div id="country-drop" className="dropdown">
                  <ul>
                    {getCountries().map((country, index) => (
                      <li onClick={e => changeCountry(e)} data-code={country.code.toLowerCase()} data-name={country.label} data-cid={country.phone}><img src={"https://flagcdn.com/16x12/" + country.code.toLowerCase() + ".png"} />+{country.phone}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <input className="form-control" name="phone_number" id="phone_number" maxlength="19" type="text" placeholder="Enter Phone Number" value={phoneNumber} onChange={handlePhoneChange} />
              {Object.keys(phoneErr).map((key) => {
                return <div style={{ color: "red" }}>{phoneErr[key]}</div>
              })}
            </div>
            <p>You'll receive a verification code</p>
            <a className="btn bg-grd-clr d-block mb-4 btn-countinue-1" href="javascript:void(0)" onClick={sendHandle} >Continue</a>
            {/* <p>Continue with</p> */}
            {/* <ul className="social-login">
              <li>
                <a className="bg-grd-clr" href="javascript:void(0)"><i class="fab fa-facebook-f"></i></a> */}
                {/* <FacebookProvider appId="123456789" fields="name,email,picture">
                  <LoginButton scope="email" onCompleted={handleResponse} onError={handleError}>
                    <a className="bg-grd-clr" href="javascript:void(0)">  <i className="fab fa-facebook-f" /></a>
                  </LoginButton>
                </FacebookProvider> */}
              {/* </li>
              <li>
                <a className="bg-grd-clr" href="javascript:void(0)"><i class="fab fa-google"></i></a> */}
                {/* <GoogleLogin
                  clientId="265643113121-uh1cur9885cc2e35qjroijdbor8camgp.apps.googleusercontent.com"
                  render={renderProps => (
                    <a className="bg-grd-clr" href="javascript:void(0)" onClick={renderProps.onClick} disabled={renderProps.disabled}><i className="fab fa-google" /></a>
                  )}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'} isSignedIn={true} /> */}
              {/* </li>
              <li>
                <a className="bg-grd-clr" href="javascript:void(0)"><i class="fab fa-twitter"></i></a> */}
                {/* <TwitterLogin loginUrl="http://localhost:4000/api/v1/auth/twitter"

                  onFailure={onFailed}
                  onSuccess={onSuccess}
                  requestTokenUrl="http://localhost:4000/api/v1/auth/twitter/reverse"
                  showIcon={true}
                >
                  <a className="bg-grd-clr" href="javascript:void(0)"><i className="fab fa-twitter" /></a>
                </TwitterLogin> */}
              {/* </li>
            </ul> */}
            <div className="accept-field d-flex justify-content-center align-items-center mt-4">
              <input type="checkbox" name="agree" id="accept-field" checked={clickTerm} onChange={(e) => setClickTerm(e.target.checked)} />
              <label htmlFor="accept-field" />
              <span > to our 
              <a href="javascript:void(0)" className="text-white link-color" style={{cursor: "pointer"}}  onClick={() => history.push("/terms-conditions")}> Terms and Data Policy.</a></span>

            </div>
            <div className="app-store mt-4">
            {/* <button type="submit" onClick={() => window.open()}>Download!</button> */}
            <a target="_blank" href="https://play.google.com/store/apps/details?id=com.goldenposelatincorp.glitterstreamer">
                                <img src="/assets/images/playstore.png" style={{width: "60px", height: "45px"}} className="mr-2" alt="play store"/>
                                <div class="app-store__link">
                                    <p className="mb-0 text-white">Available On The<br/> Google play</p>
                                </div>
                            </a>
            </div>
            {Object.keys(termPolicyErr).map((key) => {
              return <div style={{ color: "red" }}>{termPolicyErr[key]}</div>
            })}
          </div>
        );
      case 2:
        return (
          <div className="signup-inner" id="login-tab-2">
            <div className="cont_screen">
              <div className="signup-header">
                <a href="javascript:void(0)" className="login-back-1 btn-back" onClick={() => setStep(step - 1)}><i className="fas fa-chevron-left" /></a>
                <h4 className="theme-txt">Enter Code</h4>
                <p>Enter 4 digit verification code you<br /> received on {'+' + cntCode + ' ' + phoneNumber}</p>
              </div>
              <div className="form-group otp-field">

                <OtpInput value={otp} onChange={(value) => changeOtp(value)} shouldAutoFocus numInputs={4} isInputNum />

              </div>

              <a className="btn bg-grd-clr d-block mb-2 btn-countinue-2" href="javascript:void(0)" onClick={verifyHandle}>Verify</a>
              <a className="btn btn-trsp d-block" href="javascript:void(0)" onClick={handleResend}>Resend</a>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="signup-inner" id="login-tab-3" >
            <div className="another_test">
              <div className="signup-header mb-5">
                <a href="javascript:void(0)" className="login-back-2 btn-back" onClick={() => setStep(step - 1)} ><i className="fas fa-chevron-left" /></a>
                <h4 className="theme-txt">Your Information</h4>
              </div>
              <div className="form-group">
                <DatePicker className="bg-trsp" id="dateob" name="date-birth" format="dd/MM/yyyy" dayPlaceholder="dd" monthPlaceholder="mm" yearPlaceholder="yyyy" value={Dob} selected={Dob} onChange={date => changeDate(date)} />
                {Object.keys(dobErr).map((key) => {
                  return <div style={{ color: "red" }}>{dobErr[key]}</div>
                })}
              </div>
              {/* <div className="form-group">
                 <input 
                 className="form-control bg-trsp" name="date-birth" value={Dob} onChange={e => setDob(e.target.value)} type="text" placeholder="Your Date of birth" /> 
                </div> */}
              <div className="form-group">
                <input className="form-control bg-trsp" name="first-name" value={FirstName} onChange={e => setFirst(e.target.value)} id="first_name" type="text" placeholder="First Name" />
                {Object.keys(firstErr).map((key) => {
                  return <div style={{ color: "red" }}>{firstErr[key]}</div>
                })}
              </div>
              <div className="form-group">
                <input className="form-control bg-trsp" name="last-name" value={LastName} onChange={e => setLast(e.target.value)} type="text" placeholder="Last Name" />
                {Object.keys(lastErr).map((key) => {
                  return <div style={{ color: "red" }}>{lastErr[key]}</div>
                })}
              </div>
              <div className="form-group">
                <input className="form-control bg-trsp" name="email" value={email} onChange={e => setEmail(e.target.value)} id="email" type="text" placeholder="Email" />
                {Object.keys(emailErr).map((key) => {
                  return <div style={{ color: "red" }}>{emailErr[key]}</div>
                })}
              </div>
              <div className="form-group">
                <input className="form-control bg-trsp" name="agencyCode" value={agencyCode} onChange={e => setAgencyCode(e.target.value)} id="agency" type="text" placeholder="Agency code" />
                {Object.keys(agencyCodeErr).map((key) => {
                  return <div style={{ color: "red" }}>{agencyCodeErr[key]}</div>
                })}
              </div>
              <div className="choose-gender d-flex my-4 position-relative">
                <div className="form-group">
                  <input type="radio" id="female" name="gender" value={2} onChange={handleChange} checked={genderName == 2 ? "checked" : ""} placeholder="Female" />
                  <label htmlFor="female">Female</label>
                </div>
                <div className="form-group">
                  <input type="radio" id="male" name="gender" value={1} onChange={handleChange} checked={genderName == 1 ? "checked" : ""} placeholder="Male" />
                  <label htmlFor="male">Male</label>
                </div>

                <div className="form-group">
                <input type="radio" id="prefer not to say" value={3} checked={genderName == 3 ? "checked" : ""} onChange={handleChange} name="gender" />
                <label htmlFor="prefer not to say">prefer not to say</label>
              </div>
              <div className="form-group">
                <input type="radio" id="non binary" value={4} checked={genderName == 4 ? "checked" : ""} onChange={handleChange} name="gender" />
                <label htmlFor="non binary">non binary</label>
              </div>
                {Object.keys(genderErr).map((key) => {
                  return <div style={{ color: "red", position: "absolute", bottom: "-20px", width: "100%" }} className="text-center">{genderErr[key]}</div>
                })}
              </div>

              <a className="btn bg-grd-clr d-block mb-4 btn-countinue-3" href="javascript:void(0)" onClick={handleNextClick}>Next</a>
            </div>
          </div>

        );
      // case 4:
      //   return (
      //     <div className="signup-inner" id="login-tab-4">
      //       <div className="signup-header">
      //         <a href="javascript:void(0)" className="login-back-3 btn-back" onClick={() => setStep(step - 1)}><i className="fas fa-chevron-left" /></a>
      //         <h4 className="theme-txt">Gender Identity</h4>
      //       </div>
      //       <a className="btn bg-grd-clr d-block mb-4 btn-countinue-4" href="javascript:void(0)" onClick={() => setStep(step + 1)}>Prefer Not to say</a>
      //       <a className="btn btn-trsp d-block" href="javascript:void(0)" onClick={() => setStep(step + 1)}>Non-Binary</a>
      //     </div>

      //   );
      case 4:
        return (
          <div className="signup-inner" id="login-tab-5">
            <div className="signup-header">
              <a href="javascript:void(0)" className="login-back-4 btn-back" onClick={() => setStep(step - 1)}><i className="fas fa-chevron-left" /></a>
              <h4 className="theme-txt upload-txt-spacer">Upload Profile Photo</h4>
            </div>
            <div className="form-group upload-field position-relative mb-5">
              <img id="PreviewPicture" src={imgData} />
              <input type="file" id="profile-photo" ref={openRegisterFile} name="profile-photo" onChange={handleFileChange} accept="image/*" />
              <span className="camera-icon" onClick={() => openRegisterFile.current.click()} >
                <img src="/streamer-app/assets/images/Icon%20feather-camera.png" alt="Camera" />
              </span>
            </div>
            <a className="btn bg-grd-clr d-block mb-4 btn-countinue-5" href="javascript:void(0)" onClick={registerHandle} >Next</a>

          </div>
        );
      default:
        return 'foo';
    }

  }

  // const uploadImage = () => {
  //   // Click event for status uplaod screen
  //   $(document).on("click", ".camera-icon", function () {
  //     $('#profile-photo').trigger("click");
  //   });

  //   $(document).on("click", "#profile-photo", function (e) {
  //     e.stopPropagation();
  //     //some code
  //   });
  // }

  useEffect(() => {

    // Jquery code here 
    function countryDropdown(seletor) {
      var Selected = $(seletor);
      var Drop = $(seletor + '-drop');
      var DropItem = Drop.find('li');

      Selected.click(function () {
        Selected.toggleClass('open');
        Drop.toggle();
      });

      Drop.find('li').click(function () {
        Selected.removeClass('open');
        Drop.hide();

        var item = $(this);
        Selected.html(item.html());
      });

      DropItem.each(function () {
        var code = $(this).attr('data-code');

        if (code != undefined) {
          var countryCode = code.toLowerCase();
          $(this).find('i').addClass('flagstrap-' + countryCode);
        }
      });
    }

    countryDropdown('#country');
    // uploadImage();
  }, [step]);

  useEffect(() => {
    restrictBack()
  }, [])

  const changeOtp = (value) => {
    setOtp(value)
  }

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

            <div className="col-md-4 mx-auto">
              <LoginSidebar />
            </div>

            <div className="col-md-4 mx-auto">
              <form onSubmit={handlePhoneSumbit} id="login_form" >
                <div className="signup-wrapper__form">
                  <Scrollbars autoHide >
                    <div className="signup-form text-center">
                      {tabScreen()}
                    </div>
                  </Scrollbars>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal className="privacy-model" show={termPolicyModel} onHide={() => setTermPolicyModel(false)} >
        <h4 className="theme-txt text-center mb-4 ">Term & policy</h4>
      <TermPolicy/>
        <a href="javascript:void(0)" className="modal-close" onClick={() => setTermPolicyModel(false)}><img src="/streamer-app/assets/images/btn_close.png" /></a>

      </Modal>
    </section>
    
  )

}

export default Login;