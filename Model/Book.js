const mongoose = require('mongoose');
const Path = require('path');


const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    publishedDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    CoverImage: {
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

BookSchema.virtual('imagePath').get(function(){
    if(this.CoverImage != null){
        return Path.join('static', 'upload/images', this.CoverImage);
    }
});

module.exports = mongoose.model('Book', BookSchema)