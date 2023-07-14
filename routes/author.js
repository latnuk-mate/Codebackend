const router = require('express').Router();
const Author = require('../Model/Author');

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
         res.redirect(302, "dashboard");
        }catch(err){
            console.log(err);
            res.redirect('/author/add')
        }      
})


module.exports = router;