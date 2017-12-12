var clicked = false;
$(document).ready(function(){
    getProductData();
    $('#count').on('click',function () {
        if(clicked){
            getProductData(3,1);
            console.log("Display in reversed count order")
        }else
            getProductData(3,0);
            console.log("Display in count order")
    });
    $('#name').on('click',function () {
        if(clicked){
            getProductData(2,1);
            console.log("Display in reversed name order")
        }else
            getProductData(2,0);
            console.log("Display in name order")
    });
    $('#order').on('click',function (e) {
        if(!clicked){
            $(this).filter(".materialize-red").removeClass("materialize-red");
            $(this).addClass('materialize-blue');
            $(this).text("Reverse");
            clicked = true;
        }else if(clicked){
            $(this).filter(".materialize-blue").removeClass("materialize-blue");
            $(this).addClass('materialize-red');
            $(this).text("Order");
            clicked = false;
        }
    })
});


var getProductData = function(fieldName,order){
    document.getElementById('manualUl').innerHTML = "";
    $.get('api/v1/company_product',{fieldName, order},function(result){
        renderProducts(result);
    });
};

var renderProducts = function(data){
    var temp = document.getElementById('productTemp'),
        ul = document.getElementById('manualUl');
    for(var product in data){
        var clonedTemplate = temp.content.cloneNode(true);

        clonedTemplate.querySelector(".product-info a").href = '/product?id=' + data[product]._id;
        clonedTemplate.querySelector(".product-edit a").href = '/representatives/updateProduct?id=' + data[product]._id;
        clonedTemplate.querySelector("h3").innerText = data[product].productName;
        clonedTemplate.querySelector("p1").innerText="Selected by: "+data[product].favorites;
        clonedTemplate.querySelector('.pic').src = data[product].profilePicture;

        ul.appendChild(clonedTemplate);
    }
}