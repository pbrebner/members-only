const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const MessageSchema = new Schema({
    title: { type: String, required: true, maxLength: 30 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, maxLength: 140 },
    timeStamp: { type: Date, default: new Date() },
});

MessageSchema.virtual("timeStampFormatted").get(function () {
    return DateTime.fromJSDate(this.timeStamp).toLocaleString(
        DateTime.DATE_MED
    );
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
