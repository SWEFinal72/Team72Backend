const express=require('express');
const router=express.Router();
const userController=require('../Controllers/userController.js');
const verifyJWT = require('../Middleware/verifyJWT.js');

router.use(verifyJWT);


router.route('/')

.get(userController.getUsers)

.post(userController.createUser)

.patch(userController.updateUser)


.delete(userController.deleteUser)



module.exports=router;