const express = require("express");
const router = express.Router();
const helper = require("../helpers/helper");
const passport = require("passport");
const filename = "./data/users.json";
const bcrypt = require("bcrypt");
let users = require("../data/users.json");

// Register New User:
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const id = { id: helper.getNewId(users) };
  try {
    const user = await helper.userExists(username);
    if (user) {
      console.log("User already exists!");
      return res.redirect("login");
    }
    // Hash password before storing in local DB:
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password,salt);

    const newUser = { ...id, username, password: hashedPassword };

    // Store new user in local DB
    await users.push(newUser);
    await helper.writeJSONFile(filename, users);

    res.redirect("login");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Log In User:
router.post("/login", passport.authenticate("local", { failureRedirect: "login" }) ,(req, res) => {
  console.log('inside LOGIN POST method !!');
  res.redirect("/");
});

// Log out user:
// router.get("/logout", (req, res, next) => {
//   console.log('executing logout');
//   req.logout((err)=>{
//     if(err) {
//         console.log('inside logout error..');
//         return next(err);
//     }
//     console.log('logout err cleared...');
//     return res.redirect("/");
//   });
//   //res.redirect("/login");
// });


router.get("/logout", (req, res) => {
  console.log('executing logout');
  req.logout();
  res.redirect("/");
});


//use URL localhost:4001/users/register
router.get("/register", (req, res) => {
  res.render("register");
});

//use URL localhost:4001/users/login
router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
