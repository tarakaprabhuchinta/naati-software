const express = require('express');
const app = express();
const mysql = require('mysql');
const parser = require('body-parser');
const session = require('express-session')
const http = require('http'); // or 'https' for https:// URLs
const fs = require('fs');



try{
//mysql connection
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ta@234824"
  });
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
}
catch(err){
    console.log("cannot connect to database"+err)
}
app.set('view engine', 'ejs');
app.use(parser.urlencoded({ extended: true }));
app.use(session({
    secret: 'scaredy-cat',
    resave: false,
    saveUninitialized: false,
    // set cookie age for 5 hours.
    cookie: { maxAge: 3600000*5}
  }))
app.get(['/','/login'], function(req, res){
    if(!req.session.login){
        res.render('login')
    }
    else{ 
    res.render('dialogues-list')
    }
});
app.post('/login-user', function(req, res){
   email = req.body.email
   password = req.body.password
   try {
    var sql = "SELECT * FROM `naati database`.`users` WHERE `email`='"+email+"' AND `password`='"+password+"' AND `active`='"+1+"'";
    console.log(sql)
    con.query(sql, function (err, result) {
    if (err){
        console.log(err)
    }
    else{
    if( result.length == 1){
        req.session.email = email
        if(req.session.email === 'tarakaprabhuchinta@gmail.com'){
            req.session.admin = true
        }
        req.session.login = true
        console.log(req.session)
        res.render('dialogues-list')
    }    
    else{
        res.render('register-failure')
    }
    }
    });
   } catch (error) {
       console.log(error)
   }
});
app.get(['/logout'], function(req, res){
    req.session.destroy(function(err) {
        // cannot access session here
        res.render('login')
      });
 });
 app.get(['/register'], function(req, res){
    if(!req.session.login){
        res.render('registration')
    }
    else{ 
    res.render('logout-first')
    }
 });
 app.post('/register-form', function (req, res) {  
     email = req.body.email
     password = req.body.password
    try{
        var sql = "INSERT INTO `naati database`.`users` (`email`, `password`) VALUES ('"+email+"','"+password+"')";
        con.query(sql, function (err, result) {
        if (err){
            console.log(err)
        }
        else{
        res.render('register-success')    
        console.log("user record inserted");
        }
        });
        }
        catch(err){
            console.log(err)
        }
 });
 app.get(['/upload'], function(req, res){
    if(!req.session.login){
        res.render('login')
    }
    else{  
    if(!req.session.admin){
        res.send("You dont have admin acccess")
    }
    else{
    res.render('upload')
    }
    }
 });
 app.get(['/vocab'], function(req, res){
    if(!req.session.login){
        res.render('login')
    }
    else{ 
       const file = __dirname+"/materials/vocab.pdf"
       res.download(file); // Set disposition and send it.
    }
 });
 app.get(['/recentq'], function(req, res){
    if(!req.session.login){
        res.render('login')
    }
    else{ 
       const file = __dirname+"/materials/recent questions.docx"
       res.download(file); // Set disposition and send it.
    }
 });
 app.get(['/list'], function(req, res){
    if(!req.session.login){
        res.render('login')
    }
    else{ 
    res.render('dialogues-list')
    }
 });
 app.get(['/view'], function(req, res){
    if(!req.session.login){
        res.render('login')
    }
    else{  
    res.render('full-dialogue')
    }
 });
 app.get('*', function(req, res) {
   res.render('404')
  });
app.listen(8080);