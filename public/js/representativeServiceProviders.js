$(document).ready(function(){
    getServiceData();
});


var getServiceData = function(){
    $.get('api/v1/service_providers',function(result){
        renderServiceList(result);
    });
};

var renderServiceList = function(data){
    console.log(data);

    var temp = document.getElementById('serviceProviderTemp'),
        ul = document.getElementById('serviceUl');
    for(var serviceProvider in data){
        var clonedTemplate = temp.content.cloneNode(true);

        clonedTemplate.querySelector("h3").innerText = data[serviceProvider].name;
        if(data[serviceProvider].isAuthorized){
            clonedTemplate.querySelector('.product-select a.add-selection').style.display= "none";
            clonedTemplate.querySelector('.product-select a.remove-selection').style.display= "";
        }else{
            clonedTemplate.querySelector('.product-select a.add-selection').style.display= "";
            clonedTemplate.querySelector('.product-select a.remove-selection').style.display= "none";
        }
        clonedTemplate.querySelector('.product-select p').textContent = data[serviceProvider]._id;

        clonedTemplate.querySelector('.product-select a.add-selection').addEventListener("click",function () {
            var that = this;
            this.style.display = "none";
            var e = this.parentNode.childNodes[1];
            var pID = this.parentNode.childNodes[2].textContent;
            $.ajax({
                url: 'api/v1/service_providers',
                type: 'PUT',
                data:{spID:pID},
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
                url: 'api/v1/service_providers',
                type: 'DELETE',
                data:{spID:pID},
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
}