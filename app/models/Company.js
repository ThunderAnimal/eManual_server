const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
    login: {type: String, unique: true, requires: true},
    password: {type: String, requires: true},
    name: {type: String, requires: true},
    isConsumerOptIn: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consumer'
    }],
    serviceProvider_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider'
    }]
});

//SEARCH INDEX for FULL TEXT
companySchema.index({name: 'text'}, {name: "company.search_index"});

module.exports = mongoose.model("Company", companySchema);