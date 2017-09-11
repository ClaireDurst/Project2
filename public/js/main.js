/*
 *  (Dynamic Planner):
 *      main.js - the js code to be loaded on every page.
 *
 *-------------------------------------->8------------------------------------*/
console.log('+main.js');

function logOutFB() {
    FB.logout();
    $('#login_button').html('<a href="#" class="btn btn-outline-success" onClick="FB.login(function(response) { loginStatus(response); }, {scope: \'public_profile, email\'});">Login with Facebook</a>');
}
function loginStatus(status) {
    console.log('loginStatus(' + status + ')');
    if (status == "connected") {
        console.log('connected=true!');
        FB.api('/me', { fields: 'first_name,email' }, (response) => {
            console.log("api response");
            console.log(response);
            $.post('/login', { name: response.first_name, email: response.email }, (data) => {
                if (data) {
                    $('#login_button').html('<a href-"#" class="btn btn-outline-success" onClick="FB.logout()">Log Out</a>');
                }
            });
        });
    }
}
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[ 0 ];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

 $(document).ready(function() {
     console.log("document->rdy!");
     window.fbAsyncInit = function () {
        console.log('fbasyncinit...');
        FB.init({
            appId: '103017880442508',
            cookie: true,
            xfbml: true,
            version: 'v2.10'
        });
        FB.AppEvents.logPageView();
        FB.getLoginStatus((resp) => {
            console.log('getLoginStatus Response');
            console.log(resp);
            loginStatus(resp.status);
        });
    };


 });
