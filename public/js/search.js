$(document).ready(function(){
    var search = getParameterByName('search', window.location.href);

    if(search){
        $('#header-search-field').val(search);
        getSearchResult(search,renderSearchResult);
    }
});

var getSearchResult = function(searchText, callback){
    $.get('api/v1/product_search',{search: searchText}, function(result){
        $(".category-header").append("Search result for <i style=\"color: #f6755f\">\"" + searchText + "\"</i>");
        callback(result);
    }).fail(function(e) {
        alert('Woops! Error to get Data'); // or whatever
    });
};

var renderSearchResult = function (data) {
    console.log(data);
    var products = data;

    var temp = document.getElementById('productTemp'),
        ul = document.getElementById('manualUl');

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    for(var k = 0; k < products.length; k++){
        var clonedTemplate = temp.content.cloneNode(true);
        clonedTemplate.querySelector("h3").innerText = products[k].productName;
        clonedTemplate.querySelector(".product-info a").href = href='/product?id=' + products[k]._id;
        clonedTemplate.querySelector('.product-pic img').src = products[k].profilePicture;
        clonedTemplate.querySelector('.product-select p').textContent = products[k]._id;
        if(products[k].isFavorite){
            clonedTemplate.querySelector('.product-select a.add-selection').style.display= "none";
            clonedTemplate.querySelector('.product-select a.remove-selection').style.display= "";
        }else{
            clonedTemplate.querySelector('.product-select a.add-selection').style.display= "";
            clonedTemplate.querySelector('.product-select a.remove-selection').style.display= "none";
        }
        clonedTemplate.querySelector('.product-select a.add-selection').addEventListener("click",function () {
            var that = this;
            this.style.display = "none";
            var e = this.parentNode.childNodes[1];
            var pID = this.parentNode.childNodes[2].textContent;
            $.ajax({
                url: 'api/v1/selected_product',
                type: 'PUT',
                data:{add:true,product_id:pID},
                success: function(res) {
                    console.log(res);
                    e.style.display="";
                },
                error: function (err) {
                    that.style.display = "";
                    console.log(err);
                    if(err.status === 401){
                        alert("Log in is required for select product");
                    }else if(err.status === 403){
                        alert("Only consumer can select products");
                    }
                }
            });
        });
        clonedTemplate.querySelector('.product-select a.remove-selection').addEventListener("click",function () {
            var that = this;
            this.style.display = "none";
            var e = this.parentNode.childNodes[0];
            var pID =this.parentNode.childNodes[2].textContent;
            $.ajax({
                url: 'api/v1/selected_product',
                type: 'PUT',
                data:{delete:true,product_id:pID},
                success: function(res) {
                    console.log(res);
                    e.style.display="";
                },
                error: function (err) {
                    that.style.display = "";
                    console.log(err);
                    if(err.status === 401){
                        alert("Log in is required for select product");
                    }else if(err.status === 403){
                        alert("Only consumer can select products");
                    }
                }
            });


        });
        ul.appendChild(clonedTemplate);
    }
};


function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}