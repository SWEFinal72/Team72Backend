const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  roles:[{
    type: String,
    enum: ['user', 'admin', 'employee'],
    default: 'user'
  }],
  active:{
    type: Boolean,
    default: true
  },

  employeeInfo:{
    location: String,

  } 
  
  
  
});



module.exports = mongoose.model('User', userSchema);