import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../Loading/Loading";

import Detail from "../Detail/Detail";
import CommentWrapper from "../../Comment/CommentWrapper/CommentWrapper";
import axios from "axios";
import style from "./PostWrapper.module.scss";
const PostWrapper = () => {
  let params = useParams();

  const [post, setPost] = useState([]);
  const [flag, setFlag] = useState(false);

  const fetchPost = async () => {
    let body = {
      postNum: params.postNum,
    };

    try {
      const { data } = await axios.post("/api/post/detail", body);
      if (data.success) {
        setPost(data.post);
        setFlag(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);
  return (
    <div className={style.postWrapper}>
      {flag ? (
        <>
          <Detail post={post} />
          <CommentWrapper postId={post._id} />
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default PostWrapper;
