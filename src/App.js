import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './components/LoginPage/LoginPage';
import MainPage from './components/MainPage/MainPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import MyPage from './components/MyPage/MyPage';
import QnAPage from './components/QnAPage/QnAPage';
import Chatpage from './components/ChatPage/Chatpage';

import { persistConfig } from './userstate/userState';



function App() {
  return (
    // <Provider store={store}>
    <Router persistConfig={persistConfig}>
      {/* <PersistGate persistConfig={persistConfig}> */}
        <Routes>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/chatpage" element={<Chatpage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/q&apage" element={<QnAPage />} />
          <Route path="/" />
        </Routes>
      {/* </PersistGate> */}
    </Router>
    // </Provider>
  );
}

export default App;
