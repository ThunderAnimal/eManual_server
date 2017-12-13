var mongoose = require('mongoose');
var config = require("config");
var prompt = require('prompt');
var serviceProviderModel = require('../app/models/ServiceProvider');

//
// Start the prompt
//
prompt.start();
mongoose.connect(config.database.connectionURL, { useMongoClient: true });
mongoose.Promise = global.Promise;

prompt.get(['serviceProvider_name', 'serviceProvider_email','serviceProvider_password'], function (err, result) {
    //
    // Log the results.
    //
    console.log('Command-line input received:');
    console.log('   Service Provider: ' + result.serviceProvider_name);
    console.log('   email: ' + result.serviceProvider_email);
    console.log('   password:'+ result.serviceProvider_password);

    var serviceProvider = new serviceProviderModel({
        login: result.serviceProvider_email,
        password: result.serviceProvider_password,
        name: result.serviceProvider_name,
    });
    serviceProvider.save(function(){
        console.log("The account for the service provider is now created.");
        process.exit(0);
    });

});
