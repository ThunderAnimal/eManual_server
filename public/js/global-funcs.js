$(document).ready(function(){
    $('#header-search-button').click(function () {
        var search = $('#header-search-field').val();
        if(search === ""){
            return;
        }
        window.location.href = "/search?search=" + search;
    });
});

$('#send-message-modal').modal({
    ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
        getProvidersData();
    }
});

var getProvidersData = function(){
    $.get('api/v1/categories', function(result){
        renderProvidersData(result);
    });
};

var renderProvidersData = function(data){
    var list = $('#providers');

    for(var i = 0; i < data.length; i++){
        list.append("<option value='" + data[i]._id + "' id='" + data[i]._id + "'>" + data[i].name  + "</option>");
    }
    list.material_select();

};