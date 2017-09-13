/*
 *  (Dynamic Planner):
 *      main.js - the js code to be loaded on every page.
 *
 *-------------------------------------->8------------------------------------*/

 /*
 AVAILABLE FB fields:
 id
cover
name
first_name
last_name
age_range
link
gender
locale
picture
timezone
updated_time
verified
email
*/
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
    // prompt user for fb login, then update login status (localhost testing skips FB completly, pinging the DB server as "testy mctesterson testies@yayaya.com")
    if (document.URL == "http://localhost:3000/#") {
        console.log('testing server detected, localhost is prohibited by FB api... will use generic arguments to simulate login, passing them to the database now.');
        UserData.fb_state = "connected";
        UserData.isLoggedIn = true;
        UserData.user_email = "testies@yayaya.com";
        UserData.user_firstName = "Testy";
        UserData.user_lastName = "McTesterson";
        UserData.user_fullName = UserData.first_name + ' ' + UserData.last_name;
        $.post('/login', { email: UserData.user_email + "" }, (data) => {
            console.log(data);
            if (data) {
                var x = JSON.parse(data);
                UserData.isNew = false;
                UserData.user_id = x.id;
                loggedIn();
            } else {
                $.post('/create', { firstName: UserData.user_firstName, lastName: UserData.user_lastName, "email": UserData.user_email }, (data) => {
                    var x = JSON.parse(data);
                    UserData.isNew = true;
                    UserData.user_id = x.id;
                    loggedIn();
                })
            }
        });
    } else {
        console.log('Production Server detected, Using Facebook API!');
        FB.login(function (status) {
            loginStatus(status);
        }, { scope: 'public_profile,email' });
    }

}
function loggedIn() {
    $('#nav_logIn').hide();
    $('#nav_logOut').show();
    console.log(UserData);
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
        if (document.URL != "http://localhost:3000/#") {
            FB.getLoginStatus((resp) => {
                // update login status
                loginStatus(resp.status);
            });
        }
    };

 });
