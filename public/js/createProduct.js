$(document).ready(function(){
    $('#ResourcesList').on('click', '.add-rescource-fields', function (e) {
        var resourceTemp = document.getElementById('ResourceFields');
        var resourceFields = document.getElementById('ResourcesList');
        var clonedTemplate = resourceTemp.content.cloneNode(true);

        resourceFields.appendChild(clonedTemplate);
    }).on('click', '.remove-rescource-fields', function (e) {
        $(this).closest('.resource-fields').remove();
    });


    $('select').material_select();
    getCategorieData();


    var func_finish = function(){
        $('#btnCreateProduct').removeClass('disabled');
        $('div.loader').hide();
    };

    $("form#formCreateProduct").ajaxForm({
        url: '/api/v1/product',
        success: function (res) {
            func_finish();
            console.log(res);
            $('#formCreateProduct').trigger("reset");
            Materialize.toast('Product added!!!', 4000);

        },
        error: function (err) {
            func_finish();
            console.log(err);
            alert("error");
        },
        beforeSubmit: function(arr, $form, options) {
            $('#btnCreateProduct').addClass('disabled');
            $('div.loader').show();
        }
    });
});

var getCategorieData = function(){
    $.get('api/v1/categories', function(result){
        renderCategorieData(result);
    });
};

var renderCategorieData = function(data){
    var list = $('#categories');

    for(var i = 0; i < data.length; i++){
        list.append("<option value='" + data[i]._id + "' id='" + data[i]._id + "'>" + data[i].name  + "</option>");
    }
    list.material_select();

};