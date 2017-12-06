$(document).ready(function(){
    getData(renderData);
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