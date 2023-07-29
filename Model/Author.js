const mongoose = require('mongoose');
const Book = require('./Book');

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

AuthorSchema.pre('remove', function(next){
        Book.find({author : this._id}, (err, books)=>{
            if(err){
                next(err)
            }
        else if(books.length > 0 ){
                next(new Error('This author has books assigned.'))
            }else{
                next();
            }  
        });
          
})

module.exports = mongoose.model('Author', AuthorSchema)