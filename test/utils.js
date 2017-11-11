process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../bin/www');
var should = chai.should();

var authManger = require('../app/moduls/authManager');

var CompanyModel = require('../app/models/Company');
var RepresentativeModel = require('../app/models/Representative');


chai.use(chaiHttp);

exports.createCompany = function(done){
    var company = new CompanyModel({
        login: "admin@sony.com",
        password: "1234",
        name: "Sony"
    });
    company.save(done)
};

exports.createRepresentative = function(companyId, done){
    var represent = new RepresentativeModel({
        login: "martin@sony.com",
        password: "1234",
        name: "Martin",
        company: companyId
    });
    represent.save(done)
};

exports.dropCompanyCollection = function(done){
    CompanyModel.remove({}, done);
};

exports.dropRepresentativeCollection = function(done){
    RepresentativeModel.remove({}, done);
};

exports.getValidTokenCompany = function(company, done){
    done(authManger.generateJWT(authManger.loginUser(company)));
};

exports.getValidTokenRepresentative = function(representative, done){
    done(authManger.generateJWT(authManger.loginUser(representative)));
};

exports.chai = chai;
exports.server = server;
exports.should = should;