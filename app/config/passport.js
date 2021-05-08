const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const Role = require('../models/Role')
const bcrypt = require('bcrypt')

// LOGIN GOOGLE
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// GET CONFIG 
var configAuth = require('./auth');


function init(passport) {

    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        // Login
        // check if email exists
        const user = await User.findOne({ email: email }).populate('roleId')
        console.log(user, 'passport');
        if (!user) {
            return done(null, false, { message: 'No user with this email' })
        }

        bcrypt.compare(password, user.password).then(match => {
            if (match) {
                return done(null, user, { message: 'Logged in succesfully' })
            }
            return done(null, false, { message: 'Wrong username or password' })
        }).catch(err => {
            return done(null, false, { message: 'Something went wrong' })
        })
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await User.find({ _id: id }).populate('roleId').limit(1);
        done(null, user[0])
    })

    // LOGIN WITH GOOGLE

    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
    },
        function (token, refreshToken, profile, done) {
            process.nextTick(function () {
                // // tìm trong db xem có user nào đã sử dụng google id này chưa

                User.findOne({ 'googleId': profile.id }, async function (err, user) {
                    if (err) return done(err);
                    if (user) {
                        // if a user is found, log them in
                        return done(null, user);
                    } else {

                        // if the user isnt in our database, create a new user
                        var newUser = new User();
                        // set all of the relevant information

                        // newUser.google.id = profile.id;
                        // newUser.google.token = token;
                        // newUser.google.name = profile.displayName;
                        // newUser.google.email = profile.emails[0].value; // pull the first email

                        newUser.googleId = profile.id;
                        newUser.googleToken = token;
                        newUser.fullname = profile.displayName;
                        newUser.avatar = profile.photos[0].value;
                        newUser.password = await bcrypt.hash("123456", 10);
                        newUser.email = profile.emails[0].value; // pull the first email
                        const roleStudent = await Role.findOne({ name: 'student' });
                        newUser.roleId = roleStudent._id;
                        // save the user
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));

}

module.exports = init