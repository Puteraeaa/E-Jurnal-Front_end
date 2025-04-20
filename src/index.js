import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import store from './app/store';
import { Provider } from 'react-redux';
import SuspenseContent from './containers/SuspenseContent';
import 'leaflet/dist/leaflet.css';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Sembunyikan error di console
// console.error = () => {};
// console.log = () => {};
// console.warn = () => {};
// console.debug = () => {};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Suspense fallback={<SuspenseContent />}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
          <App />
      </Provider>
      <ToastContainer />
      </GoogleOAuthProvider>
    </Suspense>
  // </React.StrictMode>
);


