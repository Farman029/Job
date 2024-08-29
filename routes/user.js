const express = require("express");
const router=express.Router();
const User=require("../Model/userSchema.js")
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const Employee = require('../Model/userSchema');
  const jobPost=require("../Model/recruiterPostSchema.js")
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/home");
  }
router.get("/login",(req,res)=>{
    // res.send(" this is  an login page")
    res.render("user/userLogin",{isLoggedIn: req.isAuthenticated()})
  })
  
  router.get("/signup",(req,res)=>{
    // res.send(" this is  an login page")
    res.render("user/userSignup",{isLoggedIn: req.isAuthenticated()})
  })

 
  
  // Employee Signup
  router.post('/signup', wrapAsync( async (req, res) => {
    let {username,email,password}=req.body;
 let newUser= await  new User({
  username:username,
  email:email,
  
})
console.log(newUser);

const regiesteredEmployee=await Employee.register(newUser,password);
  
              passport.authenticate('employee-local')(req, res, () => {
                 res.redirect("/recruiter/allJobs")
              });
          
    
  }));
  
  // Employee Login
  router.post('/login', passport.authenticate('employee-local'), (req, res) => {
    //   res.status(200).send('Employee logged in successfully!');
    res.redirect("/recruiter/allJobs")
  });
  

// router.get("/applyjob",isLoggedIn,(req,res)=>{

//     // res.send(' apply Job here')
//     res.render("user/applyJob.ejs")
// })

// router.post("/applyjob", wrapAsync(async(req,res)=>{
   
//     if( isLoggedIn){
//  req.user._id;
//     console.log(id);
//         res.send("logged in")
//     }
// if( !isLoggedIn){
// res.redirect("/user/login")
//     }  
// }));


router.post("/applyjob/:postid", wrapAsync(async (req, res) => {
  
    
    if (req.isAuthenticated()) {
        const userId = req.user._id; // Get the logged-in user's ID
        console.log(userId);
        const employee=await Employee.findById(userId);
        // console.log(employee);
        // console.log(req.params);
        
        let postId=req.params.postid;
        // console.log(postId);
        let post=await jobPost.findById(postId);
        console.log(post);
      await  post. appliedCandidates.push(employee);
      await post.save();
console.log( " your post was saved");

res.redirect("/recruiter/alljobs");

    } else {
        res.redirect("/user/login")
    }
}));



  // Employee Logout
  router.get('/logout', (req, res) => {
      req.logout(() => {
          res.redirect("/home")
      });
  });
  
  module.exports = router;
  








 
  module.exports = router;