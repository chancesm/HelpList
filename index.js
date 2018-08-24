'use strict'
const express = require('express')
var session = require('express-session')
const http = require('http')
let app = express()
let server = http.Server(app)
let io = require('socket.io')(server);
let bp = require('body-parser')
const helplist = require('./controllers/helplist')
app.use(session({
    secret: 'byu-it210-help-list-secret',
    resave: false,
    saveUninitialized: true
}))
app.use(bp.urlencoded({extended:false}))

app.set('views', 'views')
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    Promise.all([helplist.getHelpList(),helplist.getPassList()])
    .then(data => {
        console.log(data)
        
        res.render('index',{user:1,help:data[0], pass:data[1]})
    })
    .catch(e=>{res.status(500).send(`There was an error:${e}`)})
})

app.get('/login', (req,res)=> {
    res.render('login')
})
app.post('/auth/login', (req,res) => {
    console.log(req.body);
    res.json(req.body)
})

app.get('/register', (req,res)=> {
    res.render('register')
})
app.post('/auth/register', (req,res) => {
    res.send('ahhhh')
})

    
io.on('connection', (socket) => {
    console.log('Successful socket connection')
    socket.on('test', (data) => {
        console.log(data)
    })
    socket.on('addhelp', data => {
        console.log('Adding to Help List')
    })
    soocket.on('addpass', data => {
        console.log('Adding to Pass List')
    })
})

server.listen(3000, (e) => {
    if (e) console.log(e)
    console.log(`Server running`)
})