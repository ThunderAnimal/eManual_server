var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
    res.render('index', { title: 'Hey', message: 'Hello there!'});
});
router.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

module.exports = router;
