var choosenCategories = [];

$(document).ready(function(){

    var category_list = getParams(window.location.href)['category_id[]'];
    var id = $('#product_id').data('id');

    getProductData(id, renderProductData);
    if(category_list){
        fillChoosenCategories(category_list, function (choosenCategories) {
            getCatData(choosenCategories,renderCatData);
            renderNaviagtion(choosenCategories);
        });
    }else{
        getCatData([], renderCatData);
        renderCatData([]);
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
}

var getCompanyData = function(id, callback){
    $.get('api/v1/company/' + id,function (result) {
        if(!result){
            alert("Woops! Company doesn't exists");
            return;
        }
        callback(result);
    }).fail(function(e) {
        alert('Woops! Error to get Company Data'); // or whatever
        console.log(e);
    });
};

var renderCompanyData = function(data){
    $('#product_brand').text(data.name);
};

var getProductData = function(id, callback){
    $.get('api/v1/product/' + id,function (result) {
        if(!result){
            alert("Woops! Product doesn't exists");
            return;
        }
        getCompanyData(result.company_id, renderCompanyData);
        callback(result);
    }).fail(function(e) {
        alert('Woops! Error to get Product Data'); // or whatever
        console.log(e);
    });
};

var renderProductData = function(data){
    var images = data.productImages;
    var image_list =  $('#product-gallery');

    var materials = data.productResources;
    var material_list = $('#material-list')

    $('#product_name').text(data.productName);
    $('#product_image').attr('src', data.productImages[0]);

    image_list.empty();
    for(var i = 0; i < images.length; i++){
        image_list.append("<li><img src='" + images[i] + "'></li>");
    }

    material_list.empty();
    for(var j = 0; j < materials.length; j++){
        material_list.append('<a href="' + materials[0] + '" target="_blank" class="collection-item" >' + materials[0] + '</a>');
    }



};

var getCatData = function(choosenCategories, callback){
    var cat_list = [];

    for(var i = 0; i < choosenCategories.length; i++){
        cat_list.push(choosenCategories[i].id);
    }
    $.get('api/v1/dir_products', {categorie_list: cat_list}, function(result){
        callback(result);
    });
};

var renderCatData = function(data){
    var cats = data.categoryList;

    var linkBase = '/category';
    if(choosenCategories.length > 0){
        for(var i = 0; i < choosenCategories.length; i++){
            if(i === 0){
                linkBase += '?category_id[]=';
            }else{
                linkBase += '&category_id[]=';
            }
            linkBase += choosenCategories[i].id;
        }
        linkBase += '&category_id[]=';
    }else{
        linkBase += '?category_id[]=';
    }


    var cat_list = $("#cat_list");
    cat_list.empty();
    cat_list.append('<div class="collection-header center-align"><h4>Categories</h4></div>');
    for(var i = 0; i < cats.length; i++){
        cat_list.append('<a href="' + linkBase + cats[i]._id + '" id="' + cats[i]._id + '" name="' + cats[i].name + '" class="collection-item">' + cats[i].name  + '<span class="badge">'+cats[i].count+'</span></a>')
    }
};

var renderNaviagtion = function(choosenCategories){
    var catBreadCrump = $('#category_breadcrumb');

    if(choosenCategories.length <= 0){
        catBreadCrump.hide();
        return;
    }

    catBreadCrump.empty();

    catBreadCrump.append('<a href="/category" id="breadcrump_all" class="breadcrumb">Categories</a>');

    linkBase = '/category' + '?category_id[]=';
    console.log(choosenCategories);
    for(var i = 0; i < choosenCategories.length; i++){
        linkBase += choosenCategories[i].id;
        catBreadCrump.append('<a href="' + linkBase + '" id="' + choosenCategories[i].id + '" class="breadcrumb">' + choosenCategories[i].name + '</a>');
        linkBase += '&category_id[]=';
    }

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