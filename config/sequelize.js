var Sequelize = require('sequelize');

const sequelize = new Sequelize('hr0vdec8yom4q8ik', 'givj98e77xcypqaw', 'pba0j70rtzbq6pmx', {
    host: 'erxv1bzckceve5lh.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    define: {
        underscored: true
    }
});


var User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_lastName: {
        type: Sequelize.STRING,
        allowNull:false
    },
    user_email: {
        type: Sequelize.STRING,
        allowNull: false,
        validator: {
            isEmail: true
        }
    }
});



var Event = sequelize.define('event', {
    event_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    event_name: {
        type: Sequelize.STRING,
        allowNull:false,
        validator: {
            is: ["[a-z_", 'i']
        }
    },
    event_collaborators: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: null
    },
    event_deadline: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        defaultValue: null
    },
    event_is_complete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
});



User.hasMany(Event, {
    onDelete: "CASCADE"
});


// force: true will drop the table if it already exists
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');

User.sync({ force: false }).then(() => {
    Event.sync({ force: false }).then(() => {
        module.exports = {
            "User": User,
            "Event": Event
        };
    });
});
});




