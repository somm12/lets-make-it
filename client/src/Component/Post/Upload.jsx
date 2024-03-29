import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import ImageUpload from "./ImageUpload";
import { useNavigate } from "react-router-dom";
import style from "../Post/Edit/Edit.module.scss";
import axios from "axios";
const Upload = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState("");

  useEffect(() => {
    if (!user.accessToken) {
      alert("로그인한 유저만 글을 작성할 수 있습니다.");
      navigate("/login");
    }
  }, []);
  const onChangeContent = (e) => {
    const {
      target: { value },
    } = e;

    setContent(value);
  };
  const onChangeText = (e) => {
    const {
      target: { value },
    } = e;
    setTitle(value);
  };

  const onChangeIngredients = (e) => {
    const {
      target: { value },
    } = e;

    setIngredients(value);
  };
  const onSubmitPost = async (e) => {
    e.preventDefault();
    if (content === "" || title === "" || ingredients === "" || image === "") {
      alert("제목 내용 모두 입력해주세요");
      return;
    }

    const body = {
      title,
      content: content.replaceAll("<br>", "\r\n"),
      image,
      uid: user.uid,
      ingredients: ingredients.replaceAll("<br>", "\r\n"),
    };

    try {
      const { data } = await axios.post("/api/post/submit", body);
      if (data.success) {
        alert("성공적으로 제출에 성공했습니다");
        navigate("/");
        return;
      }
      alert("제출 실패!");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={style.uploadWrapper}>
      <form className={style.uploadForm}>
        <label htmlFor="label">제목</label>
        <input
          className={style.title}
          id="title"
          value={title}
          onChange={onChangeText}
        />
        <ImageUpload setImage={setImage} />
        {image && <img src={image} alt="" />}

        <label htmlFor="ingredients">재료</label>
        <textarea
          className={style.ingredientsTextarea}
          id="ingredients"
          value={ingredients}
          onChange={onChangeIngredients}
        />
        <label htmlFor="content">내용</label>
        <textarea
          className={style.wayToCook}
          id="content"
          value={content}
          onChange={onChangeContent}
        />
        <div className={style.uploadButton}>
          <button onClick={onSubmitPost}>제출</button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
