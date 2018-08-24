var Sequelize = require('sequelize');

var sequelize = new Sequelize('helpsite', null, null, {
    dialect: "sqlite",
    storage: './helpsite.db',
});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  }, function (err) {
    console.log('Unable to connect to the database:', err);
  });

exports.Sequelize = Sequelize;
exports.sequelize = sequelize;