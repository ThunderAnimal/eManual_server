$(document).ready(function(){
    getProductData();
});


var getProductData = function(){
    $.get('api/v1/company_product', function(result){
        renderProducts(result);
    });
};

var renderProducts = function(data){
    console.log(data);
}