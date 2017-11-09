var utils = require('./utils');

describe('Routes Policy REST API', function(){
    before(function(done){
        done();
    });
    after(function(done){
        done()
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
                .get('/api/v1/representives')
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
                .get('/api/v1/representives' +'?token=' + "1234567890")
                .end(function (err, res) {
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql(401);
                    res.body.should.have.property('message').eql("Not Authorized. Invalid Token!");
                    done();
                });
        });
    });
});