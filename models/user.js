const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        require: true
    }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;