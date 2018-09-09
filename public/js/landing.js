//$(document).ready(function() {

//const bootstrap = require('bootstrap');
//require('bootstrap/dist/css/bootstrap.css');


    function checkLoginState() {
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
    }
    function statusChangeCallback(response){
        if(response.status==='connected'){
          //  console.log(JSON.stringify(response),response.authResponse.userID);
            var url = '/me?fields=id,name,email';
            FB.api(url, function(response) {
                  ///alert(response.name + " " + response.id + " " +response.email);
                  console.log(JSON.stringify(response));
                  window.location.href = '/user/'+response.id;  //need to switch to body parser
             }, {scope: 'email'});
            /*
            FB.api('/me', function(response) {
            });
            */
        }
    }

    window.fbAsyncInit = function() {
        FB.init({
            appId      : '258268861349318', //'1931460180439762',
            cookie     : true,
            xfbml      : true,
            version    : 'v2.10'
        });
        FB.AppEvents.logPageView();
        /*
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
        });
        */
    };
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

//});
