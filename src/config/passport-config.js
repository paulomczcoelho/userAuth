const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const passport = require('passport');
const { mongoConnect } = require('../db/db');
const User = require('../models/user.model');

async function initialize(passport, getUsersByEmail, getUsersById) {
  const authenticateUsers = async (email, password, done) => {
    const user = await getUsersByEmail(email);
    if (user == null) {
      return done(null, false, { message: 'No user found with that email or wrong password' });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'No user found with that email or wrong password' });
      }
    } catch (e) {
      console.log(e);
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUsers));
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const db = await mongoConnect();
    const users = await db.collection('users').find({ id }).toArray();
    done(null, users[0]);
  });
}

module.exports = initialize;
