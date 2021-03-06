var offset = 0;
var temp = document.getElementById('productTemp');
var catTemp = document.getElementById('category-template');
var catTempAll = document.getElementById('category-template-all');

$(document).ready(function(){
    getStatistics();
    getTopCategorieData();
    getRecentProductsData();
    $('#load-more-button').click(function(e){
        getRecentProductsData();
        e.preventDefault();
    });

    $('#search-button').click(function () {
        var search = $('#search-field-input').val();
        if(search === ""){
            return;
        }
        window.location.href = "/search?search=" + search;
    });

    // Add smooth scrolling to all links
    $("a").on('click', function(event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
    });
});

var getTopCategorieData = function(){
    $.get('api/v1/categories_top', function(result){
        renderTopCategoriesData(result);
    });
};

var getRecentProductsData = function () {
    $.get('api/v1/dir_recent_products', {offset: offset, quantity: 10}, function(recentProductsData){
        offset += 10;
        renderRecentProductsData(recentProductsData);
        delete recentProductsData;
    });
};

var getStatistics = function(){
    $.get('api/v1/homepage_numbers', function(result){
        renderStatisticsData(result);
    });
};

var renderStatisticsData = function(data){
    var statistics = data;
    document.querySelector("#stats-products p.number").innerText = statistics[0];
    document.querySelector("#stats-manuals p.number").innerText = statistics[1];
    document.querySelector("#stats-brands p.number").innerText = statistics[2];
    document.querySelector("#stats-users p.number").innerText = statistics[3];
};

var renderTopCategoriesData = function(data){
    var categories = data;
    var ul = document.getElementById('categories-list');

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    console.log(categories);

    for(var k = 0; k < categories.length; k++){
        var clonedTemplate = catTemp.content.cloneNode(true);
        clonedTemplate.querySelector('li').setAttribute('data-id', categories[k]._id);
        clonedTemplate.querySelector('.category-name').innerText = categories[k].name;
        clonedTemplate.querySelector('.category-amount').innerText = categories[k].count;
        clonedTemplate.querySelector('a').href = href='/category?category_id[]=' + categories[k]._id;

        ul.appendChild(clonedTemplate);
    }
    var clonedTemplate = catTempAll.content.cloneNode(true);
    clonedTemplate.querySelector('.category-name').innerText = "Show all";
    clonedTemplate.querySelector('a').href = href='/category';

    ul.appendChild(clonedTemplate);
};

var renderRecentProductsData = function(data){
    var products = data;


   // var temp = document.getElementById('productTemp'),
    var ul = document.getElementById('recent-products-list');

    if(offset == 0){
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
    }
    console.log(products);

    for(var k = 0; k < products.length; k++){
        var clonedTemplate = temp.content.cloneNode(true);
        clonedTemplate.querySelector('.product-info h6').innerText = products[k].productName;
        clonedTemplate.querySelector('.product-info a').href = href='/product?id=' + products[k]._id;
        clonedTemplate.querySelector('img').src = products[k].profilePicture;
        clonedTemplate.querySelector('li').setAttribute('data-id', products[k]._id);
        if(products[k].isFavorite){
            clonedTemplate.querySelector('a.add-selection').style.display= "none";
            clonedTemplate.querySelector('a.remove-selection').style.display= "";
        }else{
            clonedTemplate.querySelector('a.add-selection').style.display= "";
            clonedTemplate.querySelector('a.remove-selection').style.display= "none";
        }

        clonedTemplate.querySelector('a.add-selection').addEventListener("click",function () {
            var that = this;
            this.style.display = "none";
            var e = this.parentNode.childNodes[2];
            var pID =this.closest('li').getAttribute('data-id');
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
        clonedTemplate.querySelector('a.remove-selection').addEventListener("click",function () {
            var that = this;
            this.style.display = "none";
            var e = this.parentNode.childNodes[1];
            var pID = this.closest('li').getAttribute('data-id');
            $.ajax({
                url: 'api/v1/selected_product',
                type: 'PUT',
                data: {delete: true, product_id: pID},
                success: function (res) {
                    console.log(res);
                    e.style.display = "";
                },
                error: function (err) {
                    that.style.display = "";
                    console.log(err);
                    if (err.status === 401) {
                        alert("Log in is required for select product");
                    } else if (err.status === 403) {
                        alert("Only consumer can select products");
                    }
                }
            });
        });

        ul.appendChild(clonedTemplate);
    }
};