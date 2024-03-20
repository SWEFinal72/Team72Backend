const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);



const carSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  carInfo:[{
    "car-brand": String,
    "model": String,
    "miles": Number,                                      
    "location": String,
    "cost-mile": Number,
    "cost-day": Number,
    "pickup": Date
  }],
  rented:{
    type: Boolean,
    default: false
  }
  
  
}, 
  {
    timestamps: true
  
  }
);

carSchema.plugin(AutoIncrement, {inc_field: 'carID'});
 



module.exports =  mongoose.model('Car', carSchema);;
                                             


