
if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}


const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose=require("mongoose");


const ExpressError = require("./utils/ExpressError.js");
const session =require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");
var cookieParser = require('cookie-parser');


const recruiterRouter=require('./routes/recruiter.js')
const userRouter=require("./routes/user.js");



const Recruiter = require('./Model/recruiterSchema.js');
const Employee = require("./Model/userSchema");

const {storage}=require("./cloudConfig");
const multer  = require('multer')
const upload = multer({ storage })


const dbUrl=process.env.ATLASDB_URL;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Include the Passport configuration
require('./passport/config.js');

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600, 
});

store.on("error",()=>{
  console.log("ERROR in MONGO STORE ",err);
  
})

const sessionOptions={
 store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7 * 24 * 60 * 60 * 1000,
  maxAge:7* 24 * 60 * 60 * 1000,
  httpOnly:true,
  },
};



// const sessionOptions={secret:"mysupersecretstring",
//   resave:false,
//   saveUninitialized:false,
// }

app.use(session(sessionOptions));
app.use(flash());
 
app.use(passport.initialize());
app.use(passport.session()); 


app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

app.use(cookieParser());




  
  app.get("/", (req, res) => {
   res.redirect("/home")
  });
  
app.get("/fail",(req,res)=>{
    res.send(" login failed")
  })

  app.get("/loginSuccessfull",(req,res)=>{
    res.send(" login successfully ")
  })
  app.get("/home",(req,res)=>{
    // res.send(" Welcome to Home Page");
    res.render("index.ejs", {
      isLoggedIn: req.isAuthenticated(),
  })
  })
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect("/home")
    });
});

// Middleware to make `isLoggedIn` available in all EJS templates
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.isAuthenticated();
  next();
});

app.use("/recruiter",recruiterRouter)
app.use("/user",userRouter)

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).render('error', { isLoggedIn: req.isAuthenticated() });
// });



app.all("*",(req,res,next)=>{
  next ( new ExpressError(404,"page not found"));
})
app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong!"}=err;

//  res.status(statusCode).send(message);
res.status(statusCode ).render("error.ejs",{err,isLoggedIn: req.isAuthenticated()});
})


main().then(()=>{
  console.log("connected to DB");
}).catch((error)=>{
  console.log(error);
})


async function main(){
  await  mongoose.connect(dbUrl);
}


app.listen(8080, () => {
  console.log("server is listening on port 8080");
});

