
if(!$.cookie("token")){
    window.location = "index.html?next=" + window.location.href;
}
var headers = {
    'Authorization': 'Token token="' + $.cookie("token") + '"'
};

var user = {};
var posthtml = $('.row-post').html();
var activityhtml = $('.row-activity').html();
var commenthtml = $('.row-comment').html();
var userlisthtml = $('.user-list-body').html();
getUser();
followUserAction();

$('.row-post').remove();
$('.row-activity').remove();
$('.user-list-row').remove();

$('.btn-file, .submit-post').click(function() {
    $('.compose').addClass('browse');
});
$('.compose').click(function(e) {
    if(!$('.compose-holder').html()){
        $('.compose-holder').html($(this).html());
    }
    if( $(this).html() == $('.compose-holder').html()) {
        if(user['_id'] != JSON.parse($.cookie("krowd")).user._id){
            $('.compose').html('@' + user['username'] + '&nbsp;');
                setCursorToEnd($(this).get(0));
        }else{
            $('.compose').html('');
        }
    }

    $(this).addClass("expanded");
    $(this).parent().find('.tools, .buttons').show();

});
$('html').click(function(e) {
    if(!$(e.target).closest('.compose').length && !$('.compose').hasClass("browse")){
        var compose = $('.compose');
        if($('.compose-holder').html()){
            $(compose).html($('.compose-holder').html());
            $('.compose-holder').html('');
        }
        $(compose).removeClass("expanded");
        $(compose).parent().find('.tools, .buttons').hide();
    }

});


$('#post').on('show.bs.modal', function (e) {
    $('.compose').html('');
    $('#post .compose').addClass('expanded');
    $('#post .tools').show();
});

$('.submit-post').click(function(){
    statusPost();
});

$('.compose').keyup(function() {
    var text =  $(this).text();
    $(".create-post .charcounter").html(text.length);

});

$('.new-posts').click(function(){
    $(this).hide();
    $.each( $('.stream-hidden > div'), function( k, v ) {
        $(v).hide().insertAfter(".new-posts").fadeIn("slow");
    });

});


$('.userModal').click(function() {
    var self = this;
    if($(this).hasClass('followers')){
        reqUrl = apibase + "/user/" + $(this).attr('data-uid') + "/followers";
        verb = ' Followers';
    }else{
        reqUrl = apibase + "/user/" + $(this).attr('data-uid') + "/following";
        verb = ' Following';
    }
    $('.user-list-body').html('');
    $('#userModal .uname').html('');
    $('#userModal .user-list-profile-image').attr('src',$('.profile .profile-image').attr('src'));
    $('#userModal .uname').prepend($('.profile .username').html());
    $('#userModal .uname').append(verb);
    $.support.cors = true;
    $.ajax({
        type: "GET",
        url: reqUrl,
        async: true,
        headers: headers,
        success: function(data, textStatus) {

            $.each( data.data, function( k, v ) {

                user = $(userlisthtml);
                $('.list-profile-image', user).attr('src',v.profile_image);
                $('.list-profile-image', user).parent().attr('href',"user.html?user=" + v._id);
                $('.fullname > a', user).html(v.fullname).attr('href', 'user.html?user=' + v._id);
                $('.username > a', user).html("@" + v.username).attr('href', 'user.html?user=' + v._id);
                $('.unfollow-user, .follow-user', user).attr('data-id',v._id);
                if(v._id != JSON.parse($.cookie("krowd")).user._id){
                    if(v.relationship['following'] === true){
                        $('.unfollow-user', user).show();

                    }else{
                        $('.follow-user', user).show();
                    }
                }
                $('.user-list-body').append(user);
            });
            followUserAction();
        },
        error: function(e){
            if(e.responseText){
                error = JSON.parse(e.responseText);
            }else{
                error = {};
                error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
            }
            $('.content').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
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

});

function followUserAction(){
    $('.follow-user').click(function() {

        var self = this;
        var data = {'action': 'follow'};

        reqUrl = apibase + "/user/" + $(this).attr('data-id') + "/relationship";
        $.support.cors = true;
        $.ajax({
            type: "POST",
            url: reqUrl,
            data: data,
            async: true,
            headers: headers,
            success: function(data, textStatus) {
                $(self).hide();
                $(self).parent().find('.unfollow-user').show();
            },
            error: function(e){
                if(e.responseText){
                    error = JSON.parse(e.responseText);
                }else{
                    error = {};
                    error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
                }
                $('.content').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
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

});


$('.unfollow-user').hover( function() {
    $(this).removeClass('btn-success').addClass('btn-error');
    $(this).html('-<span class="glyphicon glyphicon-user"></span> Unfollow');
}, function() {
    $(this).removeClass('btn-error').addClass('btn-success');
    $(this).html('<span class="glyphicon glyphicon-fire"></span> Following');
}

);

$('.unfollow-user').click(function() {
    var self = this;
    var data = {'action': 'unfollow'};
    reqUrl = apibase + "/user/" + $(this).attr('data-id') + "/relationship";
    $.support.cors = true;
    $.ajax({
        type: "POST",
        url: reqUrl,
        data: data,
        async: true,
        headers: headers,
        success: function(data, textStatus) {
            $(self).hide();
            $(self).parent().find('.follow-user').show();
        },
        error: function(e){
            if(e.responseText){
                error = JSON.parse(e.responseText);
            }else{
                error = {};
                error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
            }
            $('.content').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
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

});
}
function getLikes(gid){

    reqUrl = apibase + "/like/" + gid;
    $.support.cors = true;
    $.ajax({
        type: "GET",
        url: reqUrl,
        async: true,
        headers: headers,
        success: function(data, textStatus) {
            return data;
        },
        error: function(e){
            if(e.responseText){
                error = JSON.parse(e.responseText);
            }else{
                error = {};
                error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
            }
            $('.content').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
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
}
function statusPost(){

    reqUrl = apibase + "/post";
    data = {};
    data['usertext'] = $('.compose').text();
    data['data'] = $('.fileinput-preview img').attr('src');
    $.ajax({
        type: "POST",
        url: reqUrl,
        data: data,
        headers: headers,
        success: function(data, textStatus) {
            var compose = $('.compose');
            $(compose).html('Compose a Post');
            $(compose).removeClass("expanded");
            $(compose).parent().find('.tools, .buttons').hide();
            $('#post').modal('hide');
            buildPost(1,data);
            $(post).css('display','none');
            console.log($('.stream .profile').length);
            if($('.activity').length !== 0){
                
            }
            else if($('.stream .profile').length !== 0){
                $(post).insertAfter(".stream .profile").fadeIn("slow");
            }
            else{
                $('.stream').prepend($(post).fadeIn("Slow"));
            }
            $('.alert-banner > div > div').slideDown(200).delay(3000).slideUp(200);
        },
        error: function(e){
            if(e.responseText){
                error = JSON.parse(e.responseText);
            }else{
                error = {};
                error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
            }
            $('.content').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
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
}
function getPost(aid){
    reqUrl = apibase + "/post/" + aid;
    $.support.cors = true;
    $.ajax({
        type: "GET",
        url: reqUrl,
        headers: headers,
        success: function(data, textStatus) {
            $.each( data, function( k, v ) {
                buildPost(k,v);
            });
            postActions();
        },
        error: function(e){
            if(e.responseText){
                error = JSON.parse(e.responseText);
            }else{
                error = {};
                error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
            }
            $('.content').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
        },
        complete: function(request, status) {
        },
        statusCode: {
            200: function(data) {
            }
        },
});

}

function getPosts(type, query){
    if(query){
        reqUrl = apibase + query;
    }else{
        reqUrl = apibase + "/stream" + type;
    }
    $.support.cors = true;
    $.ajax({
        type: "GET",
        url: reqUrl,
        data: query,
        headers: headers,
        async: true,
        success: function(data, textStatus) {
            $.each( data.items, function( k, v ) {
                post = buildPost(k,v);
                $('.stream').append(post).fadeIn("Slow");
            });
            $('.stream').attr("data-new", data.pagination.new);
            $('.stream').attr("data-next", data.pagination.next);
            $('.stream').attr("data-prev", data.pagination.prev);


            postActions();
        },
        error: function(e){
            if(e.responseText){
                error = JSON.parse(e.responseText);
            }else{
                error = {};
                error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
            }
            $('.content').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
        },
        complete: function(request, status) {
        },
        statusCode: {
            200: function(data) {
            }
        },
    });
}

function postActions(){

$('.post-like').click(function() {
    reqUrl = apibase + "/like/" + $(this).closest(".post").attr("data-id");
    self = this;
    $.support.cors = true;
    $.ajax({
        type: "POST",
        url: reqUrl,
        async: true,
        headers: headers,
        success: function(data, textStatus) {
            current = parseInt($(self).parentsUntil('.post').siblings('.panel-group').find('.stat-likes').text(), 10);
            current = current + 1;
            $(self).parentsUntil('.post').siblings('.panel-group').find('.stat-likes').text(current);
            $(self).parentsUntil('.post').siblings('.panel-group').find('.glyphicon-heart').addClass('text-info');
            $(self).hide();
            $(self).parent().parent().find('.post-unlike').show();

        },
        error: function(e){
            if(e.responseText){
                error = JSON.parse(e.responseText);
            }else{
                error = {};
                error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
            }
            $('.content').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
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

$('.post-unlike').click(function() {
    self = this;
    reqUrl = apibase + "/like/" + $(this).closest(".post").attr("data-id");
    $.support.cors = true;
    $.ajax({
        type: "DELETE",
        url: reqUrl,
        async: true,
        headers: headers,
        success: function(data, textStatus) {
            current = parseInt($(self).parentsUntil('.post').siblings('.panel-group').find('.stat-likes').text(), 10);
            current = current - 1;
            $(self).parentsUntil('.post').siblings('.panel-group').find('.stat-likes').text(current);
            $(self).parentsUntil('.post').siblings('.panel-group').find('.glyphicon-heart').removeClass('text-info');
            $(self).hide();
            $(self).parent().parent().find('.post-like').show();
        },
        error: function(e){
            if(e.responseText){
                error = JSON.parse(e.responseText);
            }else{
                error = {};
                error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
            }
            $('.content').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
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

$('.post-comment').click(function(){
    $(this).closest(".post").find('.panel-collapse').collapse('show');
    $(this).closest(".post").find('.reply-input').focus();

    $('html, body').animate({
        scrollTop: $(this).closest(".post").find('.post-comment').offset().top
    }, 200);
    return false;
});
$('.reply-input').focus(function() {
    if(!$('.reply-holder').html()){
        $('.reply-holder').html($(this).html());
    }
    if( $(this).text() == $('.reply-holder').text()) {
        
        $('.reply-input').html('');
    }
    
    $(this).addClass("expanded");
    $(this).parent().find('.tools, .buttons').show();
});

$('.reply-input').blur(function() {
    if($(this).text().length === 0){
        var compose = $('.reply-input');
         if($('.reply-holder').html()){
            $(compose).html($('.reply-holder').html());
            $('.reply-holder').html('');
        }
        $(compose).removeClass("expanded");
        $(compose).parent().find('.tools, .buttons').hide();
        
    }
});

$('.reply-input').keyup(function() {
    var text =  $(this).text();
    $(this).parent().find('.charcounter').html(text.length);
});

$('.submit-comment').click(function(){
    commentPost($(this).closest(".post").attr("data-id"));
});
$('.load-more').on('click',function(e) {
    getComments($(this), $(this).attr('data-aid'), {"startid": $(this).attr('data-startid'), "page": parseInt($(this).attr('data-page'), 10) + 1, "newpage": $(this).attr('data-newpage'), "limit": $(this).attr('data-limit')});
});
$('.more').hover(function() {
    $(this).removeClass('label-info').addClass('label-primary');

}, function() {
    $(this).removeClass('label-primary').addClass('label-info');
});
}


function buildPost(k,v){
                post = $(posthtml);
                $(post).attr('data-id', v._id);
                $('.row-comment', post).html('');
                $('.username', post).html(v.user.fullname + " @" + v.user.username);
                $('.username', post).attr('href',"user.html?user=" + v.user._id);
                if(typeof v.media[0].full != "undefined"){
                    $('.media', post).html('<img src="'+ v.media[0].full.url +'">');
                }
                var date = new Date(v.created_time);
                
                $('.timeago', post).attr("title", date.toISOString());
                $('.timeago', post).timeago();
                $('.usertext', post).html(linkify_entities(v));
                $('.stream-profile-image', post).attr('src',v.user.profile_image);
                $('.stream-profile-image', post).parent().attr('href',"user.html?user=" + v.user._id);
                $('.toggle', post).attr('href','#collapse' + k);
                $('.panel-collapse', post).attr("id",'collapse' + k);
                $('.stat-comments', post).html(v.comments.count);
                $('.stat-likes', post).html(v.likes.count);

                $('.reply-profile-image', post).attr("src", apibase + "/user/"+ JSON.parse($.cookie("krowd")).client_id +"/"+ JSON.parse($.cookie("krowd")).user._id +"/profile_image");
                if(v.likes.count > 0){
                    if(v.user_likes === true) {
                        $('.post-like', post).hide();
                        $('.post-unlike', post).show();
                        $('.panel-group .glyphicon-heart', post).addClass('text-info');
                    }else{
                        $('.post-unlike', post).hide();
                        $('.post-like', post).show();
                    }
                    $.each( v.likes.data, function(b,l) {
                        if(b < 7){
                            $('.stream-likes', post).append('<a href="user.html?user=' + v.user._id +'"><img src="'+ l.profile_image + '" class="stream-comment-profile-image" data-toggle="tooltip" data-placement="top" title="" data-original-title="'+ l.username +'"></a>');
                            $('.stream-likes img', post).tooltip();
                        }
                    });
                }
                if(v.comments.count <= 10){
                    $(".load-more", post).hide();
                }
                if(v.comments.count > 0){
                    $.each( v.comments.data, function(a,c) {
                        buildComment($(commenthtml), post, c);
                    });
                }else{
                    $(".load-more", post).hide();
                }
                if(v.comments.count > 0){
                    $(".load-more", post).attr("data-aid",v._id);
                    $(".load-more", post).attr("data-startid", v.comments.data[0]._id);
                    $(".load-more", post).attr("data-page", 1);
                    $(".load-more", post).attr("data-newpage", 1);
                    $(".load-more", post).attr("data-limit", 10);
                }
return post;

}


function buildComment(comment, post, c){
    $('.username', comment).html(c.from.username + " ");
    $('.username', comment).attr('href',"user.html?user=" + c.from._id);
    $('.usertext', comment).append(linkify_entities(c));
    $('.row-comment', post).prepend($(comment).hide().fadeIn('slow'));
    $('.comment-profile-image', comment).attr("src",c.from.profile_image);
$('.comment-profile-image', comment).attr("data-original-title", c.from.username).tooltip();
$('.comment-profile-image', comment).parent().attr('href',"user.html?user=" + c.from._id);

var date = new Date(c.created_time);
$('.timeago', comment).attr("title", date.toISOString());
$('.timeago', comment).timeago();
return comment;
}


function commentPost(aid){

    reqUrl = apibase + "/comment/" + aid;
    data = {};
    data['text'] = $('.post[data-id='+aid+'] .reply-input').text();

//data['data'] = $('.fileinput-preview img').attr('src');
$.ajax({
    type: "POST",
    url: reqUrl,
    data: data,
    headers: headers,
    success: function(data, textStatus) {
        var reply = $('.reply-input');
         if($('.reply-holder').html()){
            $(reply).html($('.reply-holder').html());
            $('.reply-holder').html('');
        }
        $(reply).removeClass("expanded");
        $(reply).parent().find('.tools, .buttons').hide();
    },
    error: function(e){
        if(e.responseText){
            error = JSON.parse(e.responseText);
        }else{
            error = {};
            error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
        }
        $('.content').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
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
}

function getComments(e, aid, query){

    reqUrl = apibase + "/comment/" + aid;
    $.ajax({
        type: "GET",
        url: reqUrl,
        data: query,
        headers: headers,
        success: function(data, textStatus) {

            if(data.returned > 0){
                $.each( data.data, function(a,c) {
                    
                    buildComment($(commenthtml), $(e).parent(), c);
                });
                $(e).attr("data-page", parseInt($(e).attr("data-page"),10) + 1);
            }

            if(data.totalItems <= (query.page * query.limit)){
                $(e).hide();
            }

        },
        error: function(e){
            if(e.responseText){
                error = JSON.parse(e.responseText);
            }else{
                error = {};
                error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
            }
            $('.content').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
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
}


function getUser(){
    if(getQuerystring('user')){
        user = getQuerystring('user');
    }else{
        user = JSON.parse($.cookie("krowd")).user._id;
    }
    reqUrl = apibase + "/user/" + user;
    $.ajax({
        type: "GET",
        url: reqUrl,
        headers: headers,
        success: function(data, textStatus) {
            $(".profile .fullname").html(data['fullname']);
            $(".profile .username").html("@" + data['username']);
            $(".profile .profile-image").attr('src', data['profile_image']);
            $(".profile .posts").html(data['posts']);
            $(".profile .followers").html(data['followers']);
            $(".profile .followers").attr('data-uid', user);
            $(".profile .following").html(data['following']);
            $(".profile .following").attr('data-uid', user);
            if(data['_id'] != JSON.parse($.cookie("krowd")).user._id){
                $('.unfollow-user, .follow-user').attr('data-id',data['_id']);

                if(data.relationship['following'] === true){
                    $('.unfollow-user').show();

                }else{
                    $('.follow-user').show();
                }
                $('.compose').html('@' + data['username'] + '&nbsp');

            }else{
                $('.profile .panel-body.me').html("What's on your Mind?");
                $('.compose').html('Compose a Post');
            }
            user = data;
        },
        error: function(e){
            if(e.responseText){
                error = JSON.parse(e.responseText);
            }else{
                error = {};
                error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
            }
            $('.content').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
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
}

function getActivity(query,newposts){
    if(query){
        reqUrl = apibase + query;
    }else{
       reqUrl = apibase + "/activity";
    }
    $.support.cors = true;
    $.ajax({
        type: "GET",
        url: reqUrl,
        headers: headers,
        success: function(data, textStatus) {
            $.each( data.items, function( k, v ) {
                activity = $(activityhtml);

                $('.icon', activity).attr('src', v.icon.url);
                $('.user-icon', activity).attr('src', v.actor.image.url);
                $('.user-icon', activity).parent().attr('href',"user.html?user=" + v.actor.id);
                $('p', activity).html(v.title);
                var date = new Date(v.published);
                $('.timeago', activity).attr("title", date.toISOString());
                $('.timeago', activity).timeago();
                $('.view-conversation', activity).click(function(){
                    $(this).closest('.panel').find('.test').stop().slideToggle("slow");
                });

                if(newposts){
                    $('.stream-hidden').prepend(activity);
                    $('.number').html($('.stream-hidden > div').length);
                    if($('.stream-hidden > div').length > 1){
                        $('.suffix').html('s ');
                    }
                    $('.new-posts').fadeIn( "slow");
                }else{
                    $('.stream').append(activity);
                }
                
                if(v.verb == 'mention' || v.object.objectType == "comment"){

                    if(v.object.json){
                        post = buildPost(k,v.object.json);
                        $('.test', activity).html(post);
                    }else if(v.target.json){
                        post = buildPost(k,v.target.json);
                        $('.test', activity).html(post);
                    }

                }
                
            });
            $('.stream').attr("data-new", data.pagination.new);
            $('.stream').attr("data-next", data.pagination.next);
            $('.stream').attr("data-prev", data.pagination.prev);
            postActions();
            setTimeout(function() { getActivity($('.stream').attr('data-new'),'new'); }, 10000);
        },
        error: function(e){
            if(e.responseText){
                error = JSON.parse(e.responseText);
            }else{
                error = {};
                error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
            }
            $('.content').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
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
}


//Generic functions

Date.prototype.dateToISO8601String  = function() {
    var padDigits = function padDigits(number, digits) {
        return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
    };

    var offsetMinutes = this.getTimezoneOffset();
    var offsetHours = offsetMinutes / 60;
    var offset= "Z";

    if (offsetHours < 0)
        offset = "-" + padDigits(offsetHours.replace("-","") + "00",4);
    else if (offsetHours > 0)
        offset = "+" + padDigits(offsetHours  + "00", 4);

    return this.getFullYear()+ "-" + padDigits((this.getUTCMonth()+1),2)+ "-" + padDigits(this.getUTCDate(),2)+ "T"+ padDigits(this.getUTCHours(),2)+ ":" + padDigits(this.getUTCMinutes(),2)+ ":" + padDigits(this.getUTCSeconds(),2)+ "." + padDigits(this.getUTCMilliseconds(),2)+ offset;

};

checkToken();

function checkToken(){
    var date = new Date();
    var left = (($.cookie("expires") - date.getTime()) / 1000);
    if(left < 300){
        reqUrl = authbase + "/user/oauth/token";
        data = {};
        data['grant_type'] = "access_token";
        data['refresh_token'] = $.cookie("token");
        $.support.cors = true;
        $.ajax({
            type: "POST",
            url: reqUrl,
            data: data,
            headers: headers,
            success: function(data, textStatus) {
                var date = new Date();
                date.setTime(date.getTime() + (3600 * 1000));
                $.cookie("token", data['access_token'], { "expires": date, "path": "/" });
                $.cookie("expires", date.getTime(), { "expires": date, "path": "/" });
                $.cookie("krowd", JSON.stringify(data), { "expires": date, "path": "/" });
                headers = {'Authorization': 'Token token="' + data['access_token'] + '"'};
            },
        error: function(e){
            if(e.responseText){
                error = JSON.parse(e.responseText);
            }else{
                error = {};
                error.error.error_message = 'Something went horribly wrong, please try again in a bit.';
            }
            $('.login').prepend('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button>'+error.error.error_message+'</div>');
            $('.btn').removeAttr('disabled');
            $('.btn').toggleClass('loading disabled');
        },
        complete: function(request, status) {
        },
        statusCode: {
            200: function(data) {
            }
        }
        });
    }
    setTimeout(function() { checkToken(); }, 10000);
}
function setCursorToEnd(ele)
  {
    var range = document.createRange();
    var sel = window.getSelection();

    range.setStart(ele, 1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    ele.focus();
  }
