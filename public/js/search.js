$(document).ready(function(){
    var search = getParameterByName('search', window.location.href);

    if(search){
        $('#header-search-field').val(search);
        getSearchResult(search,renderSearchResult);
    }
});

var getSearchResult = function(searchText, callback){
    $.get('api/v1/product_search',{search: searchText}, function(result){
        callback(result);
    }).fail(function(e) {
        alert('Woops! Error to get Data'); // or whatever
    });
};

var renderSearchResult = function (data) {
    console.log(data);
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