const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true, maxLength: 100 },
    familyName: { type: String, required: true, maxLength: 100 },
    username: { type: String, required: true, maxLength: 100 },
    password: { type: String, required: true },
    memberStatus: { type: Boolean, required: true },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
    let fullname = "";
    if (this.first_name && this.family_name) {
        fullname = `${this.family_name}, ${this.first_name}`;
    }

    return fullname;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
