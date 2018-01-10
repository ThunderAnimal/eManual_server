const MODEL_PATH = '../models/';
const MODUL_PATH = '../moduls/';
const consumerModel = require(MODEL_PATH + 'Consumer');
const productModel = require(MODEL_PATH + 'Product');
const categoryModel = require(MODEL_PATH + 'Category');
const companyManager = require(MODUL_PATH+'CompanyManager');
const productManager = require(MODUL_PATH+'ProductManager');

const serviceProviderModel = require(MODEL_PATH + 'ServiceProvider');

exports.productDirectory = (req, res) => {

    let cat_list;

    if(!req.query.categorie_list){
        cat_list = [];
    }else{
        cat_list = req.query.categorie_list;
    }

    productManager.getAllInCategories(req, cat_list, function (err, product_result) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        categoryManager.getAllFromProducts(product_result, function (cat_result) {
            //REMOVE CATEGORIES FROM CALL
            cat_result = cat_result.filter(function(value){
                return cat_list.indexOf(value._id.toString()) === -1;
            });

            res.status(200).send({productList: product_result, categoryList: cat_result});
        });
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