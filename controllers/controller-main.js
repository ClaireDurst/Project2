/*
 *  (Dynamic Planner):
 *      controller-main.js - Express controller for production use
 *
 *-------------------------------------->8------------------------------------*/

var express = require('express')
  , handlebars = require('express-handlebars')
  , bodyparser = require('body-parser')
  , path = require('path')
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

app.post("/create", (req, resp) => {
    if (req.body.email && req.body.firstName && req.body.lastName) {
        ORM.createUser(req.body.firstName, req.body.lastName, req.body.email, (data) => {
            var x = JSON.stringify(data);
            resp.send(x);
        });
    }
});

app.get("/test", (req, resp) => {
    ORM.checkUser('jamlith@gmail.com', (isNew) => {
        console.log("isNew: " + isNew);
    });
});

app.get("/form/createEvent", (req, resp) =>{
    resp.render('form_createEvent', {
        layout: "empty",
        helpers: {
            today: function() {
                return Date.now();
            }
        }
    });
});

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
