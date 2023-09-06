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
  // const isLoggedIn = checkLoginStatus(); // 토큰을 확인하여 로그인 여부 판별

  return (
    // <Provider store={store}>
    <Router persistConfig={persistConfig}>
      {/* <PersistGate persistConfig={persistConfig}> */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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

// const checkLoginStatus = () => {
//   // 액세스 토큰 및 리프레시 토큰을 사용하여 로그인 여부 확인하는 로직 구현
//   const accessToken = localStorage.getItem('accessToken');
//   const refreshToken = localStorage.getItem('refreshToken');

//   if (!accessToken && !refreshToken) {
//     return false;
//   }
//   // 토큰이 있는 경우, 해당 토큰의 유효성 검증 로직
//   if (isValidToken(accessToken)) {
//     return true; // 액세스 토큰이 유효한 경우 로그인 상태
//   }

//   // 액세스 토큰이 만료되었지만 리프레시 토큰이 유효한 경우
//   if (isValidToken(refreshToken)) {
//     // 서버에 리프레시 토큰을 보내서 새로운 액세스 토큰을 발급받는 로직 필요
//     // 발급받은 액세스 토큰으로 로그인 상태로 간주
//   }

//   return false; // 유효한 토큰이 없는 경우 로그인 상태 아님
// };
// const jwt = require('jsonwebtoken'); // JWT 라이브러리

// const isValidToken = (token) => {
//   // 토큰의 유효성을 검증하는 로직 필요
//   // 예: jwt.verify() 등을 사용하여 서명 및 만료 여부를 확인
//   try {
//     const decodedToken = jwt.verify(token);
//     return true; // 토큰이 유효한 경우
//   } catch (error) {
//     return false; // 토큰이 유효하지 않은 경우
//   }
// };

export default App;
