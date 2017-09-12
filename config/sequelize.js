var Sequelize = require('sequelize');

const sequelize = new Sequelize('hr0vdec8yom4q8ik', 'givj98e77xcypqaw', 'pba0j70rtzbq6pmx', {
    host: 'erxv1bzckceve5lh.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

var User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_email: {
        type: Sequelize.STRING,
        allowNull: false,
        validator: {
            isEmail: true
        }
    }

}, {
    underscored: true,
    indexes: [{
    unique: true,
    fields: [ 'user_email' ]
    }]

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
    deadline: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    is_finished: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
}, {
    underscored: true,
    indexes: [{
        unique: true,
        fields: ['event_id']
    }]
});



User.hasMany(Event, {
    onDelete: "CASCADE"
});



// force: true will drop the table if it already exists
User.sync({ force: false }).then(() => {
    Event.sync({ force: false }).then(() => {
        module.exports = {
            "User": User
        };
    });
});


module.exports = {
    "User": User
}


