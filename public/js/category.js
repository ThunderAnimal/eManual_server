var choosenCategories = [];

$(document).ready(function(){
    var category_list = getParams(window.location.href)['category_id[]'];


    if(category_list){
        fillChoosenCategories(category_list, function (choosenCategories) {
            getData(choosenCategories);
            renderNaviagtion(choosenCategories);
        });
    }else{
        getData([]);
        renderNaviagtion([]);
    }

});
var fillChoosenCategories = function(cat_list, callback){

    var getCatNameHelper = function(counter){
        if(counter >= cat_list.length){
            callback(choosenCategories);
            return;
        }
        $.get('api/v1/category/' + cat_list[counter], function(result){
            choosenCategories.push({id:result._id, name: result.name});
            counter = counter + 1;
            getCatNameHelper(counter);
        }).fail(function () {
            counter = counter + 1;
            getCatNameHelper(counter);
        });
    };
    getCatNameHelper(0);
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

    var linkBase;
    if(choosenCategories.length <= 0){
        linkBase = window.location.href + '?category_id[]=';
    }else{
        linkBase = window.location.href + '&category_id[]=';
    }

    var productLinkEnd = '';
    for(var i = 0; i < choosenCategories.length; i++){
        productLinkEnd += '&category_id[]=' + choosenCategories[i].id;
    }

    var cat_list = $("#cat_list");
    cat_list.empty();
    cat_list.append('<div class="collection-header center-align"><h4>Categories</h4></div>');
    for(var i = 0; i < cats.length; i++){
        cat_list.append('<a href="' + linkBase + cats[i]._id + '" id="' + cats[i]._id + '" name="' + cats[i].name + '" class="collection-item">' + cats[i].name  + '<span class="badge">'+cats[i].count+'</span></a>')
    }

    var temp = document.getElementById('productTemp'),
        ul = document.getElementById('manualUl');

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    for(var k = 0; k < products.length; k++){
        var clonedTemplate = temp.content.cloneNode(true);
        clonedTemplate.querySelector("h3").innerText = products[k].productName;
        clonedTemplate.querySelector(".product-info a").href = href='/product?id=' + products[k]._id + productLinkEnd;
        clonedTemplate.querySelector(".product-info p").innerText = products[k].productDescription;
        clonedTemplate.querySelector('.product-pic img').src = products[k].profilePicture;
        clonedTemplate.querySelector('.product-select p').textContent = products[k]._id;
        if(products[k].isFavorite){
            clonedTemplate.querySelector('.product-select a.add-selection').style.display= "none";
            clonedTemplate.querySelector('.product-select a.remove-selection').style.display= "";
        }else{
            clonedTemplate.querySelector('.product-select a.add-selection').style.display= "";
            clonedTemplate.querySelector('.product-select a.remove-selection').style.display= "none";
        }
        clonedTemplate.querySelector('.product-select a.add-selection').addEventListener("click",function () {
            var that = this;
            this.style.display = "none";
            var e = this.parentNode.childNodes[1];
            var pID = this.parentNode.childNodes[2].textContent;
            $.ajax({
                url: 'api/v1/selected_product',
                type: 'PUT',
                data:{add:true,product_id:pID},
                success: function(res) {
                    console.log(res);
                    e.style.display="";
                },
                error: function (err) {
                    that.style.display = "";
                    console.log(err);
                    if(err.status === 401){
                        alert("Log in is required for select product");
                    }else if(err.status === 403){
                        alert("Only consumer can select products");
                    }
                }
            });
        });
        clonedTemplate.querySelector('.product-select a.remove-selection').addEventListener("click",function () {
            var that = this;
            this.style.display = "none";
            var e = this.parentNode.childNodes[0];
            var pID =this.parentNode.childNodes[2].textContent;
            $.ajax({
                url: 'api/v1/selected_product',
                type: 'PUT',
                data:{delete:true,product_id:pID},
                success: function(res) {
                    console.log(res);
                    e.style.display="";
                },
                error: function (err) {
                    that.style.display = "";
                    console.log(err);
                    if(err.status === 401){
                        alert("Log in is required for select product");
                    }else if(err.status === 403){
                        alert("Only consumer can select products");
                    }
                }
            });


        });
        ul.appendChild(clonedTemplate);
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

    catBreadCrump.append('<a href="/category" id="breadcrump_all" class="breadcrumb">Categories</a>');

    var linkBase = '/category' + '?category_id[]=';
    for(var i = 0; i < choosenCategories.length; i++){
        linkBase += choosenCategories[i].id;
        catBreadCrump.append('<a href="' + linkBase + '" id="' + choosenCategories[i].id + '" class="breadcrumb">' + choosenCategories[i].name + '</a>');
        linkBase += '&category_id[]=';
    }

    currentCatTitle.show();
    catBreadCrump.show();
};

function getParams(url) {
    var regex = /([^=&?]+)=([^&#]*)/g, params = {}, parts, key, value;

    while((parts = regex.exec(url)) != null) {

        key = parts[1], value = parts[2];
        var isArray = /\[\]$/.test(key);

        if(isArray) {
            params[key] = params[key] || [];
            params[key].push(value);
        }
        else {
            params[key] = value;
        }
    }

    return params;
}