'use strict'
const express = require('express')
let session = require('express-session')
// let SequelizeStore = require('connect-session-sequelize')(session.Store);
// let cookieParser = require('cookie-parser')
const http = require('http')
let app = express()
let server = http.Server(app)
let passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
let io = require('socket.io')(server)
let bp = require('body-parser')

//Database Connection
const Sequelize = require('sequelize')
let db = new Sequelize('helpsite', null, null, {
    dialect: "sqlite",
    storage: './db/helpsite.db',
    logging:false
})

//Helper Functions
const helplist = require('./controllers/helplist')

//EXPRESS SETTINGS
app.set('views', 'views')
app.set('view engine', 'ejs')
app.use(session({
    secret: 'byu-it210-help-list-secret',
    
    resave: false,
    saveUninitialized: true,
    
}))
//app.use(cookieParser('byu-it210-help-list-secret'))
app.use(bp.urlencoded({extended:false}))
app.use(express.static('public'))

// AUTHENTICATION STUFF
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(
  function(username, password, done) {
    helplist.selectUser(db,username,password)
    .then(data => {
        let user = data[0]
        if(!user) return done(null,false,"Invalid username or password")
        return done(null,user)
    })
    .catch(e=> {
        console.log(e)
        return done(e)
    })
  }
))
passport.serializeUser(function(user, cb) {
    console.log(user)
    cb(null, user.id);
})
passport.deserializeUser(function(id, cb) {
    helplist.selectUserById(db,id)
    .then(data => {
        let user = data[0]
        cb(null,user)
    })
});

//Protect Middleware
let Protect = (req,res,next) => {
    if (req.user) next()
    else res.redirect('/login')
}
//returns the user or 1
let getUser = req => req.user ? req.user : 1

// AUTHENTICATION View ROUTES
app.get('/login', (req,res)=> {
    res.render('login', {user:getUser(req)})
})
app.get('/register', (req,res)=> {
    res.render('register', {user:getUser(req)})
})

// AUTHENTICATION Action ROUTES
app.post('/auth/login',
    passport.authenticate('local', 
    { 
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true 
    }
));
app.post('/auth/register', (req,res) => {
    res.send('ahhhh')
})
app.get('/logout',(req,res) => {
    req.logout()
    res.redirect('/login')
})

// APPLICATION ROUTES
app.get('/',Protect, (req, res) => {
    helplist.getBothLists(db)
    .then(data => {
        
        //console.log("USER",req.user)
        res.render('index',{user:getUser(req),help:data[0], pass:data[1]})
    })
    .catch(e=>{res.status(500).send(`There was an error:${e}`)})
})

app.get('/addHelp',Protect, (req,res)=>{
    helplist.addHelp(req,db)
    .then((status) => {
        if(status="Success"){
            helplist.getBothLists(db)
            .then(data => {
                io.sockets.emit('newlists',
                {
                    help:data[0],
                    pass:data[1]
                })
            })
        }
    })
    .catch(e => {
        console.log(e)
    })
    io.sockets.emit('asdf', {msg: 'IT WORKED!!!'}) //WORKS!!!
    res.send('Socket Emitted')

})
app.post('/addPass',(req,res)=>{
    
})
    
io.on('connection', socket=> {
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('test', (msg) => {
        console.log(msg)
    })

    io.emit('asdf',{msg:'asdfqwerzxcv'})
});
server.listen(3000, (e) => {
    if (e) console.log(e)
    console.log(`Server running`)
})