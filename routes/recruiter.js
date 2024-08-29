const express = require("express");
const ExpressError=require("../utils/ExpressError.js")
const jobPostSchema=require("../Model/recruiterPostSchema.js");
const wrapAsync = require("../utils/wrapAsync");
const router=express.Router();
const passport=require("passport");

const Employee = require('../Model/userSchema');
const Recruiter=require("../Model/recruiterSchema.js");
const jobPost = require("../Model/recruiterPostSchema.js");



// Recruiter Signup
router.post('/signup',wrapAsync( async (req, res) => {

let {username,email,password,company}=req.body;
let newRecruiter= Recruiter({
username:username,
email:email,
password:password,
company:company,
})

     
      await Recruiter.register(newRecruiter, password);
      passport.authenticate('recruiter-local')(req, res, () => {
          // res.status(200).send('Recruiter registered successfully!');
          res.redirect("/recruiter/profile");
      });

}));

// Recruiter Login
router.post('/login', passport.authenticate('recruiter-local'), (req, res) => {
  // res.status(200).send('Recruiter logged in successfully!');
  res.redirect("/recruiter/profile");
});










router.get("/a", (req, res) => {
    res.send("Hi, I am root");
  });
router.get("/login",(req,res)=>{
    // res.send(" this is  an login page")
    res.render("recruiter/RecruiterLogin.ejs",{isLoggedIn: req.isAuthenticated(),})
  })


  router.get("/signup",(req,res)=>{
    // res.send(" this is  an login page")
    res.render("recruiter/RecruiterSignup.ejs",{isLoggedIn: req.isAuthenticated()})
  })

router.get("/postjob",isLoggedIn,async(req,res)=>{
  // res.send(" post your job here")
  // let recruiter=await RecruiterSchema.findOne()
  res.render("recruiter/postJob",{isLoggedIn: req.isAuthenticated()});
})





 router.post("/postjob",isLoggedIn, wrapAsync(async(req,res)=>{
  let {title,company,joblocation,basesalary}=req.body;
  let id=req.user._id;

  let recruiter=await Recruiter.findById(id);

let newJobPost=new jobPostSchema({
  title: title,
 company:company,
  joblocation:joblocation,
  basesalary:basesalary,
  recruiter:req.user._id,
})
// console.log(newJobPost);

recruiter.posts.push(newJobPost);
await newJobPost.save();
await recruiter.save();
  res.redirect("/recruiter/profile")

 
  
 }))

router.get("/alljobs",wrapAsync(async(req,res)=>{

const alljobs=await jobPostSchema.find({});
// console.log(alljobs);

res.render("recruiter/allJobs",{alljobs,isLoggedIn: req.isAuthenticated()})
// res.send(" all jobs printed");

})
)


router.get("/profile",isLoggedIn,  wrapAsync(async(req,res)=>{
  let id=req.user._id;
  console.log(id);
  
  const user=await Recruiter
  .findById(id)
  .populate("posts");

  console.log(user);
  
  res.render("recruiter/profile.ejs",{
    user:user,
    isLoggedIn: req.isAuthenticated(),
      });


  })

  )
  


router.get("/candidates/:postid",isLoggedIn, wrapAsync( async(req,res)=>{
  let id=req.user._id;
  console.log(id);
  const  recruiter=await Recruiter
  .findById(id)


let postId=req.params.postid;
let post= await jobPost.findById(postId).populate("appliedCandidates");
console.log(post.appliedCandidates);
// res.send(" you are on applied candidates")

  res.render("recruiter/candidates.ejs",{
    recruiter:recruiter,
    post:post,
    isLoggedIn: req.isAuthenticated(),
  })
})
);

 function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/home");
}
  module.exports = router;