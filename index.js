require('dotenv').config(); // initializing the .env file
const express = require('express');
const app = express();
const morgan = require('morgan');
const ejsLayouts = require('express-ejs-layouts');
const Path = require('path');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const Author = require('./Model/Author');
const port = process.env.PORT || 4000;
const helperFunction = require('./views/helpers/helper')

// setting up the view engine and static files...
app.set('views', 'views');
app.set('view engine', 'ejs');
app.set('layout', './layouts/main');
app.use(ejsLayouts);
// overriding any other HTTP requests.
app.use(methodOverride('_method'));

app.use(express.urlencoded({limit: '10mb', extended: false}));
app.use(express.static(Path.join(__dirname, 'static')));

// setting up the database....
const connection = async()=>{
     try{
        let db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('mongoose connected to the server...')
     }catch(err){
        console.log(err);
        process.exit(1);
     }
}
connection(); // initializing the database..

// diplaying  all the HTTP Status codes and routes.../
if(process.env.NODE_ENV !== 'production'){
    app.use(morgan('dev'));
}


//  Bringing in some other custom modules...
 app.use('/author', require('./routes/author'));
 app.use('/books', require('./routes/book'));


app.get('/', async(req,res,next)=>{
        try{    
                let authors = await Author.find().sort({createdAt : 'desc'});
                    res.render('dashboard', {Authors : authors,
                        helper: helperFunction });
        }catch(err){
            console.log(err);
            res.redirect('/author')
        }
})




app.listen(port, ()=>{
    console.log('server is running on port', port)
});