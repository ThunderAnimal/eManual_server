module.exports = {
    get:reqGet,
    post:reqPost
};

function reqGet(config) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();

        req.addEventListener("load",function () {
            if(req.status >= 400){
                reject(req.status);
            }
            resolve(req.responseText);
        });
        req.open(config.method,config.url);
        req.send();
    })
}

function reqPost(config) {
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();

        req.addEventListener("load",function () {
            if(req.status >= 400){
                reject(req.status);
            }
            resolve(req.responseText);
        });
        req.open(config.method,config.url);
        req.setRequestHeader("Content-type","application/json");
        req.send(config.json);
    })
}
