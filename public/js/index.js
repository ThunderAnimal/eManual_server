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
      list.append("<li id='" + data[i]._id + "'><a href='/category?category_id=" + data[i]._id + "'>"+data[i].name + "<span class='badge'>"+data[i].count+"</span></a></li>");


  }
  list.append("<li id=''><a href='/category'>show all</a></li>")
};