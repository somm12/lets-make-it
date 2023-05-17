import express from "express";
import Post from "../Model/Post.js";
import Counter from "../Model/Counter.js";
import multer from "multer";
import setUpload from "../Util/upload.js";
const router = express.Router();

router.post("/submit", (req, res) => {
  console.log(req.body);
  let temp = req.body;
  console.log(temp);
  Counter.findOne({ name: "counter" })
    .exec()
    .then((counter) => {
      temp.postNum = counter.postNum;
      const newPost = new Post(temp);
      newPost.save().then(() => {
        Counter.updateOne({ name: "counter" }, { $inc: { postNum: 1 } }).then(
          () => {
            res.status(200).json({ success: true });
          }
        );
      });
    })
    .catch((err) => {
      res.status(400).json({ success: false });
      console.log(err);
    });
});

router.get("/list", (req, res) => {
  Post.find()
    .exec()
    .then((doc) => {
      console.log(doc);
      res.status(200).json({ success: true, postList: doc });
    })
    .catch((err) => {
      res.status(400).json({ success: false });
      console.log(err);
    });
});

router.post("/detail", (req, res) => {
  console.log(req.body);
  let temp = req.body;

  Post.findOne({ postNum: Number(req.body.postNum) })
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

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "image/");
//   },
//   filename: function (req, file, cb) {
//     // 한글 파일명 유지.
//     file.originalname = Buffer.from(file.originalname, "latin1").toString(
//       "utf8"
//     );
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage }).single("file");

// router.post("/image/upload", (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.log(err);
//       res.status(400).json({ success: false });
//     } else {
//       res.status(200).json({ success: true, filePath: res.req.file.path });
//     }
//   });
// });

router.post("/image/upload", setUpload("letsmakeit/post"), (req, res) => {
  res.status(200).json({ success: true, filePath: res.req.file.location });
});
export default router;
