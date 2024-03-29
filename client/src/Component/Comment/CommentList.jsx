import React, { useEffect, useState } from "react";
import { useGetComments } from "../../Hooks/commentQueryAPI";
import CommentContent from "./CommentContent/CommentContent";

const CommentList = ({ postId }) => {
  const [commentList, setCommentList] = useState([]);

  const { data, isFetching } = useGetComments(postId);

  useEffect(() => {
    if (!isFetching) {
      setCommentList(data?.data?.commentList);
    }
  }, [isFetching]);

  return (
    <div>
      {commentList !== undefined ? (
        commentList.map((comment, idx) => (
          <CommentContent comment={comment} key={idx} />
        ))
      ) : (
        <div>empty</div>
      )}
    </div>
  );
};

export default CommentList;
