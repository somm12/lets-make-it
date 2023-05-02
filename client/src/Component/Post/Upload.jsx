import React, { useState, useEffect } from "react";
import {
  UploadButtonDiv,
  UploadForm,
  UploadDiv,
} from "../../Style/UploadCSS.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Upload = ({ list, setList }) => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
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
  const onSubmitPost = (e) => {
    e.preventDefault();
    if (content === "" || title === "") {
      alert("제목 내용 모두 입력해주세요");
      return;
    }
    const body = { title, content };
    axios
      .post("/api/post/submit", body)
      .then((res) => {
        if (res.data.success) {
          alert("성공적으로 제출에 성공했습니다");
          navigate("/");
          return;
        }
        alert("제출 실패!");
      })
      .catch((err) => {
        console.log(err);
      });
    setList([...list, content]);
    setContent("");
    setTitle("");
  };

  return (
    <UploadDiv>
      <UploadForm>
        <label htmlFor="label">제목</label>
        <input id="title" value={title} onChange={onChangeText} />
        <label htmlFor="content">내용</label>
        <textarea id="content" value={content} onChange={onChangeContent} />
        <UploadButtonDiv>
          <button onClick={onSubmitPost}>제출</button>
        </UploadButtonDiv>
      </UploadForm>
    </UploadDiv>
  );
};

export default Upload;