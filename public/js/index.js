var offset = 0;
var temp = document.getElementById('productTemp');

$(document).ready(function(){

    getCategorieData();
    getRecentProductsData();
    $('#load-more-button').click(function(e){
        getRecentProductsData();
        e.preventDefault();
    });
});

var getCategorieData = function(){
    $.get('api/v1/categories_top', function(result){
        renderCategorieData(result);
    });
};

var getRecentProductsData = function () {
    $.get('api/v1/dir_recent_products', {offset: offset, quantity: 10}, function(recentProductsData){
        offset += 10;
        renderRecentProductsData(recentProductsData);
        delete recentProductsData;
    });
};

var renderCategorieData = function(data){
  console.log(data);
  var list=$("#dropdown1");

  list.empty();
  for(i=0;i<data.length;i++){
      list.append("<li id='" + data[i]._id + "'><a href='/category?category_id[]=" + data[i]._id + "'>"+data[i].name + "<span class='badge'>"+data[i].count+"</span></a></li>");


  }
  list.append("<li id=''><a class='center-align' href='/category' style='color: #000000'>show all</a></li>")
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