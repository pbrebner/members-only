const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: { type: String, required: true, maxLength: 30 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, maxLength: 140 },
    timeStamp: { type: Date, default: new Date() },
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
