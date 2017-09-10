/*
 *  (Project 2):
 *      orm.js - ya dont want to know, buddy.
 *
 *-------------------------------------->8------------------------------------*/

 var path = require('path')
   , db = require('./sequelize.js');

var ORM = {
    findUsers: function (user) {
        db.user.findall()
            .then((data) => {
                console.log(data);
            });

    }
};

module.exports = ORM;
