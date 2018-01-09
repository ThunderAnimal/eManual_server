$(document).ready(function(){

    $('#company').material_select();
    getCompanyData();

    $("form#sendMail").ajaxForm({
        url: '/api/v1/service_provider/message',
        success: function (res) {
            console.log(res);
            $('#sendMail').trigger("reset");
            Materialize.toast('Mails send! Number: ' + res.count, 4000);

        },
        error: function (err) {
            console.log(err);
            if(err.responseJSON._error){
                alert("Woops! Something went wrong: \n\n" + err.responseJSON.error);
            }else{
                alert("error");
            }
        }
    });



});

var getCompanyData = function(){
    $.get('api/v1/all_allowed_companies', function(result){
        renderCompanyData(result);
    });
};

var renderCompanyData = function(data){
    var list = $('#company');

    for(var i = 0; i < data.length; i++){
        list.append("<option value='" + data[i]._id + "' id='" + data[i]._id + "'>" + data[i].name  + "</option>");
    }
    list.material_select();

};