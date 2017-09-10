/*
 *  (Dynamic Planner):
 *      main.js - the js code to be loaded on every page.
 *
 *-------------------------------------->8------------------------------------*/
console.log('+main.js');

 $(document).ready(function() {
     window.fbAsyncInit = function () {
         console.log('async init');
         FB.init({
             appId: '103017880442508',
             cookie: true,
             xfbml: true,
             version: 'v2.10'
         });
         FB.AppEvents.logPageView();

         FB.getLoginStatus((status) => {
             console.log(status);
         })
     };

     (function (d, s, id) {
         console.log('fb init');
         var js, fjs = d.getElementsByTagName(s)[ 0 ];
         if (d.getElementById(id)) { return; }
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));


 });
