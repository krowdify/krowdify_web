$("input,select,textarea").not("[type=submit]").jqBootstrapValidation({ bindEvents: ['blur','change'] });
if($.cookie("css")) {
    $("link#bootstrap").attr("href",$.cookie("css"));
}
$(document).ready(function() {
    $("#nav li a").click(function() {
        $("link#bootstrap").attr("href",$(this).attr('rel'));
        $.cookie("css",$(this).attr('rel'), {expires: 365, path: '/'});
        return false;
    });
});




function checkemail($el, value, callback) {

    var val = $el.val();
    ret = {
        value: value,
        valid: false,
    };
    var params = {};
    params.email = val;
    params.client_id = clientid;
    var geturl;
    geturl = $.ajax({
        type: 'GET',
        url: authbase + "/user/verify/email",
        data: params,
        dataType: "json",
        async: false,
        success: function (data, status, XHR) {
            ret.valid=true;
        },
        error: function (e) {
            error = $.parseJSON(e.responseText);
            ret.valid = false;
            ret.message = error.error.error_message;
            console.log(error.error.error_message);

        }
    });
    callback(ret);
}

function checkusername($el, value, callback) {

    var val = $el.val();
    ret = {
        value: value,
        valid: false,
    };
    var params = {};
    params.username = val;
    params.client_id = clientid;
    var geturl;
    geturl = $.ajax({
        type: 'GET',
        url: authbase + "/user/verify/username",
        data: params,
        dataType: "json",
        async: false,
        success: function (data, status, XHR) {
            ret.valid=true;
        },
        error: function (e) {
            error = $.parseJSON(e.responseText);
            ret.valid = false;
            ret.message = error.error.error_message;
            console.log(error.error.error_message);

        }
    });
    callback(ret);


}

$( "#register" ).submit(function( event ) {
    $(this).attr("disabled", "disabled");
    $(this).toggleClass('loading disabled');
    $('.alert').fadeOut('slow').remove();
    data = {};
    data['email'] = $('input[name="registerEmail"]').val();
    data['password'] = $('input[name="registerPassword"]').val();
    data['fullname'] = $('input[name="registerFullname"]').val();
    data['username'] = $('input[name="registerUsername"]').val();
    data['data'] = $('.fileinput-preview img').attr('src');
    data['client_id'] = clientid;
    console.log(data);
    reqUrl = authbase + "/user/register";

    $.support.cors = true;
    $.ajax({
        type: "POST",
        url: reqUrl,
        data: data,
        success: function(data, textStatus) {
            var next = getQuerystring('next');
            var close = getQuerystring('close');
            var date = new Date();
            date.setTime(date.getTime() + (3600 * 1000));
            $.cookie("token", data['access_token'], { "expires": date, "path": "/" });
            $.cookie("expires", date.getTime(), { "expires": date, "path": "/" });
            $.cookie("krowd", JSON.stringify(data), { "expires": date, "path": "/" });
    
            if(next.match(/close/gi) || close){
                window.close();
            }else if(next){
                window.location = decodeURIComponent(next);
            }else{
                console.log(data);
                window.location = "stream.html";
}
},
error: function(e){
    if(e.responseText){
        error = JSON.parse(e.responseText);
    }else{
        error = {};
        error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
    }
    $('.login').prepend('<div class="alert alert-warning col-md-10 col-md-offset-1"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
    $('.btn').removeAttr('disabled');
    $('.btn').toggleClass('loading disabled');
},
complete: function(request, status) {
},
statusCode: {
    200: function(data) {
    }
},
xhrFields: {
    withCredentials: true
},
crossDomain: true
});
event.preventDefault();
});

$('.login .btn').on('click',function(e) { 
    $(this).attr("disabled", "disabled");
    $(this).toggleClass('loading disabled');
    $('.alert').fadeOut('slow').remove();
    data = {};
    data['email'] = $('input[name="email"]').val()
    data['password'] = $('input[name="password"]').val();
    data['client_id'] = clientid;

    reqUrl = authbase + "/user/login";

    $.support.cors = true;
    $.ajax({
        type: "POST",
        url: reqUrl,
        data: data,
        success: function(data, textStatus) {
            var next = getQuerystring('next');
            var close = getQuerystring('close');
            var date = new Date();
            date.setTime(date.getTime() + (3550 * 1000));
            $.cookie("token", data['access_token'], { "expires": date, "path": "/" });
            $.cookie("expires", date.getTime(), { "expires": date, "path": "/" });
            $.cookie("krowd", JSON.stringify(data), { "expires": date, "path": "/" });

            if(next.match(/close/gi) || close){
                window.close();
            }else if(next){
                window.location = decodeURIComponent(next);
            }else{
                window.location = "stream.html";
            }
        },
        error: function(e){
            if(e.responseText){
                error = JSON.parse(e.responseText);
            }else{
                error = {};
                error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
            }
            $('.login').prepend('<div class="alert alert-warning col-md-10 col-md-offset-1"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
            $('.btn').removeAttr('disabled');
            $('.btn').toggleClass('loading disabled');
        },
        complete: function(request, status) {
        },
        statusCode: {
            200: function(data) {
            }
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true
    });
return false;
});
