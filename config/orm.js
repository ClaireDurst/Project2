/*
 *  (Project 2):
 *      orm.js - ya dont want to know, buddy.
 *
 *-------------------------------------->8------------------------------------*/

 var path = require('path')
   , cxs = require('./sequelize.js');

var ORM = {
    allUsers: function (cb) {
        cxs.User.findAll()
            .then((data) => {
                return cb(data);
            });
    },
    findOne: function (email, cb) {
        cxs.User.findOne({where: { user_email: email }}).then(function(data) {
            return cb(data);
        }).catch(function(err) {
            throw new Error(err);
        });
    },
    loginUser: function (name, email, cb) {
        cxs.User.findOne({ where: { user_email: email }}).then((data) => {
            if (data != null) {
                return cb(true);
            } else {
                cxs.User.create({ user_name: name, user_email: email}).then((data) => {
                    return cb(data);
                }).catch((err) => {
                    throw new Error(err);
                });
            }
        });
        // cxs.User.create({ user_name: user, user_email: email }).then((data) => {
        //     return cb(data);
        // }).catch((err) => {
        //     throw new Error(err);
        // });
    }
};

module.exports = ORM;
