var utils = require('./utils');

var token_company, token_representative;
describe('Routes Policy REST API', function(){
    before(function(done){
        utils.createCompany(function(err, company){
            utils.createRepresentative(company._id, function(err,representative){
                utils.getValidTokenCompany(company, function (token_c) {
                    token_company = token_c;
                    utils.getValidTokenRepresentative(representative, function(token_r){
                        token_representative = token_r;
                        done();
                    })
                })
            });
        })
    });
    after(function(done){
        utils.dropCompanyCollection(function(){
            utils.dropRepresentativeCollection(done);
        })
    });

    describe('/GET Endpoint - no token needed', function () {
        it('is should get a 200 status', function (done) {
            utils.chai.request(utils.server)
                .get('/')
                .end(function (err, res) {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    describe('/GET Secure API - token needed', function () {
        it('without token - it should get a 401 status', function (done) {
            utils.chai.request(utils.server)
                .get('/api/v1/representatives')
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(401);
                    res.body.should.have.property('message').eql("Not Authorized. No token provided!");
                    done();
                });
        });
        it('invalid token - it should get a 401 status', function (done) {
            utils.chai.request(utils.server)
                .get('/api/v1/representatives' +'?token=' + "1234567890")
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(401);
                    res.body.should.have.property('message').eql("Not Authorized. Invalid Token!");
                    done();
                });
        });
        it('valid token - it should get a 200 status', function (done) {
            utils.chai.request(utils.server)
                .get('/api/v1/representatives' +'?token=' + token_company)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

    });
    describe('/GET Secure API Company -  Company token needed', function () {
        it('Representative Token - it should get a 403 status', function (done) {
            utils.chai.request(utils.server)
                .get('/api/v1/representatives' +'?token=' + token_representative)
                .end(function (err, res) {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(403);
                    res.body.should.have.property('message').eql("Forbidden! Only Company is allowed to access.");
                    done();
                });
        });
        it('Company Token - is should get a 200 status', function (done) {
            utils.chai.request(utils.server)
                .get('/api/v1/representatives' +'?token=' + token_company)
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });

    });
});