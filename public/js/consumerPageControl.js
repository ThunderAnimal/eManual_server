var spamAddressValue = "";
var isSubscribed = false;

$(document).ready(function(){
    getData(renderData);

    $('.modal').modal({
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
});


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
        clonedTemplate.querySelector('.pic').src = products[k].profilePicture;
        clonedTemplate.querySelector('li').setAttribute('data-id', products[k]._id);


        clonedTemplate.querySelector('.product-delete a.remove-selection').addEventListener("click",function () {
            console.log(this);
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