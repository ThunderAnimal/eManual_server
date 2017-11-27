const express = require('express');
const router = express.Router();
const rep = require('../app/models/Representative');
const policy = require('../app/moduls/routePolicy');

const upload = require('../app/moduls/fileUpload');

const productManager = require('../app/moduls/ProductManager');
const categoryManager = require('../app/moduls/CategoryManager');

//API representatives
router.route('/representatives')
    .all(policy.isAuthorized, policy.onlyCompanyAllowed)
    .get( function (req, res, next) {
        rep.find({"company": req.user._id},{name:1},function (err, data) {
            if(err) {
                console.log(err);
                res.status(500).send(err);
            }
            res.status(200).send(data);
        });
    })
    .post(function (req, res, next) {
        const NewRep = new rep({
            login: req.body.login,
            password: req.body.password,
            name: req.body.name,
            company: req.user._id
        });

        NewRep.save().then(function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.status(200).send(result);
            }
        });
    });

//API Products
router.get('/products', productManager.getAll);
router.get('/product/:id', productManager.getOne);
router.post('/product', policy.isAuthorized, policy.onlyRepresentativeAllowed, upload.fields([{ name: 'image'}, { name: 'resources'}]), productManager.create);
router.put('/product/:id',policy.isAuthorized, policy.onlyRepresentativeAllowed, productManager.update);
router.delete('/product/:id',policy.isAuthorized, policy.onlyRepresentativeAllowed, productManager.delete);


//API Categories
router.get('/categories', categoryManager.getAll);
router.get('/category/:id', categoryManager.getOne);
/*
Currently the top categories are:
1. Televisions
2. Bestsellers
3. Projectors
4. Home Entertainment Systems
5. Cameras
 */
router.get('/categories_top', categoryManager.getTopWithCounter);


//API Combined
router.get('/dir_products', function(req, res){
    let cat_list;
    if(!req.query.categorie_list){
        cat_list = [];
    }else{
        cat_list = req.query.categorie_list;
    }

    productManager.getAllInCategories(cat_list, function (err, product_result) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        categoryManager.getAllFromProducts(product_result, function (cat_result) {

            //REMOVE CATEGORIES FROM CALL
            for(let k = 0; k < cat_result.length; k++){
                for(let j = 0; j < cat_list.length; j++) {
                    if (cat_result[k]._id.toString() === cat_list[j].toString()) {
                        cat_result.splice(k, 1);
                    }
                }
            }

            res.status(200).send({productList: product_result, categoryList: cat_result});
        });
    });
});

module.exports = router;