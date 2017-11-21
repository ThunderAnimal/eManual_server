var mongoose = require('mongoose');
var config = require("config");
var prompt = require('prompt');
var CategoryModel = require('../app/models/Category');


//
// Start the prompt
//
prompt.start();
mongoose.connect(config.database.connectionURL,{ useMongoClient: true });
mongoose.Promise = global.Promise;

prompt.get('categoryName',function (err,result) {

    var category = new CategoryModel({
        name: result.categoryName
    });
    category.save(function(err){
        if(err){
            console.log(err.message);
        }else{
            console.log("The category is now created.");
        }

        process.exit(0);
    });

});