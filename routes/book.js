const router = require('express').Router();
const Author = require('../Model/Author');
const Book = require('../Model/Book');
const ImageMimes = ['image/jpeg', 'image/png', 'image/gif'];

/*
    @desc: route to check Books.
    @route: /books

    @desc: route to view book details.
    @route: /books/id

     @desc: route to add new books.
     @route: /books/add

      @desc: route to add new books.
     @route: /books/edit/id

      @desc: route to add new books.
     @route: /books/delete/id
*/

router.get('/', async(req,res,next)=>{
    let query = Book.find();
    if(req.query.BookName != null && req.query.BookName !== ''){
        query = query.regex('title', new RegExp(req.query.BookName, 'i'))
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore !== ''){
        query = query.lte('publishedDate', req.query.publishedBefore)
    }
  if(req.query.publishedAfter != null && req.query.publishedAfter !== ''){
        query = query.gte('publishedDate', req.query.publishedAfter)
    }
        try{
            let books = await query.exec();
            res.render('books', { books,
                searchQuery: req.query})
        }catch(err){
            console.log(err);
            res.redirect('/books/add');
        }
})



router.get('/add', async(req,res,next)=>{
    showPage(res, new Book(), 'Add_books');
});

router.post('/', async(req,res,next)=>{
        let books = new Book({
                title : req.body.BookName,
                publishedDate: new Date(req.body.publishedDate),
                description : req.body.description,
                pageCount :  req.body.pageCount,
                author: req.body.authorSelection

        });
        if(req.body.datafiles != null && req.body.datafiles !== ''){
            saveImageCover(books, req.body.datafiles)
        }
        try{
            let book = await books.save();
            res.redirect('books');
        }catch(err){
            console.log(err)
           showPage(res, books, true );
        }
})

router.get('/:id', async(req,res,next)=>{
        try{
            const books = await Book.findOne({_id: req.params.id})
                                    .populate('author')
                                    .exec()
            res.render('partials/viewBook', {books, helper: require('../views/helpers/helper')});
        }catch(err){
            console.log(err)
            res.redirect(302, '/books');
        }
})


router.get('/:id/edit', async(req,res,next)=>{
    try{
            const books = await Book.findById(req.params.id);
            showPage(res, books, 'editBooks');
    }catch(err){
            console.log(err)
            res.redirect('/books');
    }
})

router.put('/:id', async(req,res,next)=>{
        try{
           var book = await Book.findById(req.params.id);
           book.title = req.body.BookName
           book.pageCount = req.body.pageCount
           book.description = req.body.description
           book.publishedDate = new Date(req.body.publishedDate)
           book.author = req.body.authorSelection
            if(req.body.datafiles != null && req.body.datafiles !== ''){
                saveImageCover(book, req.body.datafiles)
            } 
            await book.save();
            res.redirect(302 , `/books/${book.id}`)
        }catch(err){
            console.log(err);
            showPage(res, book, true );
        }
})

router.delete('/delete/:id', async(req,res,next)=>{
    try{
        var elems= await Book.findByIdAndDelete(req.params.id);
        res.redirect(`/books`);
    }catch{
        if(elems == null){
            res.redirect('/')
        }else{
            res.render('partials/viewBook', 
            {elems, errorMessage : 'Error Updating the book.',
            helper: require('../views/helpers/helper')});
        }
    }
})



async function showPage(res, books, formPage, hasError = false){
    try{
   let authors = await Author.find();
    const params =  { authors : authors, books:books }
    if(hasError){
      if(formPage === 'Add_books'){
        params.errorMessage = 'Error creating a new book.' 
      }else{
        params.errorMessage = 'Error Updating the book.' 
      }
    }else{
        params.errorMessage = '';
    }
    res.render(`${formPage}`, params)
   }catch(err){
    console.log(err);
    res.redirect('/books')
   }
};


function saveImageCover(book, encodeCover){
        if(encodeCover == null) return;
        const encodeChart = JSON.parse(encodeCover);
        if(encodeChart != null && ImageMimes.includes(encodeChart.type)){
            book.CoverImage = new Buffer.from(encodeChart.data, 'base64');
            book.CoverImageType = encodeChart.type;
        }
}


module.exports = router;