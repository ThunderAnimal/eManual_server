var express = require('express');
var router = express.Router();

router.get('/representives', function (req, res, next) {
    //TODO GET DATA FROM DATABASE
    res.send({data: "0"});
});

router.post('/representives/create', function (req, res, next) {
    //TODO GET DATA FROM DATABASE
    console.log("hi");
    res.send({name:"Bob"});
});
module.exports = router;