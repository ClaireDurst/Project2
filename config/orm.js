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
    userFromEmail: function (email, cb) {
        cxs.User.findOne({where: { user_email: email }}).then(function(data) {
            return cb(data);
        }).catch(function(err) {
            throw new Error(err);
        });
    },
    userFromID: function(id, cb) {
        cxs.User.findOne({ where: { "id": id } }).then(function(data) {
            return cb(data);
        }).catch(function(err) {
            throw new Error(err);
        });
    },
    loginUser: function (name, email, cb) {
        cxs.User.findOne({ where: { user_email: email }}).then((data) => {
            if (data != null) {
                return cb(data);
            } else {
                cxs.User.create({ user_name: name, user_email: email }).then((data) => {
                    return cb(data);
                }).catch((err) => {
                    throw new Error(err);
                });
            }
        });
    },
    getUserEvents: function(owner_id, cb) {
        cxs.Event.findAll({ where: { user_id: owner_id } })
            .then((data) => {
                return cb(data);
            }).catch((err) =>{
                throw new Error(err);
            });
    },
    createEvent: function(owner_id, event_name, deadline=null, cb) {
        cxs.Event.create({ "event_name": event_name, "deadline": deadline, user_id: owner_id }).then((data) => {
            return cb(data);
        }).catch((err) => {
            throw new Error(err);
        });
    }
};


module.exports = ORM;
