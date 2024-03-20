const express=require('express');
const router=express.Router();
const userController=require('../Controllers/userController.js');




router.route('/')

.get(userController.getUsers)

.post(userController.createUser)

.patch(userController.updateUser)


.delete(userController.deleteUser)



module.exports=router;