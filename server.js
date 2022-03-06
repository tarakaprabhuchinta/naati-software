const express = require('express');
const app = express();
const mysql = require('mysql');
const parser = require('body-parser');


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
app.get(['/','/login'], function(req, res){
   res.render('login')
});
app.post('/login-user', function(req, res){
   email = req.body.email
   password = req.body.password
   try {
    var sql = "SELECT * FROM `naati database`.`users` WHERE `email`='"+email+"' AND `password`='"+password+"'";
    con.query(sql, function (err, result) {
    if (err){
        console.log(err)
    }
    else{
    if( result.length == 1){
        res.send("user can be logged in")
    }    
    else{
        res.send("user not registered yet")
    }
    }
    });
   } catch (error) {
       console.log(error)
   }
});
 app.get(['/register'], function(req, res){
    res.render('registration')
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
    res.render('upload')
 });
 app.get(['/list'], function(req, res){
    res.render('dialogues-list')
 });
 app.get(['/view'], function(req, res){
    res.render('full-dialogue')
 });
 app.get('*', function(req, res) {
   res.render('404')
  });
app.listen(8080);