const Sequelize = require('sequelize')
let db = new Sequelize('helpsite', null, null, {
    dialect: "sqlite",
    storage: './db/helpsite.db',
})
db.query("SELECT * FROM users;",
        {
            type:db.QueryTypes.SELECT     
        })
    .then(result => {
        console.log(result)
    })
    .catch(e=> {
        console.log(e)
    })