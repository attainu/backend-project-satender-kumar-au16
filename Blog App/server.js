const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const blogRouter = require('./routes/blogs');
const Blog = require('./models/Blog');
const app = express();
require('dotenv').config();

mongoose.connect(process.env.DB_URI, {useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,});
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("connected"));

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
app.listen(5000);