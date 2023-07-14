const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
    AuthorName: {
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Author', AuthorSchema)