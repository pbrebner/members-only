const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: { type: String, required: true, maxLength: 100 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    messageText: { type: String, required: true },
    timeStamp: { type: Date },
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
