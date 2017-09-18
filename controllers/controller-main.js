/*
 *  (Dynamic Planner):
 *      controller-main.js - Express controller for production use
 *
 *-------------------------------------->8------------------------------------*/

var express = require('express')
  , handlebars = require('express-handlebars')
  , bodyparser = require('body-parser')
  , path = require('path')
  , moment = require('moment')
  , ORM = require(path.join(__dirname, '/../config/orm.js'));

var PORT = process.env.PORT || 3000;

console.log('+ controller-main.js');

var app = express();


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.text());
app.use(bodyparser.json({ type: "application/vnd.api+json" }));
app.use(express.static('public'));
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set("view engine", 'handlebars');

app.post("/login", (req, resp) => {
    console.log("POST '/login' => " + JSON.stringify(req.body));
    // check for existing user, create one if necessary... respond with the returned data.
    if (req.body.email) {
        ORM.checkUser(req.body.email, (data) => {
            resp.send(data);
        });
    } else {
        resp.send(false);
    }

});

app.post("/createUser", (req, resp) => {
    if (req.body.email && req.body.firstName && req.body.lastName) {
        ORM.createUser(req.body.firstName, req.body.lastName, req.body.email, (data) => {
            var x = JSON.stringify(data);
            resp.send(x);
        });
    }
});

app.post("/create/Project", (req, resp) => {
    if (req.body.uid && req.body.pname && req.body.ppriv && req.body.pstart) {
        ORM.createProject(req.body.uid, req.body.pname, req.body.pstart, req.body.pgoal, req.body.collabs, req.body.privacy, (data) => {
            var x = JSON.stringify(data);
            resp.send(x);
        });
    }
});

app.get("/view/calandarWeek/:weekof", (req, resp) => {
    var weekOf = req.params.weekOf;
    var rx = /[0-9]{2}[-][0-9]{2}[-][0-9]{4}/;
    if (! rx.test(weekOf)) {
        weekOf = moment().format('MM-DD-YYYY');
    }
    resp.render('jt_calandarWeek', {
        layout: 'empty',
        helpers: {
            week_of: function() {
                return weekOf;
            }
        }
    });
});


app.get("/form/:formName", (req, resp) =>{
    resp.render('form_' + req.params.formName, {
        layout: "empty",
        helpers: {
            today: function() {
                return moment().format('YYYY-MM-DD');
            },
            next_week: function() {
                return moment().add(1, "week").format('YYYY-MM-DD');
            }
        }
    });
});

app.get('/jt/:jtName', (req, resp) => {
    resp.render('jt_' + req.params.jtName, {
        layout: "empty"
    });
});

app.get('/user/events/byEmail/:email', (req, resp) => {
    var email = req.params.email;
    var target_uid = undefined;
    var patnEmail = /^[a-z]+[a-z0-9.+_-]*[@][a-z]+[a-z0-9+._-]*[.][a-z]+$/i; // must start with any letter, and be a mix of letters, numbers, dashes, dots, and underlines, followed by an @, and the same rules again, plus a . anything
    if (patnEmail.test(email)) {
        // valid email, get associated UID
        ORM.userFromEmail(email, (userdata) => {
            // Use UID to get associated events
            target_uid = userdata.id;
            ORM.userEvents(target_uid, (events) => {
                resp.send(JSON.stringify(events));
            });
        });
    } else {
        // Send error code 400 to halt server side execution
        console.log("GET => /user/events/byEmail/<email>... Passed Email didn't match the patn");
        resp.sendStatus(400); // "400 - Invalid Request"
    }
});

app.get('/user/events/byUID/:uid', (req, resp) => {
    var target_uid = req.params.uid;
    var patnUID = /^[1-9][0-9]*$/;      // must start with a 1 or more (no zeros to begin with), and must be and integer
    if (patnUID.test(target_uid)) {
        // UID not blatantly invalid... pull any events associated with it
        ORM.userEvents(target_uid, (events) => {
            resp.send(JSON.stringify(events));
        });
    } else {
        // UID doesn't match the pattern, push error code 400
        console.log("GET => /user/events/byUID/<uid>... Passed ID didn't match the patn");
        resp.sendStatus(400); // "400 - Invalid Request"
    }
})

app.use((req, res) => {
    res.render('index', {
        helpers: {
            port: function() {
                return PORT;
            }
        }
    });
});

app.listen(PORT, function () {
    console.log("Server is listening on port " + PORT);
});
