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

    cat_list.empty();
    cat_list.append('<div class="collection-header center-align"><h4>Categories</h4></div>');
    for(var i = 0; i < cats.length; i++){
        cat_list.append('<a id="' + cats[i]._id + '" name="' + cats[i].name + '" class="collection-item">' + cats[i].name  + '<span class="badge">'+cats[i].count+'</span></a>')
    }

    var temp = document.getElementById('productTemp'),
        ul = document.getElementById('manualUl');

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    for(var k = 0; k < products.length; k++){
        var clonedTemplate = temp.content.cloneNode(true);
        clonedTemplate.querySelector("h3").innerText = products[k].productName;
        clonedTemplate.querySelector(".product-info a").href = href='/product?id=' + products[k]._id;
        clonedTemplate.querySelector('.pic').src = products[k].productImages[0];
        clonedTemplate.querySelector('.product-select p').textContent = products[k]._id;
        if(products[k].selected){
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
                    console.log(err.status);
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