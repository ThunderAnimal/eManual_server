$(document).ready(function(){

   getCategorieData();
});

var getCategorieData = function(){
    $.get('api/v1/categories', function(result){

        var dummyData=[];
        dummyData.push({name: "tv", number:1, _id:"1"});

        dummyData.push({name: "hif", number:2, _id:"2"});

        dummyData.push({name: "dvd", number:3, _id:"3"});

        dummyData.push({name: "headphones", number:4, _id:"4"});
        renderCategorieData(dummyData);
    });
};

var renderCategorieData = function(data){
  console.log(data);
  var list=$("#dropdown1");

  list.empty();
  for(i=0;i<data.length;i++){
      list.append("<li id='" + data[i]._id + "'><a href='/category?category_id=" + data[i]._id + "'>"+data[i].name + "<span class='badge'>"+data[i].number+"</span></a></li>");


  }
  list.append("<li id=''><a href='/category'>show all</a></li>")
};