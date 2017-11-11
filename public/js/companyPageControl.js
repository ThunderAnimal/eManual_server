//TODO need to find a way to seprate ajax and controller.
//var ajax = require("./ajax");

reqGet({method:"GET",url:"/api/v1/representives"})
    .then(function (data) {
        var json = JSON.parse(data);
        document.querySelector("div#Repr p.N").innerText= json.data;
        console.log(data);
    });

document.querySelector("img.addRep").onclick = function () {
    var represent = {
        login:"testCase",
        password:"caseTest",
        name:"Bob",
        company:"0"
    };
    var json = JSON.stringify(represent);
    reqPost({method:"POST",url:"/api/v1/representives/create",json:json}).then(function (data) {
        var json = JSON.parse(data);
        var RepNameTemp = document.getElementById('RepNameTemp'),
            ul = document.getElementById('RepUL'),
            clonedTemplate = RepNameTemp.content.cloneNode(true);
        clonedTemplate.querySelector("p").innerText = "Bob";
        ul.appendChild(clonedTemplate);
    })
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