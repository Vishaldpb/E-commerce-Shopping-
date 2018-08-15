
var express = require('express');
var mongoose = require('mongoose');
var config= require('./config/database')
var bodyParser = require('body-parser')
var session = require('express-session')
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload'); 
var path = require('path');
var passport = require('passport');
var app = express();



mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error',function(){
    console.log( 'connection error: not connected to mongoDB')
});
db.once('open', function() {
  console.log(' we are connected! to mongoDB')
});


app.set('view engine', 'ejs')
app.set('views',__dirname+'/views')

app.use(express.static(__dirname+'/public'))

// globally setup error variable
app.locals.errors = null;

// importing Page model
var Page = require('./models/page');

Page.find({}, function(err, pages){
    if(err){
        console.log(err)
    }else{
        app.locals.pages = pages;
    }
})

// importing Category model
var Category = require('./models/category');

Category.find({}, function(err, categories){
    if(err){
        console.log(err)
    }else{
        app.locals.categories = categories;
    }
})


// fileupload middleware setup
app.use(fileUpload());

// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))




//express session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
   
  }))

  // Express Validator middleware
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
                , root = namespace.shift()
                , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    },
    customValidators: {
        isImage: function (value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch (extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;
            }
        }
    }
    
}));

//express messsages
app.use(require('connect-flash')());

require('./config/passport')(passport)

app.use(passport.initialize());
app.use(passport.session())

app.get('*', function(req,res,next){
    res.locals.cart = req.session.cart
    res.locals.user = req.user || null
    next();
})

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// setUp Routes

var pages = require('./routes/pages');
var adminPages = require('./routes/admin_pages');
var adminCategories = require('./routes/admin_categories');
var adminProducts = require('./routes/admin_products');
var products = require('./routes/products');
var cart = require('./routes/cart');
var users = require('./routes/users');

app.use('/',pages);
app.use('/admin/pages',adminPages)
app.use('/admin/categories',adminCategories)
app.use('/admin/products',adminProducts)
app.use('/products/list',products)
app.use('/cart',cart)
app.use('/users',users)

app.listen(3000, function(){
    console.log("server is started at 3000 !!");
})