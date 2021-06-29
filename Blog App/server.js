const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const blogRouter = require('./routes/blogs');
const Blog = require('./models/Blog');
const app = express();
require("./db/conn");
const port = process.env.PORT || 3000
//set template engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
//route for the index
app.get('/', async (request, response) => {
  let blogs = await Blog.find().sort({ timeCreated: 'desc' });

  response.render('index', { blogs: blogs });
});

app.use(express.static('public'));
app.use('/blogs', blogRouter);

//listen port
app.listen(port);
