const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_people_places_things');

const Person = conn.define('person', {
    name:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

const Place = conn.define('place', {
    name:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

const Thing = conn.define('thing', {
    name:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }
});

const Souvenir = conn.define('souvenir',{
    
    personId:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    placeId:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    thingId:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Souvenir.belongsTo(Person);
Souvenir.belongsTo(Place);
Souvenir.belongsTo(Thing);

module.exports = {
    conn,
    Person,
    Place,
    Thing,
    Souvenir
};