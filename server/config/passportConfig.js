const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var User = mongoose.model('User');

var count = 0;

passport.use(
    new localStrategy({ usernameField: 'username' },
        (username, password, done) => {
            console.log("username from UI is", username)
            User.findOne({ userName: username },
                (err, user) => {
                    console.log("USER TESTING=", user);
                    if (err){
                        return done(err);
                    // unknown user
                    }
                    else if (!user){
                        return done(null, false, { message: 'User id not registered' });
                    }
                        
                    // wrong password
                    else if (!user.verifyPassword(password)){
                        count += 1;
                        if(count === 3){
                            console.log("data in user is-->"+user.username)
                           User.updateOne({userName:username }, { $set: { status: true } })
                            return done(null, false, { message: 'User locked.' });
                            
                        }
                        return done(null, false, { message: 'Wrong password.' });
                    }
                        
                    // authentication succeeded
                    else {
                        return done(null, user);
                    }
                });
        })
);