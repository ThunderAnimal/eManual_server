$(document).ready(function(){

    var func_finish = function(){
        $('#btnCreateProduct').removeClass('disabled');
        $('div.loader').hide();
    };

    $("form#formCreateProduct").ajaxForm({
        url: '/api/v1/product',
        success: function (res) {
            func_finish();
            console.log(res);
            alert("success");

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