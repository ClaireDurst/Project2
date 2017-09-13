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
    // check for existing user, create one if necessary... respond with the returned data.
    if (req.body.email && req.body.firstName && req.body.lastName) {
        ORM.checkUser(req.body.firstName, req.body.lastName, req.body.email, (data) => {
            resp.send(data);
        });
    } else {
        resp.send(false);
    }

});

app.use((req, res) => {
    console.log(req.method);
    if (toString(req.body) !== "{}") {
        console.log(req.body);
    }
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
