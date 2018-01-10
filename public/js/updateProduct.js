var removeImages = [];
var removeRessources = [];


$(document).ready(function(){
    var id = $('#product_id').data('id');

    $('select').material_select();
    getCategorieData(function(cat_list){
        getProductData(id, function (product_data) {
            renderProductData(product_data, cat_list)
        });
    });

    $('#ResourcesList').on('click', '.add-rescource-fields', function (e) {
        var resourceTemp = document.getElementById('ResourceFields');
        var resourceFields = document.getElementById('ResourcesList');
        var clonedTemplate = resourceTemp.content.cloneNode(true);

        resourceFields.appendChild(clonedTemplate);
    }).on('click', '.remove-rescource-fields', function (e) {
        $(this).closest('.resource-fields').remove();
    });


    var func_finish = function(){
        $('#btnCreateProduct').removeClass('disabled');
        $('div.loader').hide();
    };

    $("form#formUpdateProduct").ajaxForm({
        url: '/api/v1/product/' + id,
        method: 'PUT',
        success: function (res) {
            func_finish();
            console.log(res);
            Materialize.toast('Product updated!!!', 4000);
            window.location.href= "/representatives/dashboard";
        },
        error: function (err) {
            func_finish();
            console.log(err);
            alert("error");
        },
        beforeSubmit: function(arr, $form, options) {
            $('#btnCreateProduct').addClass('disabled');
            $('div.loader').show();

            $.ajax({
                url: '/api/v1/product/' + id + '/material',
                type: 'DELETE',
                data: {image_list: removeImages, resource_list: removeRessources},
                success: function(result) {
                    // Do something with the result
                    console.log(result);
                }
            });

        }
    });

    $('#remove_list').on('click', '.remove-image', function (e) {
        removeImages.push($(this).data('href'));
        $(this).closest('li').remove();
    }).on('click', '.remove-ressource', function (e) {
        removeRessources.push($(this).data('href'));
        $(this).closest('li').remove();
    });


});
var getProductData = function(id, callback){
    $.get('api/v1/product/' + id,function (result) {
        if(!result){
            alert("Woops! Product doesn't exists");
            return;
        }
        callback(result);
    }).fail(function(e) {
        alert('Woops! Error to get Product Data'); // or whatever
        console.log(e);
    });
};

var renderProductData = function(data, cat_list){
    var images = data.productImages;
    var materials = data.productResources;

    var remove_list = $('#remove_list');

    $('#formUpdateProduct').find('#name').val(data.productName);
    $('#formUpdateProduct').find('#description').val(data.productDescription);
    Materialize.updateTextFields();
    renderCategorieData(cat_list, data.categories);

    remove_list.empty();
    for(var i = 0; i < images.length; i++){
        remove_list.append('<li class="collection-item avatar">\n' +
            '        <img src="' + images[i] + '" alt="" class="circle">\n' +
            '        <span class="title">' + images[i] + '</span>\n' +
            '    </p>\n' +
            '    <a data-href="' + images[i] +'" class="secondary-content remove-image" style="color: #f6755f"><i class="material-icons">clear</i></a>\n' +
            '    </li>');
    }
    for(var j = 0; j < materials.length; j++){
        remove_list.append('<li class="collection-item avatar">\n' +
            '      <img src="/assets/img/material.png" alt="" class="circle">\n' +
            '      <span class="title">' + materials[j].description +'</span>\n' +
            '      <p>' + materials[j].originalName + '<br>\n' +
            '          ' + materials[j].dataType + '\n' +
            '      </p>\n' +
            '    <a data-href="' + materials[j].url +'" class="secondary-content remove-ressource" style="color: #f6755f"><i class="material-icons">clear</i></a>\n' +
            '    </li>');
    }
};

var getCategorieData = function(callback){
    $.get('api/v1/categories', function(result){
        callback(result);
    });
};

var renderCategorieData = function(data, chooseCategories){
    var list = $('#categories');

    for(var i = 0; i < data.length; i++){
        var lSelect = false;
        for(var j = 0; j < chooseCategories.length; j++){
            if(chooseCategories[j] === data[i]._id){
                lSelect = true;
                break;
            }
        }
        if(lSelect){
            list.append("<option value='" + data[i]._id + "' id='" + data[i]._id + "' selected>" + data[i].name  + "</option>");
        }else{
            list.append("<option value='" + data[i]._id + "' id='" + data[i]._id + "'>" + data[i].name  + "</option>");
        }

    }
    list.material_select();

};