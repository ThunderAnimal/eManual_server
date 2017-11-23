$(document).ready(function(){
    $('#navigate_sign_in').click(function(){
        $('ul.tabs').tabs('select_tab', 'sign_in');
    });

    $("form#signUp").ajaxForm({
        url: '/auth/create',
        beforeSubmit : function(arr, $form, options){
            if($form.find('input[name="pass"]').val() !== $form.find('input[name="repass"]').val())
        {
                alert('Inconsistent password');
                return false;
            }
            else
            {

                return true;
            }

        },
        success: function (res) {
            console.log(res);
            Materialize.toast('Account added', 4000);
            window.location.href = "../login"
        },
        error: function (err) {
            console.log(err);
            alert(err);
        }
    });
});
