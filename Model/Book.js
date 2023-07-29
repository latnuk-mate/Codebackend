const mongoose = require('mongoose');
const Path = require('path');
const ImageUrl = 'upload/images';


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
        type: Buffer,
        required: true
    },
    CoverImageType:{
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
    if(this.CoverImage != null && this.CoverImageType != null){
        return `data:${this.CoverImageType};charset=utf-16;base64, ${this.CoverImage.toString('base64')}`;
    }
});

module.exports = mongoose.model('Book', BookSchema);
module.exports.ImageUrl = ImageUrl;