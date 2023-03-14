// const Messages = require("../models/messageModel");

// module.exports.getMessages = async (req, res, next) => {
//   try {
//     const { from, to } = req.body;

//     const messages = await Messages.find({
//       users: {
//         $all: [from, to],
//       },
//     }).sort({ updatedAt: 1 });

//     const projectedMessages = messages.map((msg) => {
//       return {
//         fromSelf: msg.sender.toString() === from,
//         message: msg.message.text,
//       };
//     });
//     res.json(projectedMessages);
//   } catch (ex) {
//     next(ex);
//   }
// };

// module.exports.addMessage = async (req, res, next) => {
//   try {
//     const { from, to, message } = req.body;
//     const data = await Messages.create({
//       message: { text: message },
//       users: [from, to],
//       sender: from,
//     });

//     if (data) return res.json({ msg: "Message added successfully." });
//     else return res.json({ msg: "Failed to add message to the database" });
//   } catch (ex) {
//     next(ex);
//   }
// };

const Messages = require("../models/messageModel");
const BadWords = require("../models/badWordsModel"); //import model badwords
const mongoose = require('mongoose');

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const badWords = await BadWords.find().lean(); //ambil semua badwords dari collection BadWords
    let censoredMessage = message; //buat variabel baru untuk pesan yang akan diubah
    
    badWords.forEach((bw) => { //looping setiap badword
      const regex = new RegExp(`\\b${bw.word}\\b`, 'gi'); //buat regex dengan word boundary dan flag global
      censoredMessage = censoredMessage.replace(regex, "*".repeat(bw.word.length)); //ganti badword dengan tanda bintang
    });

    const data = await Messages.create({
      message: { text: censoredMessage },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

