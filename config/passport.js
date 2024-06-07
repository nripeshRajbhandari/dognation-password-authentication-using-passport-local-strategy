const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const helper = require("../helpers/helper");

// Set up the Passport strategy:
passport.use(new LocalStrategy( function(username, password, done) {
    helper.findByUsername(username, async (err,user)=>{
        if(err) return done(err);

        if(!user) return done(null,false);

        const matchedPassword = await bcrypt.compare(password, user.password);

        console.log(`matched password:${matchedPassword}`); //check from here now

        //if(user.password != password) return done(null,false);
        if(!matchedPassword) return done(null,false);

        return done(null, user);  
      
    }); 
  
  })
  );  

// Serialize a user
passport.serializeUser((user, done) =>{
    console.log(`inside serializeUser and the userId is:${user.id}`);
    done(null, user.id);
});

// Deserialize a user
// passport.deserializeUser(function(id,done){
//     helper.findById(id, (err,done) => {
//         if(err) return done(err);
//         done(null, user);
//     });
// });

passport.deserializeUser((id, done) => {
    console.log(`id is ${id}`);
    helper.findById(id, function (err, user) {
      console.log(`inside deserializeUser before if condition and the user is:${user}`);  
      if (err) {
        return done(err);
      }
      console.log(`inside deserializeUser and the user is:${user}`);
      done(null, user);
    });
});