var choosenCategories = [];

$(document).ready(function(){

    if(getParameterByName("category_id"))
        choosenCategories.push(getParameterByName("category_id"));

    $("#cat_list").on("click", "a", function (e) {
        choosenCategories.push($(this).attr("id"));
        getData();
    });

    getData();
});

var getData = function(){
    $.get('api/v1/dir_products', {categorie_list: choosenCategories}, function(result){
        renderData(result);
    });
};

var renderData = function(data){
    var cats = data.categoryList;
    var products = data.productList;

    var cat_list = $("#cat_list");
    var product_block = $("#product_block");

    cat_list.empty();
    cat_list.append('<li class="collection-header"><h4>Categories</h4></li>');
    for(var i = 0; i < cats.length; i++){
        cat_list.append('<a id="' + cats[i]._id + '" class="collection-item">' + cats[i].name  + '<span class="badge">'+cats[i].count+'</span></a>')
    }

    product_block.empty();
    for(var k = 0; k < products.length; k++){
        product_block.append("<div class=\"col s12 m6 l4\">\n" +
            "            <div class=\"card\">\n" +
            "            <div class=\"card-image\">\n" +
            "            <img src=\"" + products[k].productImages[0] + "\">\n" +
            "            <a class=\"btn-floating halfway-fab waves-effect waves-light red\"><i class=\"material-icons\">add</i></a>\n" +
            "            </div>\n" +
            "            <div class=\"card-content\">\n" +
            "            <p>"+ products[k].productName +"</p>\n" +
            "            </div>\n" +
            "            </div>\n" +
            "            </div>\n")
    }
};

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}