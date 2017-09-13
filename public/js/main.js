/*
 *  (Dynamic Planner):
 *      main.js - the js code to be loaded on every page.
 *
 *-------------------------------------->8------------------------------------*/
console.log('=====================================(main)=====================================');

// init UserData object
var UserData = {
    isLoggedIn: false,
    fb_state: undefined,
    user_id: undefined,
    user_firstName: undefined,
    user_lastName: undefined,
    user_fullName: undefined,
    user_email: undefined,
    isNew: undefined
};

// functions

function logIn() {
    // prompt user for fb login, then update login status
    FB.login(function (status) {
        loginStatus(status);
    }, { scope: 'public_profile,email' });

}
function loggedIn() {
    $('#nav_logIn').hide();
    $('#nav_logOut').show();
}
function logOut() {
    // send FB API the logout signal, then run loggedOut()
    FB.logout();
    loggedOut();
}
function loggedOut() {
    // switch the log out button for a log in button
    $('#nav_logOut').hide();
    $('#nav_logIn').show();

    // reset UserData
    UserData.isLoggedIn = false;
    UserData.fb_state = null;
    UserData.user_id = undefined;
    UserData.user_firstName = undefined;
    UserData.user_lastName = undefined;
    UserData.user_fullName = undefined;
    UserData.user_email = undefined;
    userData.user_isNew = undefined;
}
function loginStatus(status) {
    // the function called when FB.login completes;  Runs an API call to FB to
    // get user's info, then checks database for existing user
    console.log('FB logins status: (' + status + ')');
    UserData.fb_state = status;
    if (status == "connected") {
        // Connected to FB, query API
        console.log("FB logged in TRUE, querying FB API for user's name/email...");
        FB.api('/me', { fields: 'first_name,last_name,email' }, (response) => {
            // API response recieved, use returned info to set UserData & check for/create user in the DB
            console.log("API Response recieved.... " + response.first_name + " " + response.last_name + " -> " + response.email + "; return/create user's database entry.");
            UserData.isLoggedIn = true;
            UserData.user_firstName = response.first_name;
            UserData.user_lastName = response.last_name;
            UserData.user_email = response.email;
            UserData.user_fullName = response.first_name + " " + response.last_name;
            $.post('/login', { firstName: response.first_name, lastName: response.last_name, email: response.email }, (data) => {
                // database response recieved... should be [ $isNewUser, ${userData} ]
                if (data.length == 2) {
                    // seems to be the correct response format, set UserData and run the loggedIn() function
                    UserData.isNew = data[0];
                    UserData.user_id = data[1].id;
                    loggedIn();
                } else {
                    // returned data wasn't in the expected formet
                    alert("ERROR!  Login failed!  Check log for details.");
                    console.log('FAILED TO RETRIEVE API QUERY FOR USER INFO!  LOGGED OUT AUTOMATICALLY!');
                    console.log('Details:');
                    console.log('RESPONSE => ' + response);
                    logOut();
                }
            });
        });
    }
}
function init() {
    $('#nav_logOut').hide();
    $('#nav_logIn').click((event) => {
        logIn();
    });
    $('#nav_logOut').click((event) => {
        logOut();
    });
}

// Facebook API load/init
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[ 0 ];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Wait for DOM, then run the code
$(document).ready(function() {
    console.log("DOM loaded!");
    init();

    window.fbAsyncInit = function () {
        FB.init({
            appId: '103017880442508',
            cookie: true,
            xfbml: true,
            version: 'v2.10'
        });
        FB.AppEvents.logPageView();
        // query FB for current login status
        FB.getLoginStatus((resp) => {
            // update login status
            loginStatus(resp.status);
        });
    };

 });
