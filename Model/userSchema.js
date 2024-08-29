const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const EmployeeSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String },
    // Add any additional fields as required
});

EmployeeSchema.plugin(passportLocalMongoose);



const Employee= mongoose.model('Employee', EmployeeSchema);
module.exports =Employee
