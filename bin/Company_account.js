var mongoose = require('mongoose');
var config = require("config");
var prompt = require('prompt');
var CompanyModel = require('../app/models/Company');

//
// Start the prompt
//
prompt.start();
mongoose.connect(config.database.connectionURL, { useMongoClient: true });
mongoose.Promise = global.Promise;


//
// Get two properties from the user: username and email
//
prompt.get(['username', 'email','password'], function (err, result) {
    //
    // Log the results.
    //
    console.log('Command-line input received:');
    console.log('  username: ' + result.username);
    console.log('  email: ' + result.email);
    console.log('password:'+ result.password);

    var company = new CompanyModel({
        login: result.email,
        password: result.password,
        name: result.username
    });
    company.save(function(){
        console.log("The account is now created.")
        process.exit(0);
    });

});
