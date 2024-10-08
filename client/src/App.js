import React, { useEffect } from "react";

import "./App.css";
import { Route, Routes } from "react-router-dom";
import Heading from "./Component/Header/Header";
import Upload from "./Component/Post/Upload";
import PostWrapper from "./Component/Post/PostWrapper/PostWrapper";
import Edit from "./Component/Post/Edit/Edit";
import Login from "./Component/User/Login/Login";
import Register from "./Component/User/Register";
import MyPage from "./Component/User/MyPage/MyPage";
import Bookmark from "./Component/User/Bookmark/Bookmark";
import MainPage from "./Component/MainPage/MainPage";

import firebase from "./firebase.js";
import { useDispatch } from "react-redux";
import { loginUser, clearUser, setBookmark } from "./Reducer/userSlice";
import axios from "axios";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      // 현재 로그인한 유저의 정보.

      if (userInfo !== null) {
        let user = {
          displayName: userInfo.multiFactor.user.displayName,
          uid: userInfo.multiFactor.user.uid,
          accessToken: userInfo.multiFactor.user.accessToken,
          photoURL: userInfo.multiFactor.user.photoURL,
        };

        dispatch(loginUser(user));
        // getUserBookmark(userInfo.multiFactor.user.uid);
      } else {
        // 현재 유저 정보가 없다면, 로그인 상태가 아니므로, user store를 비운다.
        dispatch(clearUser());
      }
    });
  }, []);

  return (
    <>
      <Heading />

      <Routes>
        <Route path="/" element={<MainPage />}></Route>
        <Route path="/upload" element={<Upload />}></Route>
        <Route path="/post/:postNum" element={<PostWrapper />}></Route>
        <Route path="/edit/:postNum" element={<Edit />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/mypage" element={<MyPage />}></Route>
        <Route path="/bookmark" element={<Bookmark />}></Route>
      </Routes>
    </>
  );
};

export default App;
