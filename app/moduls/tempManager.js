//Importing Products
const productModel = require('../models/Product');

//Importing Categories
const categoryModel = require('../models/Category');


exports.doSomething = function (req, res) {

    function addCategoryCounterArray(categoriesList){

        let returnList = [];
        let found = false;
        for (let i=0; i<categoriesList.length; i++){
            found = false;
            for (let j=0; j<returnList.length; j++){
                if (returnList[j]._id.toString() === categoriesList[i].toString()){
                    returnList[j].count +=1;
                    found = true;
                    break;
                }
            }
            if(!found){
                returnList.push({
                    _id: categoriesList[i],
                    count: 1
                });
            }
        }

        return returnList;
    }

    function addCategoryNames(categorieList, done){

        let returnList = [];
        const helperAddCategoryNames = function (counter) {
            if(counter === categorieList.length){
                done(returnList);
                return;
            }

            categoryModel.findOne({"_id": categorieList[counter]._id}, function (err, cat) {
                if (err) {
                    console.log(err);
                    counter += 1;
                    helperAddCategoryNames(counter);
                }else{
                    returnList.push({
                        _id: cat._id,
                        name: cat.name,
                        count: categorieList[counter].count
                    });
                    counter += 1;
                    helperAddCategoryNames(counter);
                }
            });
        };

        helperAddCategoryNames(0);
    }

    let categoriesList = [];
    let cat_collection = [];
    let query_products;

    let cat_list = req.body.categorie_list;
    cat_list = ['5a1ab6230680f03fe02259da'];
    if(!cat_list){
        query_products = {};
    }else{
        query_products = {"categories": {"$in" : cat_list}};
    }


    productModel.find(query_products, function (err, product_result) {
        if (err) {
            console.log(err);
            const err = new Error(err);
            err.status = 500;
            next(err);
        }

        for (let i = 0; i < product_result.length; i++) {
            for (let j = 0; j < product_result[i].categories.length; j++) {
                cat_collection.push(product_result[i].categories[j]);
            }
        }
        console.log(product_result);

        console.log(cat_collection);

        categoriesList = addCategoryCounterArray(cat_collection);

        console.log(categoriesList);

        for(let k = 0; k < categoriesList.length; k++){
            for(let j = 0; j < cat_list.length; j++) {
                if (categoriesList[k]._id.toString() === cat_list[j].toString()) {
                    console.log(k);
                    categoriesList.splice(k, 1);
                }
            }
        }

        console.log(categoriesList);

        addCategoryNames(categoriesList, function (cat_result) {
            res.send({productList: product_result, categoryList: cat_result});
        });
    }).catch(function (e) {
        const err = new Error(e);
        err.status = 500;
        next(err);
    });
};