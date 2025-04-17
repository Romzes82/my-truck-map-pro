import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  // {/* // иначе вылетает баг
  // // (Yandex Maps JS API): api is already enabled on this page with same namespace. */}
    <App />
  //  {/* </React.StrictMode>  */}
);