import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './app/store';
import { Provider } from 'react-redux';
import SuspenseContent from './containers/SuspenseContent';
import 'leaflet/dist/leaflet.css';
import { ToastContainer } from 'react-toastify';

// Sembunyikan error di console
console.error = () => {};
console.log = () => {};
console.warn = () => {};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Suspense fallback={<SuspenseContent />}>
        <Provider store={store}>
            <App />
        </Provider>
        <ToastContainer />
    </Suspense>
  // </React.StrictMode>
);


