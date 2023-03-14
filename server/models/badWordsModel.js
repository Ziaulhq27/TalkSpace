const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const badWordsSchema = new Schema({
  word: { type: String, required: true },
});

const BadWords = mongoose.model("BadWords", badWordsSchema);

module.exports = BadWords;
