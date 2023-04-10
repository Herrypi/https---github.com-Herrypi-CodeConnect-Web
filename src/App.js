import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import LoginPage from './components/LoginPage/LoginPage';
import MainPage from './components/MainPage/MainPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import MyPage from './components/MyPage/MyPage';
import QnAPage from './components/QnAPage/QnAPage';
import Chatpage from './components/ChatPage/Chatpage';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chatpage" element={<Chatpage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/q&apage" element={<QnAPage />} />
      </Routes>
    </Router>
  );
}

export default App;