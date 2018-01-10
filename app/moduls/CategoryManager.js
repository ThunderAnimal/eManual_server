const MODEL_PATH = '../models/';
const categoryModel = require(MODEL_PATH + 'Category');
const productModel = require(MODEL_PATH + 'Product');






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