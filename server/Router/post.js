import express from "express";
import Post from "../Model/Post.js";
import Counter from "../Model/Counter.js";
import User from "../Model/User.js";
import setUpload from "../Util/upload.js";
const router = express.Router();

router.post("/submit", (req, res) => {
  let temp = {
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    ingredients: req.body.ingredients,
  };

  Counter.findOne({ name: "counter" })
    .exec()
    .then((counter) => {
      temp.postNum = counter.postNum;
      User.findOne({ uid: req.body.uid })
        .exec()
        .then((userInfo) => {
          temp.author = userInfo._id;
          const newPost = new Post(temp);
          newPost.save().then(() => {
            Counter.updateOne(
              { name: "counter" },
              { $inc: { postNum: 1 } }
            ).then(() => {
              res.status(200).json({ success: true });
            });
          });
        });
    })
    .catch((err) => {
      res.status(400).json({ success: false });
      console.log(err);
    });
});

router.post("/list", (req, res) => {
  let sort = {};
  console.log(req.body, "요청 본!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  if (req.body.sort === "최신순") {
    sort.createdAt = -1;
  } else {
    sort.commentNum = -1;
    sort._id = 1; // 댓글 개수가 동일할 때, 중복될 경우를 위해서 unique field로 기준 추가.
  }

  Post.find({
    $or: [
      { title: { $regex: req.body.searchTerm } },
      { content: { $regex: req.body.searchTerm } },
    ],
  })
    .sort(sort) // 정렬 기준으로 글을 정렬.
    .populate("author") // 타 collection 참조.
    .skip((req.body.page - 1) * 8) // n개 건너뛰기.
    .limit(8) // 그 중 5개만.
    .exec()
    .then((doc) => {
      console.log(doc, "보낼 데이터");
      res.status(200).json({ success: true, postList: doc });
    })
    .catch((err) => {
      res.status(400).json({ success: false });
      console.log(err);
    });
});

router.post("/detail", (req, res) => {
  Post.findOne({ postNum: Number(req.body.postNum) })
    .populate("author")
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json({ success: true, post: doc });
    })
    .catch((err) => {
      res.status(400).json({ success: false });
      console.log(err);
    });
});

router.post("/edit", (req, res) => {
  console.log(req.body);
  let temp = {
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    ingredients: req.body.ingredients,
  };
  Post.updateOne({ postNum: Number(req.body.postNum) }, { $set: temp })
    .exec()
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(400).json({ success: false });
      console.log(err);
    });
});

router.delete("/delete", (req, res) => {
  Post.deleteOne({ postNum: Number(req.body.postNum) })
    .exec()
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      res.status(400).json({ success: false });
      console.log(err);
    });
});

router.post("/image/upload", setUpload("letsmakeit/post"), (req, res) => {
  res.status(200).json({ success: true, filePath: res.req.file.location });
});

// 북마크 페이지 접속시, post들을 불러옴
router.post("/bookmark/post", (req, res) => {
  User.findOne({ uid: req.body.uid })
    .exec()
    .then((userInfo) => {
      Post.find({ _id: { $in: userInfo.bookmark } })
        .skip((req.body.page - 1) * 9) // n개 건너뛰기.
        .limit(9) // 그 중 9개.
        .exec()
        .then((docs) => {
          res.status(200).json({ success: true, bookmarkPost: docs });
        })
        .catch((err) => {
          res.status(400).json({ success: false });
          console.log(err);
        });
    });
});
// 현재 로그인된 유저의 bookmark 배열(postId 담고 있음)을 불러옴.
router.post("/bookmark/postId", (req, res) => {
  console.log(req.body, "바디");
  User.findOne({ uid: req.body.uid })
    .exec()
    .then((userInfo) => {
      console.log(userInfo, "엥에에엥");
      res.status(200).json({ success: true, bookmark: userInfo.bookmark });
    })
    .catch((err) => {
      res.status(400).json({ success: false });
      console.log(err);
    });
});
export default router;
