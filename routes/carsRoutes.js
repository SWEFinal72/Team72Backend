const express = require('express');
const router = express.Router()
const carsController = require('../Controllers/carsController.js');
const verifyJWT = require('../Middleware/verifyJWT.js');

router.use(verifyJWT);
router.route('/')

.get(carsController.getAllCars)

.post(carsController.createNewCar)

.patch(carsController.updateCar)

.delete(carsController.deleteCar)

module.exports = router;
