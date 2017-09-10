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

const User = sequelize.define('user', {
    user_id: {
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

// force: true will drop the table if it already exists
User.sync({ force: false }).then(() => {
    // Table created
    // return User.create({
    //     user_name: 'James',
    //     user_email: 'jamlith@gmail.com'
    // });
});

module.exports = {
    db: sequelize,
    user: User
}
