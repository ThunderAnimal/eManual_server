const categoryModel = require('../models/Category');
const productModel = require('../models/Product');


exports.getOne = function(req, res) {
    categoryModel.findOne({_id : req.params.id}, function(err, result) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        }else{
            res.status(200).send(result);
        }
    });
};

exports.getAll = function(req, res, next) {
    categoryModel.find({}, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(200).send(result);
        }

    });
};

exports.getTopWithCounter = function(req, res, next){
    let topCatList = [
        "Televisions",
        "Bestsellers",
        "Projectors",
        "Home Entertainment Systems",
        "Cameras"
    ];



    function addCategoryNames(done){

        let finalCatArray = [];
        const helperAddCategoryNames = function (counter) {
            if(counter === topCatList.length){
                done(finalCatArray);
                return;
            }

            categoryModel.findOne({"name": topCatList[counter]}, function (err, cat) {
                if (err) {
                    console.log(err);
                    counter += 1;
                    helperAddCategoryNames(counter);
                    return;
                }

                if(!cat){
                    console.log("Categorie not found!");
                    counter += 1;
                    helperAddCategoryNames(counter);
                    return;
                }

                finalCatArray.push({
                    _id: cat._id,
                    name: cat.name,
                    count: 0
                });
                counter += 1;
                helperAddCategoryNames(counter);
            });
        };

        helperAddCategoryNames(0);
    }

    addCategoryNames(function(finalCatArray){
        productModel.find({}, function(err, data){
            if (err){
                console.log("Error!!");
                res.status(500).send(err);
            }
            for (let i=0; i<finalCatArray.length; i++){
                for (let j=0; j<data.length; j++){
                    for (let k=0; k<data[j].categories.length; k++){
                        if (finalCatArray[i]._id.toString() === data[j].categories[k].toString()){
                            finalCatArray[i].count+=1;
                            break;
                        }
                    }
                }
            }
            res.status(200).send(finalCatArray);
        })
    });
};

exports.getAllFromProducts = function (product_list, done) {
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


    let cat_collection = [];

    for (let i = 0; i < product_list.length; i++) {
        for (let j = 0; j < product_list[i].categories.length; j++) {
            cat_collection.push(product_list[i].categories[j]);
        }
    }

    cat_collection = addCategoryCounterArray(cat_collection);

    addCategoryNames(cat_collection, function (cat_result) {
        done(cat_result);
    });
};