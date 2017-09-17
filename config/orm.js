/*
 *  (Project 2):
 *      orm.js - ya dont want to know, buddy.
 *
 *-------------------------------------->8------------------------------------*/

 // cxs.User (`Users` = id, user_firstName!, user_lastName!, user_email!)
 // cxs.dbEvent (`dbEvents` = event_id,

 var path = require('path')
   , cxs = require('./sequelize.js');

var ORM = {
    allUsers: function (cb) {
        // return all users
        cxs.User.findAll()
            .then((data) => {
                return cb(data);
            }).catch((err) => {
                throw new Error(err);
            });
    },
    userFromEmail: function (email, cb) {
        // retrieve user info associated with an email
        cxs.User.findOne({where: { user_email: email }}).then(function(data) {
            return cb(data);
        }).catch(function(err) {
            throw new Error(err);
        });
    },
    userFromID: function(user_id, cb) {
        // retrieve user info associated with an ID
        cxs.User.findOne({ where: { id: user_id } }).then(function(data) {
            return cb(data);
        }).catch(function(err) {
            throw new Error(err);
        });
    },
    checkUser: function (email, cb) {
        // if user exists return info, otherwise create one and return its info
        cxs.User.findOne({ where: { user_email: email }}).then((data) => {
            if (data != null) {
                var x = JSON.stringify(data);
                return cb(x);
            } else {
                return cb(false);
            }
        }).catch((err) => {
            throw new Error(err);
        });
    },
    createUser: function (first_name, last_name, email, cb) {
        cxs.User.create({ user_firstName: first_name, user_lastName: last_name, user_email: email }).then((data) => {
            return cb(data);
        }).catch((err) => {
            throw new Error(err);
        });
    },
    getUserEvents: function(owner_id, cb) {
        // return all events owned by a user ID
        cxs.dbEvent.findAll({ where: { user_id: owner_id } })
            .then((data) => {
                return cb(data);
            }).catch((err) =>{
                throw new Error(err);
            });
    },
    getEventsByDeadline: function(owner_id, deadline) {
        cxs.dbEvent.findAll({ where: { user_id: owner_id, event_deadline: deadline }}).then((data) => {
            return cb(data);
        }).catch((err) => {
            throw new Error(err);
        });
    },
    createEvent: function(owner_id, name, deadline, description, cb) {
        // create a new event, return the row
        cxs.dbEvent.create({ event_name: name, event_deadline: deadline, user_id: owner_id, event_is_complete: 0 }).then((data) => {
            return cb(data);
        }).catch((err) => {
            throw new Error(err);
        });
    },
    createProject: function(owner_id, name, desc, start, goal, collabs, privacy, cb) {
        cxs.Project.create({ user_id: owner_id, project_name: name, project_start_date: start, project_goal_date: goal, project_collaborators: collabs, project_privacy: privacy, project_status: "pending"}).then((data) => {
            return cb(data);
        }).catch((err) => {
            throw new Error(err);
        });
    }
};


module.exports = ORM;
