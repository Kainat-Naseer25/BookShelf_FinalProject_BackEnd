const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    fullname: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    bookshelf: [{ type: mongoose.Schema.Types.ObjectId, ref: 'books' }],
})

const User = mongoose.model("Users", userSchema);

module.exports = User;