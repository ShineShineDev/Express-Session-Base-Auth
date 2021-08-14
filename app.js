//app.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use('/static', express.static(path.join(__dirname, 'public'))) 
app.use(session({
    secret: '0SAfsdklas9ieWAE',
    resave: true,  
    saveUninitialized: true
}))
app.set('view engine','ejs');
app.set('views', './views');

const makeAuth = (req,res,next)=>{
   if(req.session.user){
      next();     //If session exists, proceed to page
   } else {
       res.redirect('/login');
   }
}

var Accounts = [];

// show login form
app.get('/login',(req,res)=>{
   res.render("login",{message: ""});
});

// show register form
app.get('/register',(req,res)=>{
   res.render("register",{message: ""});
});

app.post('/register',(req,res)=>{
    //  res.send(`username : ${req.body.username}, password ${req.body.password}`);
    // check user in accounts ary
    const isAccountsExist = Accounts.some((user) => user.username === req.body.username);
    if(isAccountsExist){
        return res.render('login', { message: "User Already Exists!" } );
    }
    const newUser = {
          username: req.body.username,
          password: req.body.password
    };
    Accounts.push(newUser);
    req.session.user = newUser;
    return res.render('user', { user: newUser} );
});

app.post('/login',(req,res)=>{
    const checkUsername = Accounts.some((user) => user.username === req.body.username);
    const checkPassword = Accounts.some((user) => user.password === req.body.password);
    if(!checkUsername || !checkPassword){
        return res.render('login', { message: "Invalid credentials!" } );
    }
    const user = {
          username: req.body.username,
          password: req.body.password
    };
    req.session.user = user;
    return res.render('user', {user});
});

app.get('/user',makeAuth,(req,res)=>{
    const user = req.session.user;
   res.render('user',{user});
});

app.get('/dashboard',makeAuth,(req,res)=>{
    const user = req.session.user;
   res.render('user',{user});
});

app.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err) return console.log(err);
        console.log("Session Destroyed") ;
    })
    res.redirect("/login");
});
app.get('/get-session',(req,res)=>{
   res.send(JSON.stringify(req.session.user));
});

app.listen(8080,(err)=>{
    if(err) return console.log(err.message);
    console.log('Server runnning on port 8080');
})