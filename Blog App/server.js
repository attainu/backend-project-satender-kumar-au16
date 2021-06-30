const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const blogRouter = require('./routes/blogs');
const passport=  require("passport"),
LocalStrategy =  require("passport-local"),
passportLocalMongoose =  require("passport-local-mongoose"),
Blog = require('./models/Blog');
const User = require("./models/user");
require("./db/conn");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000

app.use(require("express-session")({
  secret:"Any normal Word",
      resave: false,          
      saveUninitialized:false    
  }));

passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));


//set template engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());
//route for the index
app.get('/', async (request, response) => {
    
    response.render('home')
});
 
app.get('/index', async (request, response) => {
  let blogs = await Blog.find().sort({ timeCreated: 'desc' });
  
  response.render('index', { blogs: blogs });
  
});

app.get('/login', async (request, response) => {
    
  response.render('login')
});

app.post("/login",passport.authenticate("local",{
  successRedirect:"/index",
  failureRedirect:"/login"
}),function (req, res){
});

app.get('/register', async (request, response) => {
    
  response.render('register')
});

app.post("/register",(req,res)=>{
    
  User.register(new User({username: req.body.username,phone:req.body.phone,telephone: req.body.telephone}),req.body.password,function(err,user){
      if(err){
          console.log(err);
          res.render("register");
      }
  passport.authenticate("local")(req,res,function(){
      res.redirect("/login");
  })    
  })
})
app.get("/logout",(req,res)=>{
  req.logout();
  res.redirect("/");
});
function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
      return next();
  }
  res.redirect("/login");
}





app.use(express.static('public'));
app.use('/blogs', blogRouter);

//listen port
app.listen(port);
