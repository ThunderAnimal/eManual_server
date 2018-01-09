$(document).ready(function(){
    $('#header-search-button').click(function () {
        var search = $('#header-search-field').val();
        if(search === ""){
            return;
        }
        window.location.href = "/search?search=" + search;
    });
});