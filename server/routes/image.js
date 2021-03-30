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
      metadata: req.user._id,
      bucketName: "userImages",
      // ^-----other params will stay as default
    };
  },
});

const upload = multer({ storage: storage }).single("userImage");

// Get picture and title by creating a readstream
router.get("/", auth, (req, res) => {
  Image.find({ userId: req.user._id }, (error, doc) => {
    //           ^--- grab the title here
    gfs
      .collection("userImages")
      .find({ metadata: req.user._id })
      //           ^--- grab the image here
      .toArray((error, docs) => {
        if (error)
          return res.status(502).json({ error: "Something went wrong!" });
        if (!docs || docs.length === 0)
          return res.status(204).json({ message: "No picture available!" });
        let readstream = gfs.createReadStream({ filename: docs[0].filename });
        res.set("Content-Type", docs[0].contentType);
        res.set("Title", doc[0].title);
        return readstream.pipe(res);
        //           ^--- create live link for client
      });
  });
});

// Delete  the userImage and Image itself
router.delete("/deleteImage", auth, async (req, res) => {
  await gfs
    .collection("userImages")
    .findOneAndDelete({ metadata: req.user._id }, (error, doc) => {
      if (error) return res.status(502).json({ error });
      Image.findOneAndDelete({ userId: req.user._id }, (error, doc) => {
        if (error) return res.status(502).json({ error });
        return res.status(200).end();
      });
    });
});

// Upload OR modify the image
router.patch("/upload", auth, upload, async (req, res) => {
  await Image.findOneAndUpdate(
    //  ^------update the user first
    { userId: req.user._id },
    {
      image: req.file.filename,
      title: req.body.title,
    },
    { upsert: true, returnNewDocument: true },
    (error, doc) => {
      gfs
        .collection("userImages")
        .deleteOne({ filename: { $nin: [req.file.filename] } });
      //  ^------update the userImage and delete previous one

      if (error) return res.status(500).json({ error });
      return res.status(200).json(doc);
    }
  );
});

module.exports = router;
