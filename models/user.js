const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true, maxLength: 100 },
    lastName: { type: String, required: true, maxLength: 100 },
    email: { type: String, required: true, maxLength: 100 },
    password: { type: String, required: true },
    memberStatus: { type: Boolean, required: true, default: false },
    admin: { type: Boolean, default: false },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

// Virtual for author's full name
UserSchema.virtual("name").get(function () {
    let fullname = "";
    if (this.firstName && this.lastName) {
        fullname = `${this.firstName} ${this.lastName}`;
    }

    return fullname;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
