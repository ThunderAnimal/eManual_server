var choosenCategories = [];

$(document).ready(function(){

    $('#provider_select').material_select();

    var category_list = getParams(window.location.href)['category_id[]'];
    var id = $('#product_id').data('id');




    getProductData(id, renderProductData);
    if(category_list){
        fillCategories(category_list, function (cat_list) {
            choosenCategories = cat_list;
            getCatData(choosenCategories,renderCatData);
            renderNaviagtion(choosenCategories);
        });
    }else{
        getCatData([], renderCatData);
    }

    $("form#sendMailProvider").ajaxForm({
        url: '/api/v1/consumer/contact/service_provider',
        success: function (res) {
            console.log(res);
            $('#send-message-modal').modal('close');
            Materialize.toast('Request send!');

        },
        error: function (err) {
            console.log(err);
            if(err.responseJSON._error){
                alert("Woops! Something went wrong: \n\n" + err.responseJSON.error);
            }else{
                alert("error");
            }
        }
    });

    $('#btnRequestHelp').click(function () {
        var productId = $('#product_id').data('id');
        getProvidersData(productId);
        $('#send-message-modal').modal('open');
    });

    $('.add-selection').click(function () {
        var that = $(this);
        that.hide();

        $.ajax({
            url: 'api/v1/selected_product',
            type: 'PUT',
            data:{add:true,product_id:id},
            success: function(res) {
                $('.remove-selection').show();
            },
            error: function (err) {
                that.show()();
                console.log(err);
                if(err.status === 401){
                    alert("Log in is required for select product");
                }else if(err.status === 403){
                    alert("Only consumer can select products");
                }else{
                    alert("Woops! Something went wrong, sry.");
                }
            }
        });
    });

    $('.remove-selection').click(function () {
        var that = $(this);
        that.hide();

        $.ajax({
            url: 'api/v1/selected_product',
            type: 'PUT',
            data:{add:false,product_id:id},
            success: function(res) {
                $('.add-selection').show();
            },
            error: function (err) {
                that.show();
                console.log(err);
                if(err.status === 401){
                    alert("Log in is required for select product");
                }else if(err.status === 403){
                    alert("Only consumer can select products");
                }else{
                    alert("Woops! Something went wrong, sry.");
                }
            }
        });
    });
});

$('#send-message-modal').modal({
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
    }
});

var fillCategories = function(cat_list, callback){
    var newCatList = [];
    var getCatNameHelper = function(counter){

        if(counter >= cat_list.length){
            callback(newCatList);
            return;
        }
        $.get('api/v1/category/' + cat_list[counter], function(result){
            newCatList.push({id:result._id, name: result.name});
            counter = counter + 1;
            getCatNameHelper(counter);
        }).fail(function () {
            counter = counter + 1;
            getCatNameHelper(counter);
        });
    };
    getCatNameHelper(0);
};

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
        fillCategories(result.categories, renderProductCategories);
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
    var material_list = $('#material-list');

    var links = data.productLinks;

    $('#product_name').text(data.productName);
    $('#product_description').text(data.productDescription);

    $('#product_image').attr('src', data.profilePicture);

    if(data.isFavorite){
        $('.add-selection').hide();
        $('.remove-selection').show();
    }else{
        $('.remove-selection').hide();
        $('.add-selection').show();
    }

    image_list.empty();
    for(var i = 0; i < images.length; i++){
        image_list.append("<li><img src='" + images[i] + "'></li>");
    }

   // material_list.empty();
    console.log(materials);
    for(var j = 0; j < materials.length; j++){
        var imgUrl = "assets/img/papers-64.png";

        if(materials[j].dataType.toLocaleLowerCase().includes("pdf")){
            imgUrl = "assets/img/pdf.png";
        }
        material_list.append('<li class="collection-item avatar">\n' +
            '<a href="' + materials[j].url +'" target="_blank" >' +
            '      <img src="' + imgUrl +'" alt=""> \n' +
            '      <span class="title">' + materials[j].description + '</span>\n' +
            '          <p>' + materials[j].originalName + ' </p>\n' +
            '</a>' +
            '    </li>');
    }

    var imgUrl = "assets/img/youtube.png";
    for(var j = 0; j < links.length; j++){

        material_list.append('<li class="collection-item avatar">\n' +
            '<a href="' + links[j].url +'" target="_blank" >' +
            '      <img src="' + imgUrl +'" alt=""> \n' +
            '      <span class="title">' + links[j].description + '</span>\n' +
            '</a>' +
            '    </li>');
    }



};

var renderProductCategories = function(cat_list){
    var categorie_list = $('#category_list');

    categorie_list.empty();
    linkBase = '/category' + '?category_id[]=';
    for(var i = 0; i < cat_list.length; i++){
        categorie_list.append('<a href="' + linkBase + cat_list[i].id + '" id="' + cat_list[i].id + '" class="breadcrumb">' + cat_list[i].name + '</a>');
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
    }else{
        $('#category_list').hide();
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

var getProvidersData = function(product_id){
    $.get('api/v1/product/' + product_id + '/service_provider', function(result){
        renderProvidersData(result);
    });
};

var renderProvidersData = function(data){
    var list = $('#provider_select');

    list.empty();
    list.append('<option value="" disabled> Choose Service Providers</option>');

    for(var i = 0; i < data.length; i++){
        list.append("<option value='" + data[i]._id + "' id='" + data[i]._id + "'>" + data[i].name  + "</option>");
    }
    list.material_select();

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