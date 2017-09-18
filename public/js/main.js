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
    uuid: undefined,
    user_firstName: undefined,
    user_lastName: undefined,
    user_fullName: undefined,
    user_email: undefined,
    user_picture: undefined,
    isNew: undefined
};

// functions

function logIn() {
    // prompt user for fb login, then update login status (localhost testing skips FB completly, pinging the DB server as "testy mctesterson testies@yayaya.com")
    FB.login(function (resp) {
        console.log(resp.status);
        loginStatus(resp.status);
    }, { scope: 'public_profile,email,picture' });
}

function replaceJumbotron(endpoint) {
    $.get(endpoint, (html) => {
        $('#jt_container').html(html);
    });
}

function replaceContent(endpoint) {
    $.get(endpoint, (html) => {
        $("#content_container").html(html);
    });
}

function replaceModal(label, endpoint, cb = function() {
    $('#form_modal').modal('show');
}) {
    $('#modal_label').text(label);
    $.get(endpoint, (html) => {
        $('#modal_body').html(html);
        return cb();
    });
}

function logOut() {
    // send FB API the logout signal, then run loggedOut()
    FB.logout();
    loggedOut();
}
function init() {
    // TODO: Init to logged in state, as opposed to logged out.
    $('#nav_logOut').hide();
    $('#nav_logIn').click((event) => {
        FB.login((resp) => {
            loginStatus(resp.status);
        }, { scope: "public_profile,email" });
    });
    $('#nav_logOut').click((event) => {
        logOut();
    });
    $('#nav_newProject').click((event) => {
        replaceModal('Create a New Project', 'form/createProject');
    });
    $('#dropdown01').addClass('disabled');
    $('#dropdown02').addClass('disabled');
    $('#jt_logIn').click((event) => {
        FB.login((resp) => {
            loginStatus(resp.status);
        });
    });
    $('#nav_weeklyView').click((event) => {
        replaceJumbotron('view/calandarWeek/' + moment().format("MM-DD-YYYY"));
    });
}
function loggedIn() {
    $('#nav_logIn').hide();
    $('#nav_logOut').show();
    var i = $('<img id=nav_profilePic src=' + UserData.user_picture + '>');
    i.prependTo($("#logIn_logOut"));
    $('#dont_believe_the_hype').fadeOut();
    console.log(UserData);
    $('#dropdown01').removeClass('disabled');
    $('#dropdown02').removeClass('disabled');
    replaceJumbotron('jt/loggedIn');
}
function loggedOut() {
    // switch the log out button for a log in button
    $('#nav_logOut').hide();
    $('#nav_logIn').show();
    $('#dont_believe_the_hype').fadeIn();
    $('#nav_profilePic').detach();
    $('#dropdown01').addClass('disabled');
    $('#dropdown02').addClass('disabled');
    replaceJumbotron('jt/loggedOut');
    // reset UserData
    UserData.isLoggedIn = false;
    UserData.fb_state = null;
    UserData.uuid = undefined;
    UserData.user_firstName = undefined;
    UserData.user_lastName = undefined;
    UserData.user_fullName = undefined;
    UserData.user_email = undefined;
    UserData.user_isNew = undefined;
    UserData.user_picture = undefined;
}
function loginStatus(status) {
    // the function called when FB.login completes;  Runs an API call to FB to
    // get user's info, then checks database for existing user

    console.log('FB logins status: (' + status + ')');
    UserData.fb_state = status;
    if (status == "connected") {
        // Connected to FB, query API
        console.log("FB logged in TRUE, querying FB API for user's name/email...");
        FB.api('/me', { fields: 'first_name,last_name,email,picture' }, (response) => {
            // API response recieved, use returned info to set UserData & check for/create user in the DB
            console.log("API Response recieved.... " + response.first_name + " " + response.last_name + " -> " + response.email + "; return/create user's database entry.");
            UserData.isLoggedIn = true;
            UserData.user_firstName = response.first_name;
            UserData.user_lastName = response.last_name;
            UserData.user_email = response.email;
            UserData.user_picture = response.picture.data.url;
            UserData.user_fullName = response.first_name + " " + response.last_name;
            $.post('/login', { email: UserData.user_email + "" }, (data) => {
                if (data) {
                    // User exists, saving id to UserData object and completing login sequence
                    var x = JSON.parse(data);
                    UserData.isNew = false;
                    UserData.uuid = x.uuid;
                    loggedIn();
                } else {
                    // Create new user in DB
                    console.log('Posting user details to be written to users table in DB.');
                    $.post('/createUser', { firstName: UserData.user_firstName, lastName: UserData.user_lastName, "email": UserData.user_email, user_picture: UserData.user_picture }, (data) => {
                        // User created, writing info to UserData object and completing login sequence
                        var x = JSON.parse(data);
                        UserData.isNew = true;
                        UserData.uuid = x.uuid;
                        loggedIn();
                    });
                }
            });
        });
    }
}


// Facebook API load/init
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
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
            version: 'v2.8'
        });
        // query FB for current login status
        console.log('about to getLoginStatus');
        FB.getLoginStatus((resp) => {
            console.log('FB login status response');
            console.log(resp);
            // update login status
            loginStatus(resp.status);
        });
    };


 });
