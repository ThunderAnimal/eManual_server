var mongoose = require('mongoose');
var config = require("config");

var CompanyModel = require('../app/models/Company');
var RepresentativeModel = require('../app/models/Representative');
var CategoryModel = require('../app/models/Category');

var dropData = function (done) {
    CompanyModel.remove({}, function(){
        RepresentativeModel.remove({}, function () {
            CategoryModel.remove({}, done);
        });
    });
};

var createData = function(done){


    var company = new CompanyModel({
        login: "admin@sony.com",
        password: "1234",
        name: "Sony"
    });
    company.save(function(err){
        var represent1 = new RepresentativeModel({
            login: "martin@sony.com",
            password: "1234",
            name: "Martin",
            company: company._id
        });

        var represent2 = new RepresentativeModel({
            login: "robert@sony.com",
            password: "1234",
            name: "Robert",
            company: company._id
        });
        var represent3 = new RepresentativeModel({
            login: "anna@sony.com",
            password: "1234",
            name: "Anna",
            company: company._id
        });

        var represent4 = new RepresentativeModel({
            login: "Adele@sony.com",
            password: "1234",
            name: "Adele",
            company: company._id
        });

        var batchInsert = [represent1, represent2, represent3, represent4];
        RepresentativeModel.collection.insert(batchInsert, done);
    });
};

var createCategories = function(done){
    var cat1 = new CategoryModel({
        name: "TV"
    });
    var cat2 = new CategoryModel({
        name : "DVD-Player"
    });
    var cat3 = new CategoryModel({
        name : "Hifi-System"
    });

    cat1.save(function () {
        cat2.save(function () {
            cat3.save(function () {
                done();
            });
        });
    });
};

mongoose.connect(config.database.connectionURL, { useMongoClient: true });
mongoose.Promise = global.Promise;

console.log("Setup Databse");
console.log("---");

console.log("Drop Data");
dropData(function () {
    console.log("Add Data");
    createData(function(){
        createCategories(function () {
            console.log("---");
            console.log("Finished");
            process.exit(0);
        });
    });
});