//code to run is npm start dev



const User= require('../Model/User');
const Car= require('../Model/Car');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');



const createUser = asyncHandler(async (req, res) => {
    //this fetches the data from the frontend
    const { username, password, roles, location = 'none'} = req.body;

    //this is for validation of the data
    if(!username || !password || !Array.isArray(roles) || roles.length === 0){
        return res.status(400).json({
            message: 'Please enter all fields'
        });
    }

    //if you are using async await for a promise, you need to use exec() at the end of the promise
    const duplicate= await User.findOne({username}).lean().exec();
    if(duplicate){
        //409 is a conflict error
        return res.status(409).json({
            message: 'User already exists'
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    //create and store a new user
    //this may cause an issue if employee info is not provide, may have to create schema for each role
    const userObject = {username, password: hashedPassword, roles, employeeInfo: {location}};
    const user = await User.create(userObject);

    if(user){
        res.status(201).json({
            message: `User ${username} created successfully `,
            
        });
    }
    else{
        res.status(400).json({
            message: 'User creation failed'
        });
    }
});

const getUsers = asyncHandler(async (req, res) => {

    // .select is used to select the fields that we want to display
    //.lean will tell us to only return the data and not the whole object

    const users = await User.find().select('-password').lean();

  if(!users?.length){
   return res.status(400).json({
      message: 'No users found'
    });
  }
  res.json(users);
}
);

const deleteUser = asyncHandler(async (req, res) => {

    const {id} = req.body;
    if(!id){
        return res.status(400).json({
            message: 'User ID is required'
        });
    }

    const car = await Car.findOne({user: id}).lean().exec();
    if(car){
        return res.status(400).json({
            message: 'User has car reservation, cannot delete'
        });
    }
const user = await User.findByIdAndDelete(id).exec();
if(!user){
    return res.status(400).json({
        message: 'User not found'
    });

}
res.json({
    message: ` ${user.username }User deleted successfully `
});
});

const updateUser = asyncHandler(async (req, res) => {
   

const {id, username, roles,active,password,location } = req.body;

if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean' ) {
    return res.status(400).json({ message: 'All fields except password are required' });
        }   
    const user = await User.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const duplicate = await User.findOne({ username }).lean().exec();
    //allow updates to orginal user

    // underscore id is the id used by mongo
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (!user.employeeInfo) {
        user.employeeInfo.location = {location};
    }
    else {
        user.employeeInfo.location = location;
    }
  


    //if password is provided, hash it and update the user
    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }
    //save the updated user to the database
    const updatedUser = await user.save();

    res.json({
        message: `${updatedUser.username}updated successfully`,
    });
});

module.exports = {createUser, getUsers, deleteUser, updateUser};




