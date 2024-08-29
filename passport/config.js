const passport = require('passport');
const Recruiter = require('../Model/recruiterSchema');
const Employee = require('../Model/userSchema');

// Setting up Passport to use different strategies for Recruiter and Employee
passport.use('recruiter-local', Recruiter.createStrategy());
passport.use('employee-local', Employee.createStrategy());

passport.serializeUser((user, done) => {
    done(null, { id: user.id, type: user.constructor.modelName });
});

passport.deserializeUser(async (obj, done) => {
    try {
        const Model = obj.type === 'Recruiter' ? Recruiter : Employee;
        const user = await Model.findById(obj.id).exec();
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});
