const Sequelize = require('sequelize')
let db = new Sequelize('helpsite', null, null, {
    dialect: "sqlite",
    storage: './db/helpsite.db',
})
exports.addHelp = (req, res) => {

}
exports.getHelpList = (req,res) => {
    return db.query('SELECT * FROM help INNER JOIN users ON users.id=help.userId',{type:db.QueryTypes.SELECT})
    .then(data => {
        //console.log('HELPLIST',data)
        return data
    })
}
exports.getPassList = (req,res) => {
    return db.query('SELECT * FROM passoff INNER JOIN users ON users.id=passoff.userId',{type:db.QueryTypes.SELECT})
    .then(data => {
        //console.log('PassList',data)
        return data
    })
}