var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy
    //Other strategies go here
;
 
var verifyHandler = function(token, tokenSecret, profile, done) {
  process.nextTick(function() {
 
    User.findOne({fbid: profile.id}, function(err, user) {
      if (user) {
        return done(null, user);
      } else {
 
        var data = {
          provider: profile.provider,
          fbid: profile.id,
          name: profile.displayName
        };
 
        if (profile.emails && profile.emails[0] && profile.emails[0].value) {
          data.email = profile.emails[0].value;
        }
        if (profile.name && profile.name.givenName) {
          data.first_name = profile.name.givenName;
        }
        if (profile.name && profile.name.familyName) {
          data.last_name = profile.name.familyName;
        }
 
        User.create(data, function(err, user) {
          return done(err, user);
        });
      }
    });
  });
};
 
passport.serializeUser(function(user, done) {
  done(null, user.fbid);
});
 
passport.deserializeUser(function(fbid, done) {
  User.findOne({fbid: fbid}, function(err, user) {
    done(err, user);
  });
});
 
module.exports.http = {
 
  customMiddleware: function(app) {
 
    passport.use(new FacebookStrategy({
      clientID: "1867409733532643", // Use your Facebook App Id
      clientSecret: "cd80dd68088c75be5d5b4a545ca2f0e2", // Use your Facebook App Secret
      callbackURL: "http://localhost:1337/auth/facebook/callback"
    }, verifyHandler));
 
    app.use(passport.initialize());
    app.use(passport.session());
  }
};