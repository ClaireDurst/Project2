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



var Planner = sequelize.define('planner', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    planner_name: {
        type: Sequelize.STRING,
        allowNull:false,
        validator: {
            is: ["[a-z_", 'i']
        }
    },
    public: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
}, {
    underscored: true,
    indexes: [{
        unique: true,
        fields: ['id']
    }]
});


Planner.belongsTo(User, {
    onDelete: "CASCADE",
    foreignKey: 'id'
});


User.hasMany(Planner, {
    onDelete: "CASCADE",
    foreignKey: 'id'
    });


// force: true will drop the table if it already exists
User.sync({ force: false }).then(() => {
    Planner.sync({ force: true }).then(() => {
        module.exports = {
            "User": User
        };
    });
});


module.exports = {
    "User": User
};

