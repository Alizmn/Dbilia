const mongoose = require("mongoose");

// Image Schema for keeping a reference for image in the bucket and title

const imageSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 50,
  },
  image: {
    type: String,
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = { Image };
