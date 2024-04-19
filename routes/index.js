var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const { default: mongoose } = require('mongoose');
const passport = require('passport');
const upload = require('./multer'); // import the multer middleware setup

// let's add localStreategy as well
const localStreategy = require('passport-local');
passport.use(new localStreategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/login', (req, res)=>{
  res.render("login", {error: req.flash('error')}); // provinding err into the page in variable error
})

// profile route
router.get('/profile', isLoggedIn, async (req, res)=>{
  const user = await userModel
  .findOne({username: req.session.passport.user}) // req.session.passport.user contains username
  .populate("posts"); // to be able to show posts data
  // now pass this user to the profile page
  res.render("profile", {user: user});
})



// let's define the authentication logic using passport
router.post('/register', function(req, res){
  // let's provide userData
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });

  // now let's register the user with this userData along with a password
  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect('/profile');
    })
  })
});

// login route
router.post('/login', passport.authenticate("local", {
  successRedirect: '/profile',
  failureRedirect: '/login',
  // we also want that if login fails then we'd we able to show flash message so let's allow it
  failureFlash: true // only when we redirected to login cause of failure
}), function(req, res){
});

// logout route
router.get('/logout', (req, res, next)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
})

router.get('/feed', isLoggedIn ,async (req, res)=>{
  const user = await userModel.findOne({username: req.session.passport.user});


  res.render("feed", {user: user});
})

// isLoggedIn function
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  else return res.redirect('/login');
}

// handle file upload
router.post('/upload', isLoggedIn, upload.postUpload.single('file'), async (req, res) => { // we gotta put this route name as /upload cause we've passed action= "/upload" in the form.
  // upload.single('file') is a middleware, This is a multer function that specifies that this route expects a single file upload, and the parameter 'file' indicates the name of the field in the form that contains the file data. So, when a POST request is made to this route with a file attached to a field named 'file', multer will parse the incoming request and make the file data available in req.file for further processing in the route handler.

  // access the uploaded file details via res.file
  if(!req.file){
    return res.status(404).send("no file is uploaded");
  }
  // now we want to save this uploaded fie/dp as a post on profile, and we also need to make sure that it's postid should be known to user and this post also should be known to userid.
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    image: req.file.filename,
    imageText: req.body.fileCaption,
    user: user._id
  });

  await user.posts.push(post._id);
  user.save(); // have to save manually.
  res.redirect("/profile");
  // now let's add more code on index.js file(in /profile route) and in profil.ejs file to be able to show posts
});

// create another router where you'll perform edit of profile 
router.post('/edit', isLoggedIn, upload.dpUpload.single('dp'), async (req, res) => {
  const tagline = req.body.tagline;
  const description = req.body.description;
  
  // Assuming userModel is a Mongoose model
  const user = await userModel.findOne({ username: req.session.passport.user });

  // Update the user's tagline and description
  user.tagline = tagline;
  user.description = description;

  // If a new profile picture is uploaded, update the user's dp
  if (req.file) {
      user.dp = req.file.filename; // Assuming you are storing filenames in the user document
  }

  await user.save();

  // Redirect to the profile page with updated data
  res.redirect("/profile");
});



module.exports = router;
