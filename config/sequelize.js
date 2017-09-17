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
        // yeah
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



// var dbEvent = sequelize.define('event', {
//     event_id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     event_name: {
//         type: Sequelize.STRING,
//         allowNull:false,
//         validator: {
//             is: ["[a-z_", 'i']
//         }
//     },
//     event_description: {
//         type: Sequelize.TEXT,
//         allowNull: true
//     },
//     event_collaborators: {
//         type: Sequelize.JSON,
//         allowNull: true,
//         defaultValue: null
//     },
//     event_goal: {
//         type: Sequelize.DATEONLY,
//         allowNull: true,
//         defaultValue: null
//     },
//     event_is_complete: {
//         type: Sequelize.BOOLEAN,
//         allowNull: false,
//         defaultValue: 0
//     }
// });

var Project = sequelize.define('project', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    project_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    project_description: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    project_start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    project_goal_date: {
        type: Sequelize.DATE,
        allowNull: true
    },
    project_collaborators: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    project_privacy: {
        type: Sequelize.ENUM('public', 'hidden', 'private'),
        allowNull: false,
        defaultValue: "private"
    },
    project_status: {
        type: Sequelize.ENUM('pending', 'stalled', 'on_schedule', 'delayed', 'complete'),
        allowNull: false,
        defaultValue: "pending"
    }
});

User.hasMany(Project, {
    onDelete: "CASCADE"
});



var SubTask = sequelize.define('subtask', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    subtask_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    subtask_description: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    subtask_assigned_to: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "owner"
    },
    subtask_status: {
        type: Sequelize.ENUM('pending', 'stalled', 'on_schedule', 'delayed', 'complete'),
        allowNull: false,
        defaultValue: 'pending'
    },
    subtask_goal_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
    }
});

Project.hasMany(SubTask, {
    onDelete: "CASCADE"
});

SubTask.belongsTo(Project);

// force: true will drop the table if it already exists
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        User.sync({ force: false }).then(() => {
            Project.sync({ force: false }).then(() => {
                SubTask.sync({ force: false }).then(() => {
                    console.log('Sequelize is all sync\'d up!');
                });
            });
        });
    });

module.exports = {
    "User": User,
    "Project": Project,
    "SubTask": SubTask
};
