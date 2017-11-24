const config = require("config");

exports.getServerUrl = function(adresse, port){
    if (config.util.getEnv('NODE_ENV') === 'production'){
        return adresse;
    }

    if(port && port !== ""){
        return adresse + ":" + port;s
    }else{
        return adresse;
    }
};