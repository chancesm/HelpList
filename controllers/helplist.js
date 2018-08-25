
let getHelpList = (db) => {
    return db.query('SELECT help.id,room,problem,firstName,lastName,displayName,netid FROM help INNER JOIN users ON users.id=help.userId',{type:db.QueryTypes.SELECT})
    .then(data => {
        //console.log('HELPLIST',data)
        return data
    })
}
let getPassList = (db) => {
    return db.query('SELECT passoff.id,room,problem,firstName,lastName,displayName,netid FROM passoff INNER JOIN users ON users.id=passoff.userId',{type:db.QueryTypes.SELECT})
    .then(data => {
        //console.log('PassList',data)
        return data
    })
}
exports.getBothLists = db => {
    return Promise.all([getHelpList(db),getPassList(db)])
}
exports.selectUser = (db, username, password) => {
    return db.query('SELECT id,firstName,lastName,displayName,netid,admin from users where netid=:netid AND password=:password',
    {
        type:db.QueryTypes.SELECT,
        replacements: {
            netid: username,
            password
        }
    })
}
exports.selectUserById = (db, id) => {
    return db.query('SELECT id,firstName,lastName,displayName,netid,admin from users where id=:id',
    {
        type:db.QueryTypes.SELECT,
        replacements:{id}
    })
}         
exports.addHelp = (req, db) => {
    return db.query('INSERT INTO help (userId,room,problem) VALUES (:userid,:room,:problem);',
    {
        type:db.QueryTypes.INSERT,
        replacements: {
            userid: +req.user.id,
            room: +req.query.room,
            problem: req.query.problem
        }
    })
    .then(data => {
        //console.log(data)
        return "Success"
    })
    .catch(e=> {
        //console.log(e)
        return "Error"
    })
}
