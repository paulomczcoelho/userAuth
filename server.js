if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { ObjectId } = require('mongodb');
const { MongoClient } = require('mongodb');
const User = require('./src/models/user.model');
const initializePassport = require('./src/config/passport-config');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const { mongoConnect } = require('./src/db/db');
const mongoose = require('mongoose');
const { deleteById } = require('./src/models/user.model');
BSON = require('mongodb').BSON

initializePassport(
  passport,
  async (email) => {
    const db = await mongoConnect();
    const users = await db.collection('users').find({ email }).toArray();
    return users[0];
  },
  async (id) => {
    const db = await mongoConnect();
    const users = await db.collection('users').find({ id }).toArray();
    return users[0];
  }
);

app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'src', 'public')));

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
}));

app.post('/register', checkNotAuthenticated, async (req, res) => {

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = {
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      level: '',
      status: '',
    };

    const db = await mongoConnect();
    await db.collection('users').insertOne(user);
    console.log(user);
    res.redirect('/login');
  } catch (e) {
    console.log(e);
    res.redirect('/register');
  }
});

app.get('/', checkAuthenticated, (req, res) => {
  const name = req.user.name;
  res.render('index.ejs', { name: name });
  console.log(name);
});

app.get('/home-page', checkAuthenticated, (req, res) => {
  const name = req.user.name;
  res.render('index.ejs', { name: name });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});

// ...

app.get('/listUser', checkAuthenticated, async (req, res) => {
  const db = await mongoConnect();
  const users = await db.collection('users').find().toArray();
  const name = req.user.name;
  res.render('listUser.ejs', { users: users, name: name, id: req.user._id });
});

// ...

app.delete('/deleteUser/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log('User ID:', userId);
  try {
    const deleted = await User.deleteById(userId);
    if (deleted) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.log('Error deleting user:', error);
    res.sendStatus(500);
  }
});


// ...

// ...

// Function to validate if a string is a valid ObjectId
function isValidObjectId(id) {
  const ObjectId = require('mongodb').ObjectId;
  return ObjectId.isValid(id);
}




app.delete('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.redirect('/profile');
    }
    res.clearCookie(process.env.SESS_NAME);
    res.redirect('/login');
  });
});


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

app.listen(3000);
