import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Offline, Online } from "react-detect-offline";
import { Provider } from 'react-redux';
import store from './reduxStore/store';
import { BrowserRouter } from 'react-router-dom';


ReactDOM.render(
 <Provider store={store}>
   <BrowserRouter basename={'/streamer-app'}>
   <Offline><div className="offline-reconnect">Reconnecting to internet...</div></Offline>
    <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
