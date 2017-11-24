const config = require("config");

exports.getServerUrl = function(adresse, port){
    if(port && port !== ""){
        return adresse + ":" + port;s
    }else{
        return adresse;
    }
};