var authbase = "http://krowd:8443";
var apibase = "http://krowd:8088";
//demoapp
//var clientid = "514c7ac0a989b21634fd56ff";
//krowdify
var clientid = "537282613ae74037c48f0178";
function getQuerystring(key, default_)
{
    if (default_==null) default_=""; 
    key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if(qs == null)
        return default_;
    else
        return qs[1];
}