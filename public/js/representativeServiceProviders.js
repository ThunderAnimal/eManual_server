$(document).ready(function(){
    getServiceData();
});


var getServiceData = function(){
    $.get('api/v1/service_providers',function(result){
        renderServiceList(result);
    });
};

var renderServiceList = function(data){
    console.log(data);

    var temp = document.getElementById('serviceProviderTemp'),
        ul = document.getElementById('serviceUl');
    for(var serviceProvider in data){
        var clonedTemplate = temp.content.cloneNode(true);

        clonedTemplate.querySelector("h3").innerText = data[serviceProvider].name;

        ul.appendChild(clonedTemplate);
    }
}