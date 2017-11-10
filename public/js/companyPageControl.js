//var ajax = require("./ajax");

var SSbutton = document.querySelector(".SSbutton");


reqGet({method:"GET",url:"/api/v1/representives"})
    .then(function (data) {
        var json = JSON.parse(data);
        document.querySelector(".testp").innerText= "Number of representives are "+json.data;
        console.log(data);
    });


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
