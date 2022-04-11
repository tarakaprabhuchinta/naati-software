const express = require('express');
const app = express();
const mysql = require('mysql');
const parser = require('body-parser');
const session = require('express-session')
const fs = require('fs');
const fileUpload = require('express-fileupload');
var MySQLStore = require('express-mysql-session')(session);
var parse = require('url-parse')
var files;
var options = {
	host: 'localhost',
	port: 3306,
	user: 'wwwnaati_tarak',
	password: 'Ta@234824',
	database: 'wwwnaati_database'
};
try{
//mysql connection
var con = mysql.createConnection(options);
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
  var sessionStore = ({}, connection);
}
catch(err){
    console.log("cannot connect to database"+err)
}
try {
    files = fs.readdirSync(__dirname+'/materials/docs/');
    files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
    //replace .html in array
    files = files.map(x => x.replace('.html',''));
} catch (error) {
    console.log(error)
}
app.set('view engine', 'ejs');
app.use(parser.urlencoded({ extended: true }));
app.use(session({
    secret: 'scaredy-cat',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    // set cookie age for 6 hours.
    cookie: { maxAge: 3600000*6}
  }));
  app.use(fileUpload({
      //limits upload size by 4mb
    limits: { fileSize: 1048576*4 },
  }));  
  app.use(express.static('materials/audio'))
app.get(['/','/login'], function(req, res){
    if(!req.session.login){
        res.render('login')
    }
    else{ 
        res.render('dialogues-list',{data: files})
    }
});
app.post('/login-user', function(req, res){
   email = req.body.email
   password = req.body.password
   try {
    var sql = "SELECT * FROM `wwwnaati_database`.`users` WHERE `email`='"+email+"' AND `password`='"+password+"' AND `active`='"+1+"'";
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
        res.render('dialogues-list',{data: files})
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
        var sql = "INSERT INTO `wwwnaati_database`.`users` (`email`, `password`) VALUES ('"+email+"','"+password+"')";
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
 app.post(['/upload-files'], function(req, res){
    if(!req.session.login){
        res.render('login')
    }
    else{ 
        let docFile;
        let audioFile;
        let uploadPath;
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
          }
         // The name of the input field is used to retrieve the uploaded file
         docFile = req.files.document;
         uploadPath = __dirname + '/materials/docs/' + req.body.dialogue+'.html';

          // Use the mv() method to place the file somewhere on your server
        docFile.mv(uploadPath, function(err) {
            if (err)
              return res.status(500).send(err);
              });
        // The name of the input field is used to retrieve the uploaded file
        audioFile = req.files.audio;
        uploadPath = __dirname + '/materials/audio/' + req.body.dialogue+'.mp3';

         // Use the mv() method to place the file somewhere on your server
        audioFile.mv(uploadPath, function(err) {
            if (err)
              return res.status(500).send(err);
          });        
        res.render('upload-success')
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
        res.render('dialogues-list',{data: files})
    }
 });
 app.get(['/dialogue/*'], function(req, res){
    if(!req.session.login){
        res.render('login')
    }
    else{
    var url = parse(req.originalUrl) 
    var pathname = url.pathname.replace('/dialogue/','')     
    var client_audio = files[pathname-1]+'.mp3';
    var client_doc = __dirname+'/materials/docs/'+files[pathname-1]+'.html';
    try {
        fileData = fs.readFileSync(client_doc);
        res.render('full-dialogue', {audioData: 'https://'+req.get('host')+'/'+client_audio, fileData})
    } catch (error) {
        console.log(error)
    }   
     }
 });
 app.get('*', function(req, res) {
   res.render('404')
  });
app.listen();
