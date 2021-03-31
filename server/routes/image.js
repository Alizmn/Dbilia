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

//                  ============
//                 | GET ROUTES |
//                  ============

// Get route to get the titles and image names
router.get("/", auth, (req, res) => {
  Image.find({ userId: req.user._id }, (error, docs) => {
    if (error) return res.status(500).end();
    return res.status(200).json(docs);
    //                            ^------ includes image name and title
  });
});

// Create a readstream to get a specific picture
router.get("/image/:name", auth, (req, res) => {
  gfs
    .collection("userImages")
    .find({ metadata: req.user._id, filename: req.params.name })
    .toArray((error, images) => {
      if (error) return res.status(500).end();
      if (!images || images.length === 0) {
        return res.status(404).end();
      }
      let readstream = gfs.createReadStream({
        filename: images[0].filename,
      });
      res.set("Content-Type", images[0].contentType);
      return readstream.pipe(res);
    });
});

//                  ==============
//                 | DELETE ROUTE |
//                  ==============
// Delete specific photo
router.delete("/deleteImage/:name", auth, async (req, res) => {
  await Image.findOneAndDelete(
    { userId: req.user._id, image: req.params.name },
    (error, doc) => {
      if (error) {
        return res.status(500).end();
      } else {
        gfs
          .collection("userImages")
          .findOneAndDelete(
            { metadata: req.user._id, filename: req.params.name },
            (error, file) => {
              if (error) return res.status(500).end();
              return res.status(200).end();
            }
          );
      }
    }
  );
});

//                  ==============
//                 | UPLOAD ROUTE |
//                  ==============
// Upload new photo
router.post("/upload", auth, upload, async (req, res) => {
  await Image.find(
    {
      image: req.file.originalname,
      userId: req.user._id,
    },
    (error, docs) => {
      if (error) return res.status(500).end();
      if (docs.length > 0) {
        //   ^---------------if there is a file with the same name for this user, it wouldn't go further
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

//                  ==============
//                 | UPDATE ROUTE |
//                  ==============
// Update the card if title OR image change
router.put("/update/:name", auth, upload, async (req, res) => {
  if (!req.file) {
    // ^--------------The case for changing the title ONLY
    await Image.findOneAndUpdate(
      { userId: req.user._id, image: req.params.name },
      { $set: { title: req.body.title } }
    );
  } else {
    const dupData = await gfs
      // ^--------------Check if the image already exists!
      .collection("userImages")
      .find({ metadata: req.user._id, filename: req.file.originalname })
      .toArray();
    if (dupData.length !== 1) {
      await gfs
        .collection("userImages")
        .deleteOne({ metadata: req.user._id, filename: req.file.originalname });
      return res.status(500).end();
    } else {
      await Image.findOneAndUpdate(
        { userId: req.user._id, image: req.params.name },
        { $set: { title: req.body.title, image: req.file.originalname } }
      );
      await gfs
        .collection("userImages")
        .deleteOne({ metadata: req.user._id, filename: req.params.name });
    }
  }
  return res.status(200).end();
});

module.exports = router;
