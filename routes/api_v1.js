var express = require('express');
var router = express.Router();
var rep = require('../app/models/Representative');
var policy = require('../app/moduls/routePolicy');

var upload = require('../app/moduls/fileUpload');

var categoryModel = require('../app/models/Category');

var productManager = require('../app/moduls/ProductManager');

//API representatives
router.route('/representatives')
    .all(policy.onlyCompanyAllowed)
    .get( function (req, res, next) {

        rep.find({"company": req.user._id},{name:1},function (err, data) {
            if(err){
                console.log(err);
            }
            res.send(data);
        }).catch(function(e){
            var err = new Error(e);
            err.status = 500;
            next(err);
        });
    })
    .post(function (req, res, next) {
        var NewRep = new rep({
            login: req.body.login,
            password: req.body.password,
            name: req.body.name,
            company: req.user._id
        });

        NewRep.save().then(function (err, result) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).send(result);
            }
        });
    });

//API Products
router.get('/products', productManager.getAll);
router.get('/product/:_id', productManager.getOne);
router.post('/product', policy.onlyRepresentativeAllowed, upload.fields([{ name: 'image'}, { name: 'resources'}]), productManager.create);
router.put('/product/:_id', policy.onlyRepresentativeAllowed, productManager.update);
router.delete('/product/:_id', policy.onlyRepresentativeAllowed, productManager.delete);


//API Categories
router.get('/categories', function(req, res){
    categoryModel.find({},function (err, result) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }else{
            res.status(200).send(result);
        }
    });
});

module.exports = router;