const router = require('express').Router();
const Author = require('../Model/Author');
const Book = require('../Model/Book')

router.get('/', async(req,res,next)=>{ 
    const queryString = {}
    if(req.query.author != null && req.query.author !== ''){
        queryString.AuthorName = new RegExp(req.query.author, 'i');
    }
      try{  
         let author = await Author.find(queryString);
        res.render('Author', { author: author,
            queryString: req.query});
     }
    catch(err){
        console.log(err);
        res.redirect('/author/add');
    }
    
})
 

router.get('/add', (req,res,next)=>{
    res.render('Add_Author');
})

router.post('/', async(req,res,next)=>{
        try{
            let author = await Author.create({
                AuthorName: req.body.author
            });
         let newAuthor = await author.save();
         res.redirect(302, "/");
        }catch(err){
            console.log(err);
            res.redirect('/author/add')
        }      
})


/*
  @desc: route to check author.
    @route: /author/id

    @desc: route to edit author.
    @route: /author/id/edit

      @desc: route to delete author.
    @route: /author/delete
*/
router.get('/:id', async(req,res,next)=>{
   try{
        const author = await Author.findOne({_id : req.params.id});
        const books = await Book.find({author: req.params.id}).limit(5).exec();
    res.render('partials/view', {author, books});
   }catch(err){
    res.status(500).send()
   }
})

router.get('/edit/:id', async(req,res,next)=>{
    try{
            let author = await Author.findOne({_id : req.params.id});
            res.render('Author_edit', {author})
    }catch(err){
        console.log(err)
        res.redirect(302, '/author')
    }
    
});

router.put('/:id' ,async(req, res,next)=>{
        try{
         let authors = await Author.findById(req.params.id);
         authors.AuthorName = req.body.newauthor;
         await authors.save();
         res.redirect(302 ,`/author`);
        }catch{
            res.sendStatus(500).send();
        }
})

router.delete('/delete/:id', async(req,res,next)=>{
    try{
        var elements = await Author.findOne({_id : req.params.id});
        await elements.remove();
        res.redirect('/author');
    }catch{
        if(elements == null){
            res.redirect('/')
        }else{
            res.redirect('/author')
        }
    }
})

module.exports = router;