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
    uuid: {
    // WAS uid: INT , autoInc+priKEy
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1
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
        // Facebook will return a phone number if user substituted theirs for an email
        type: Sequelize.STRING,
        allowNull: false
    },
    user_picture: {
        // faceabook thumb url
        type: Sequelize.STRING,
        allowNull: true
    }
});



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
    project_notes: {
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

User.hasMany(Project);
Project.belongsTo(User);

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
    subtask_notes: {
        type: Sequelize.TEXT,
        allowNull: true
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

/*
var Calandar_Day = sequelize.define('calandar_day', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    day_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    day_notes: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    day_reminders: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    attributes: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

User.hasMany(Calandar_Day, {
    onDelete: "CASCADE"
});
Calandar_Day.belongsTo(User);
*/
var Day = sequelize.define('day', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    day_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    day_notes: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    day_reminders: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    day_attributes: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

User.hasMany(Day, {
    onDelete: "CASCADE"
});
Day.belongsTo(User);

var SeqEvent = sequelize.define('event', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    event_title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    event_description: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    event_notes: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    event_time: {
        type: Sequelize.DATE,
        allowNull: false
    },
    event_duration: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "60"
    },
    event_privacy: {
        type: Sequelize.ENUM('private', 'hidden', 'public'),
        defaultValue: "public"
    },
    event_attributes: {
        type: Sequelize.TEXT,
        allowNull: true
    }
    // ATTR: priority, shared_with, display_color, reminders, etc...
});

User.hasMany(SeqEvent);
SeqEvent.belongsTo(User);

// force: true will drop the table if it already exists
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        User.sync({ force: false }).then(() => {
            Project.sync({ force: false }).then(() => {
                SubTask.sync({ force: false }).then(() => {
                    Day.sync({ force: false }).then(() => {
                        SeqEvent.sync({ force: false }).then(() => {
                            console.log('Sequelize is all sync\'d up!');
                        });
                    });
                });
            });
        });
    });

module.exports = {
    "User": User,
    "Project": Project,
    "SubTask": SubTask,
    "Day": Day,
    "SeqEvent": SeqEvent
};
