import React, { useState, useEffect } from "react";
import { useSubmitComment } from "../../../Hooks/commentQueryAPI";
import { useSelector } from "react-redux";

import style from "./CommentUpload.module.scss";

const CommentUpload = ({ postId }) => {
  const user = useSelector((state) => state.user);
  const [comment, setComment] = useState("");

  const { mutate: submitMutate } = useSubmitComment(postId, user.uid, comment);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment) {
      alert("댓글을 작성해주세요!");
      return;
    }
    submitMutate(
      {},
      {
        onSuccess: () => {
          setComment("");
          alert("댓글 작성이 완료되었습니다!");
        },
        onError: () => {
          alert("댓글 작성에 실패했습니다!");
        },
      }
    );
  };

  return (
    <div className={style.uploadWrapper}>
      <div className={style.commentHeader}>댓글 쓰기</div>
      <input
        type="text"
        placeholder="댓글을 입력해주세요"
        value={comment}
        onChange={(e) => setComment(e.currentTarget.value)}
      />
      <button className={style.uploadBtn} onClick={submitHandler}>
        등록
      </button>
    </div>
  );
};

export default CommentUpload;
