$(document).ready(function(){
    getProductData();
});


var getProductData = function(){
    $.get('api/v1/company_product', function(result){
        renderProducts(result);
    });
};

var renderProducts = function(data){
    var temp = document.getElementById('productTemp'),
        ul = document.getElementById('manualUl');
    for(var product in data){
        var clonedTemplate = temp.content.cloneNode(true);

        clonedTemplate.querySelector(".product-info a").href = '/representatives/updateProduct?id=' + data[product]._id;
        clonedTemplate.querySelector("h3").innerText = data[product].productName;
        clonedTemplate.querySelector('.pic').src = data[product].profilePicture;

        ul.appendChild(clonedTemplate);;
    }
}