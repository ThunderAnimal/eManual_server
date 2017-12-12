
$(document).ready(function(){
    getProductData();
    var top = $('#btn_cat').position().top + "px";
    
    $('#btn_cat').on('click',function () {
        $('#dropdown1').css({"top": top});
    });
    $('#count').on('click',function () {
        getProductData(3,1);
    });
    $('#countR').on('click',function () {
        getProductData(3,0);
    });
    $('#name').on('click',function () {
        getProductData(2,0);
    });
    $('#nameR').on('click',function () {
        getProductData(2,1);
    });
});


var getProductData = function(fieldName,order){
    document.getElementById('manualUl').innerHTML = "";
    $.get('api/v1/company_product',{fieldName, order},function(result){
        renderProducts(result);
    });
};

var renderProducts = function(data){
    var temp = document.getElementById('productTemp'),
        ul = document.getElementById('manualUl');
    for(var product in data){
        var clonedTemplate = temp.content.cloneNode(true);

        clonedTemplate.querySelector(".product-info a").href = '/product?id=' + data[product]._id;
        clonedTemplate.querySelector(".product-edit a").href = '/representatives/updateProduct?id=' + data[product]._id;
        clonedTemplate.querySelector("h3").innerText = data[product].productName;
        clonedTemplate.querySelector("p1").innerText="Selected by: "+data[product].favorites;
        clonedTemplate.querySelector('.pic').src = data[product].profilePicture;

        ul.appendChild(clonedTemplate);
    }
}