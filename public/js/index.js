$(document).ready(function(){

   getCategorieData();
});

var getCategorieData = function(){
    $.get('api/v1/categories_top', function(result){
        renderCategorieData(result);
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

var renderData = function(data){
    var products = data;


    var temp = document.getElementById('productTemp'),
        ul = document.getElementById('recent-manuals-list');

    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    console.log(products);
    for(var k = 0; k < products.length; k++){
        var clonedTemplate = temp.content.cloneNode(true);
        clonedTemplate.querySelector('h6').innerText = products[k].productName;
        clonedTemplate.querySelector('a').href = href='/product?id=' + products[k]._id;
        clonedTemplate.querySelector('img').src = products[k].profilePicture;
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