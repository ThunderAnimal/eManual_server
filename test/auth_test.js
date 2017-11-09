var utils = require('./utils');

describe('Authentification REST API', function(){
    before(function(done){
        //TODO create USER iN DB
        done()
    });
    after(function(done){
        //TODO delte USER in DB
        done()
    });

    describe('/POST LOGIN', function () {
        it('Without parameter - it should get a 400 Bad Request status', function (done) {
            utils.chai.request(utils.server)
                .post('/auth/login_api')
                .send()
                .end(function (err, res) {
                    res.should.have.status(400);
                    done();
                });
        });

        it('Wrong email - it should get a 401 Unauthorized status', function (done) {
            utils.chai.request(utils.server)
                .post('/auth/login_api')
                .send({"email":"a@c.com","password":"1234"})
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });

        it('Wrong password - it should get a 401 Unauthorized status', function (done) {
            utils.chai.request(utils.server)
                .post('/auth/login_api')
                .send({"email":"a@b.com","password":"1233"})
                .end(function (err, res) {
                    res.should.have.status(401);
                    done();
                });
        });

        it('Correct Login - it should get a token', function (done) {
            utils.chai.request(utils.server)
                .post('/auth/login_api')
                .send({"email":"a@b.com","password":"1234"})
                .end(function (err, res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('token');
                    done();
                });
        });

    });
});