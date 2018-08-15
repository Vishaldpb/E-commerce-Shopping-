
var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Category = require('../models/category');
var fs = require('fs-extra')


router.get('/add/:product', function (req, res) {

    var slug = req.params.product;

    Product.findOne({slug : slug}, function(err, p){

        if(err){
            console.log(err)
        }else{

            if(typeof req.session.cart == "undefined"){
                req.session.cart = [];
                req.session.cart.push({
                    title : slug,
                    price : parseFloat(p.price).toFixed(2),
                    qty : 1,
                    image : '/product_images/'+p._id+'/'+p.image
                })
            }else{
                var cart = req.session.cart;
                var newItem=true;
                for(var i=0; i<cart.length; i++){
                    if(cart[i].title == slug){
                        cart[i].qty++;
                    newItem = false;
                    break;
                    }
                }

                
               if(newItem){
                req.session.cart.push({
                    title : slug,
                    price : parseFloat(p.price).toFixed(2),
                    qty : 1,
                    image : '/product_images/'+p._id+'/'+p.image
                })
               }

            }

            console.log(req.session.cart)
            req.flash('success',"Product Added to cart successfully !!")
            res.redirect('back');

        }

    })

   
});

router.get('/checkout', function(req,res){

    res.render('checkout',{
        title : "checkout",
        cart : req.session.cart
    })
})


router.get("/update/:product", function(req,res){

    var slug = req.params.product;
    var action = req.query.action;
    var cart = req.session.cart;

    for(var i =0 ; i < cart.length;i++){
        if(cart[i].title == slug){

            switch(action){
                case "add" :{
                    cart[i].qty++;
                    break;
                }
                case "remove" :{
                    cart[i].qty--;

                    if(cart[i].qty <1){
                        cart.splice(i,1);
                    }
                    if(cart.length ==0){
                        delete req.session.cart;
                    } 

                    break;
                }
                case "clear" :{
                    cart.splice(i,1);

                    if(cart.length ==0){
                        delete req.session.cart;
                    }
                    break;

                }
                default :{
                    console.log("updation problem")
                    break;
                }
            }
            break;
            

        }

    }

    req.flash('success',"cart value updated successfully !!")
            res.redirect('/cart/checkout');

})



// for clear button at checkout
router.get('/clear', function(req,res){

    delete req.session.cart;
    req.flash('success',"Cart cleared successfully !!")
    res.redirect('/cart/checkout');
})


// buy now link setup
router.get('/buynow', function(req,res){

    delete req.session.cart;
    res.sendStatus(200);
})

module.exports = router