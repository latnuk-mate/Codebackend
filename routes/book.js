const router = require('express').Router();
const Author = require('../Model/Author');
const Book = require('../Model/Book');
const Path = require('path');
const fs = require('fs');
const multer = require('multer');
const ImageMimes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: Path.join('static', 'upload/images'),
    fileFilter: (req, file, cb)=>{
        cb(null, ImageMimes.includes(file.mimetype))
    }
})


router.get('/', async(req,res,next)=>{
        try{
            let books = await Book.find({});
            res.render('books', { books })
        }catch(err){
            console.log(err);
            res.redirect('/books/add');
        }
})



router.get('/add', async(req,res,next)=>{
    showPage(res, new Book());
});

router.post('/',  upload.single('datafiles'), async(req,res,next)=>{
    const fileName = req.file != null ? req.file.filename : null;
        let books = new Book({
                title : req.body.BookName,
                publishedDate: new Date(req.body.publishedDate),
                description : req.body.description,
                pageCount :  req.body.pageCount,
                author: req.body.authorSelection,
                CoverImage: fileName

        });
        try{
            let book = await books.save();
            res.redirect('books');
        }catch(err){
            console.log(err);
            removeDuplicate(books.CoverImage)
           showPage(res, books, true );
        }
})


async function showPage(res, books, hasError = false){
    try{
   let authors = await Author.find();
    const params =  { authors : authors, books : books}
    if(hasError){
       params.errorMessage = 'Error creating a new book.' 
    }else{
        params.errorMessage = '';
    }
    res.render('Add_books', params)
   }catch(err){
    console.log(err);
    res.redirect('/books')
   }
};

function removeDuplicate(file){
    try{
        if(file != null){
          fs.unlinkSync(Path.join('static/upload/images', file));
        }
    }catch(err){
        console.log(err);
    }
}


module.exports = router;