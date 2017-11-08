var express = require('express');
var router = express.Router();

router.get('/representives', function (req, res, next) {
    //TODO GET DATA FROM DATABASE
    res.send({data: "dummydata"});
});

module.exports = router;