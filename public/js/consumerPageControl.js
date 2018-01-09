var spamAddressValue = "";
var isSubscribed = false;

$(document).ready(function(){
    getData(renderData);

    $('#provider_select').material_select();

    $('#modal-spam-address-popup').modal({
        ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
            getSpamData();
        }
    });
    $("#update-spam-address").click(function(){
        if(spamAddressValue != document.querySelector('#email').value) {
            spamAddressValue = document.querySelector('#email').value;
            $.ajax({
                url: '/api/v1/spam_address',
                type: 'PUT',
                data: {spamAddress: spamAddressValue},
                success: function (res) {
                    console.log(res);
                    Materialize.toast('New address for notifications saved! ' + spamAddressValue, 4000);
                    $('.modal').modal('close');
                },
                error: function (err) {
                    console.log(err);
                    alert("error");
                }
            });
        }
        var checkBoxValue = $('#receive-mail').is(':checked')
        if(!(isSubscribed && checkBoxValue)) {
            $.ajax({
                url: '/api/v1/toggle_optin',
                type: 'PUT',
                data: {optin: checkBoxValue},
                success: function (res) {
                    if (res === true) {
                        Materialize.toast('You will now receive notifications', 4000);
                    } else if (res === false) {
                        Materialize.toast('You unsubscribed from notifications', 4000);
                    }
                    $('.modal').modal('close');
                },
                error: function (err) {
                    console.log(err);
                    alert("error");
                }
            });
        }
        getSpamData();
        $('.modal').modal('close');
    });

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
});

$('#send-message-modal').modal({
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
    }
});

$('select').material_select();

var getData = function(callback){
    $.get('api/v1/selected_product', function(result){
        callback(result);
    }).fail(function(e) {
        alert('Woops! Error to get Data'); // or whatever
        console.log(e);
    });
};

var renderData = function(data){
    var products = data;


    var temp = document.getElementById('productTemp'),
        ul = document.getElementById('manualUl');

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    console.log(products);
    for(var k = 0; k < products.length; k++){
        var clonedTemplate = temp.content.cloneNode(true);
        clonedTemplate.querySelector("h3").innerText = products[k].productName;
        clonedTemplate.querySelector(".product-info a").href = href='/product?id=' + products[k]._id;
        clonedTemplate.querySelector(".product-info p").innerText = products[k].productDescription;
        clonedTemplate.querySelector('.pic').src = products[k].profilePicture;
        clonedTemplate.querySelector('li').setAttribute('data-id', products[k]._id);
        clonedTemplate.querySelector('.product-delete a.remove-selection').addEventListener("click",function () {
            var that = this;
            var liElement = this.closest('li');
            this.style.display = "none";
            $.ajax({
                url: 'api/v1/selected_product',
                type: 'PUT',
                data:{delete:true,product_id:liElement.getAttribute('data-id')},
                success: function(res) {
                    console.log(res);
                    ul.removeChild(liElement);
                },
                error: function (err) {
                    console.log(err.status);
                    that.style.display = "";
                    alert("Woops! Something went wrong, sry.")
                }
            });


        });
        clonedTemplate.querySelector('#btnRequestHelp').addEventListener("click",function () {
            var liElement = this.closest('li');
            var productId = liElement.getAttribute('data-id')

            getProvidersData(productId);
            $('#send-message-modal').modal('open');

        });
        ul.appendChild(clonedTemplate);
    }
};

var getSpamData = function(){
    $.get('api/v1/spam_address', function(result){
        document.querySelector('#email').value = result;
        spamAddressValue = result;
    }).fail(function(e) {
        alert('Woops! Error to get Data'); // or whatever
        console.log(e);
    });

    $.get('api/v1/get_subscription_status', function(result){
        $('#receive-mail').prop('checked', result);
        isSubscribed = result;
    }).fail(function(e) {
        alert('Woops! Error to get Data'); // or whatever
        console.log(e);
    });
}

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