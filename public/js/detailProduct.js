$(document).ready(function(){
    var id = $('#product_id').data('id');
    getProductData(id, renderProductData);
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

var renderProductData = function(data){
    console.log(data);

    $('#product_name').text(data.productName);
    $('#product_image').attr('src', data.productImages[0]);
};