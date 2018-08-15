
var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Category = require('../models/category');
var fs = require('fs-extra')


router.get('/', function (req, res) {


    Product.find(function (err, products) {
        if (err)
            console.log(err);

        res.render('all_products', {
            title: 'All products',
            products: products
        });
    });

});


router.get('/:slug', function (req, res) {

    var categorySlug = req.params.slug;


    Category.find({ slug: categorySlug }, function (err, c) {

        if (err) {
            console.log(err);
        } else {

            Product.find({ category: categorySlug }, function (err, p) {
                if (err)
                    console.log(err);

                res.render('cat_products', {
                    title: c.slug,
                    products: p
                });
            });

        }

    })

});


// get product details


router.get('/:category/:product', function (req, res) {

    var galleryImages = null;
    var loggedIn = (req.isAuthenticated()) ? true : false;

    Product.findOne({slug: req.params.product}, function (err, product) {
        if (err) {
            console.log(err);
        } else {
            var galleryDir = 'public/product_images/' + product._id + '/gallery';

            fs.readdir(galleryDir, function (err, files) {
                if (err) {
                    console.log(err);
                } else {
                    galleryImages = files;

                    res.render('product', {
                        title: product.title,
                        p: product,
                        galleryImages: galleryImages,
                        loggedIn: loggedIn
                    });
                }
            });
        }
    });

});


module.exports = router