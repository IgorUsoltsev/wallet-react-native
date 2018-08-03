import React, { Component } from 'react';
import './global.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// import Instabug from 'instabug-reactnative';

import { persistor, store } from './redux/store';
import Main from './main';

// const _XHR = GLOBAL.originalXMLHttpRequest
//   ? GLOBAL.originalXMLHttpRequest
//   : GLOBAL.XMLHttpRequest;

// XMLHttpRequest = _XHR;

// global.XMLHttpRequest = global.originalXMLHttpRequest
//   ? global.originalXMLHttpRequest
//   : global.XMLHttpRequest;
// global.FormData = global.originalFormData
//   ? global.originalFormData
//   : global.FormData;
// global.Blob = global.originalBlob ? global.originalBlob : global.Blob;
// global.FileReader = global.originalFileReader
//   ? global.originalFileReader
//   : global.FileReader;

// Instabug.startWithToken('IOS_APP_TOKEN', Instabug.invocationEvent.shake);

class App extends Component {
  // constructor() {
  //   Instabug.startWithToken('IOS_APP_TOKEN', Instabug.invocationEvent.shake);
  // }

  render() {
    console.disableYellowBox = true;

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Main />
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
