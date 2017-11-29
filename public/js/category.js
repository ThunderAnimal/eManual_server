var choosenCategories = [];

$(document).ready(function(){

    if(getParameterByName("category_id")){
        $.get('api/v1/category/' + getParameterByName("category_id"), function(result){
            addChooseCategorie(result._id, result.name);
        }).fail(function () {
            getData(choosenCategories);
            renderNaviagtion(choosenCategories);
        });
    }else{
        getData(choosenCategories);
        renderNaviagtion(choosenCategories);
    }


    $("#cat_list").on("click", "a", function (e) {
        addChooseCategorie($(this).attr("id"), $(this).attr("name"));
        choosenCategories.push();
        getData();
    });

    $('#category_breadcrumb').on("click", "a", function (e) {
        if(!$(this).attr("id")){
            return;
        }

        if($(this).attr("id") === 'breadcrump_all'){
            choosenCategories = [];
            getData(choosenCategories);
            renderNaviagtion(choosenCategories);
        }else{
            removesChooseCategorie($(this).attr("id"));
        }

    });
});

var addChooseCategorie = function(id, name){
    for(var i = 0; i < choosenCategories.length; i++){
        if(choosenCategories[i].id === id){
            return;
        }
    }
    choosenCategories.push({
       id: id,
       name: name
    });

    renderNaviagtion(choosenCategories);
    getData(choosenCategories);

};

var removesChooseCategorie = function(id){
    for(var i = 0; i < choosenCategories.length; i++){
        if(choosenCategories[i].id === id){
            choosenCategories.splice(i + 1);
            renderNaviagtion(choosenCategories);
            getData(choosenCategories);
        }
    }
};

var getData = function(choosenCategories){
    var cat_list = [];

    for(var i = 0; i < choosenCategories.length; i++){
        cat_list.push(choosenCategories[i].id);
    }
    $.get('api/v1/dir_products', {categorie_list: cat_list}, function(result){
        renderData(result);
    });
};

var renderData = function(data){
    var cats = data.categoryList;
    var products = data.productList;

    var cat_list = $("#cat_list");
    var product_block = $("#product_block");

    cat_list.empty();
    cat_list.append('<div class="collection-header center-align"><h4>Categories</h4></div>');
    for(var i = 0; i < cats.length; i++){
        cat_list.append('<a id="' + cats[i]._id + '" name="' + cats[i].name + '" class="collection-item">' + cats[i].name  + '<span class="badge">'+cats[i].count+'</span></a>')
    }

    product_block.empty();
    for(var k = 0; k < products.length; k++){
        product_block.append("<div class=\"col s6 m4 l3\">\n" +
            "            <div class=\"card small\">\n" +
            "            <div class=\"card-image\">\n" +
            "            <img class='' src=\"" + products[k].productImages[0] + "\">\n" +
            "            <a class=\"btn-floating halfway-fab waves-effect waves-light materialize-red\"><i class=\"material-icons\">add</i></a>\n" +
            "            </div>\n" +
            "            <div class=\"card-content\">\n" +
            "            <p><a href='/product?id=" + products[k]._id +"'>"+ products[k].productName +"</a></p>\n" +
            "            </div>\n" +
            "            </div>\n" +
            "            </div>\n")
    }
};

var renderNaviagtion = function(choosenCategories){
    var currentCatTitle = $('#current_cat');
    var catBreadCrump = $('#category_breadcrumb');

    if(choosenCategories.length <= 0){
        currentCatTitle.hide();
        catBreadCrump.hide();
        return;
    }

    currentCatTitle.text(choosenCategories[choosenCategories.length - 1].name);
    catBreadCrump.empty();

    catBreadCrump.append('<a id="breadcrump_all" class="breadcrumb">Categories</a>');
    for(var i = 0; i < choosenCategories.length; i++){
        catBreadCrump.append('<a id="' + choosenCategories[i].id + '" class="breadcrumb">' + choosenCategories[i].name + '</a>');
    }

    currentCatTitle.show();
    catBreadCrump.show();
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