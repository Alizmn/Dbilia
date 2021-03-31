const express = require("express");
const router = express.Router();
const { Image } = require("../models/Image");
const multer = require("multer");
const { auth } = require("../middleware/auth");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const db = mongoose.connection;

// To keep the image live, is better to create a grid
let gfs;
db.once("open", function () {
  gfs = Grid(db.db, mongoose.mongo);
});

const storage = new GridFsStorage({
  db: db,
  file: (req, file) => {
    return {
      filename: file.originalname,
      metadata: req.user._id,
      bucketName: "userImages",
      // ^-----other params will stay as default
    };
  },
});

const upload = multer({ storage: storage }).single("userImage");

// Get picture and title by creating a readstream
// router.get("/", auth, (req, res) => {
//   Image.find({ userId: req.user._id }, (error, docs) => {
//     //           ^--- grab the title here
//     gfs
//       .collection("userImages")
//       .find({ metadata: req.user._id, filename: })
//       //           ^--- grab the image here
//       .toArray((error, docs) => {
//         if (error)
//           return res.status(502).json({ error: "Something went wrong!" });
//         if (!docs || docs.length === 0)
//           return res.status(204).json({ message: "No picture available!" });
//         let readstream = gfs.createReadStream({ filename: docs[0].filename });
//         res.set("Content-Type", docs[0].contentType);
//         res.set("Title", doc[0].title);
//         return readstream.pipe(res);
//         //           ^--- create live link for client
//       });
//   });
// });

router.get("/", auth, (req, res) => {
  Image.find({ userId: req.user._id }, (error, docs) => {
    //           ^--- grab the title here
    return res.status(200).json(docs);
  });
});

router.get("/image/:name", auth, (req, res) => {
  gfs
    .collection("userImages")
    .find({ metadata: req.user._id, filename: req.params.name })
    .toArray((error, files) => {
      if (error) return res.status(502).json({ error });
      if (!files || files.length === 0) {
        return res.status(404).json({
          message: "No such a file",
        });
      }
      let readstream = gfs.createReadStream({
        filename: files[0].filename,
      });
      res.set("Content-Type", files[0].contentType);
      return readstream.pipe(res);
    });
});

// Delete  the userImage and Image itself
// router.delete("/deleteImage", auth, async (req, res) => {
//   await gfs
//     .collection("userImages")
//     .findOneAndDelete({ metadata: req.user._id }, (error, doc) => {
//       if (error) return res.status(502).json({ error });
//       Image.findOneAndDelete({ userId: req.user._id }, (error, doc) => {
//         if (error) return res.status(502).json({ error });
//         return res.status(200).end();
//       });
//     });
// });

router.delete("/deleteImage/:name", auth, async (req, res) => {
  await Image.findOneAndDelete(
    { userId: req.user._id, image: req.params.name },
    (error, doc) => {
      if (error) {
        return res.status(502).json({ error });
      } else {
        gfs
          .collection("userImages")
          .findOneAndDelete(
            { metadata: req.user._id, filename: req.params.name },
            (error, file) => {
              if (error) res.status(502).json({ error });
              return res.status(200).end();
            }
          );
      }
    }
  );
});

// Upload OR modify the image
// router.patch("/upload", auth, upload, async (req, res) => {
//   await Image.findOneAndUpdate(
//     //  ^------update the user first
//     { userId: req.user._id },
//     {
//       image: req.file.filename,
//       title: req.body.title,
//     },
//     { upsert: true, returnNewDocument: true },
//     (error, doc) => {
//       gfs
//         .collection("userImages")
//         .deleteOne({ filename: { $nin: [req.file.filename] } });
//       //  ^------update the userImage and delete previous one

//       if (error) return res.status(500).json({ error });
//       return res.status(200).json(doc);
//     }
//   );
// });

router.post("/upload", auth, upload, async (req, res) => {
  await Image.find(
    {
      image: req.file.originalname,
      userId: req.user._id,
    },
    (error, docs) => {
      if (error) return res.status(500).end();
      if (docs.length > 0) {
        gfs
          .collection("userImages")
          .deleteOne({ filename: req.file.originalname });
        return res.status(500).end();
      } else {
        const post = new Image({
          image: req.file.filename,
          title: req.body.title,
          userId: req.user._id,
        });
        try {
          post.save();
        } catch (error) {
          return res.status(500).end();
        }
        return res.status(200).end();
      }
    }
  );
});

module.exports = router;
