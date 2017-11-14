//TODO need to find a way to seprate ajax and controller.
//var ajax = require("./ajax");
var Rep;

if(window.location.href.endsWith("/company/dashboard")){
    reqGet({method:"GET",url:"/api/v1/representatives"})
        .then(function (data) {
            var context = data;
            var repNumber = 0;
            var json = JSON.parse(data);
            console.log(json);

            if(document.getElementById('RepUL') !== null){
                json.forEach(function (representative) {
                    repNumber++;
                    var RepNameTemp = document.getElementById('RepNameTemp'),
                        ul = document.getElementById('RepUL'),
                        clonedTemplate = RepNameTemp.content.cloneNode(true);
                    clonedTemplate.querySelector("p").innerText = representative.name;
                    ul.appendChild(clonedTemplate);
                });
            }
            if(document.querySelector("div#Repr p.N") !== null){
                document.querySelector("div#Repr p.N").innerText= repNumber;
            }
        });
}
if(document.querySelector("div.content form") !==null){
    $(document).ready(function() {
        $('.content form')
            .ajaxForm({
                url : '/api/v1/representatives', // or whatever
                dataType : 'json',
                success : function (response) {
                    //TODO check for err
                    window.location.href = "../company/dashboard";
                }
            })
        ;
    });
}

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