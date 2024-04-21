const Car = require('../Model/Car');
// add in User just in case its needed
const User= require('../Model/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');


// description: get all cars
// route: GET /cars
// acess: ?
const getAllCars = asyncHandler(async (req, res) => {
    // .lean is used in this case to only return the data and not the whole object with extra unessessary data
    const cars = await Car.find().lean();
    if(!cars?.length){
        return res.status(400).json({ message: 'No cars found'});
    }
    res.json(cars);
})


// description: Create a new car
// route: POST /cars
// acess: ?
// createNewCar function checked in Postman
const createNewCar = asyncHandler(async (req, res) => {
    const {user, carInfo, rented } = req.body;
    //Confirm data is present
    if (!carInfo.length){
        return res.status(400).json({ message: 'Car information is required OR Fields are required'});
    }
    
    // For sake of being able to confirm car is already in database and avoid confusion there will be a check for duplicate cars
    // If car-brand and model of car combo are the same then it is considered a duplicate
    const duplicate = await Car.findOne({"carInfo.car-brand": carInfo[0]["car-brand"], "carInfo.model": carInfo[0]["model"]}).lean().exec();

    if (duplicate){
        return res.status(409).json({ message: 'Duplicate car found'});
    }

    const carObject = {user, carInfo, rented};

    //Create and store new car

    const car = await Car.create(carObject);

    if (car){
        res.status(201).json({ message: 'New Car created successfully'});
    } else {
        res.status(400).json({ message: 'Invalid car data received'});
    }

})


/// ***LEFT OFF HERE CHECKING updateCar in Postman!!!!

// description: Update a car
// route: PATCH /cars
// acess: ?
const updateCar = asyncHandler(async (req, res) => {
    const {id, user, carInfo, rented} = req.body;
    
    // Confim data is present
    // if (!carID || carInfo[0]["car-brand"] || carInfo[0]["model"] ||  carInfo[0]["miles"]   || carInfo[0]["location"]  ||
    // carInfo[0]["cost-mile"] || carInfo[0]["cost-day"]|| carInfo[0]["pickup"] || rented){

    //     return res.status(400).json({ message: 'All fields are required'});
    // }

    // if (!carID || !carInfo || !rented){
    //     return res.status(400).json({ message: 'All fields are required'});
    // }

    // canging carID to id

    const car = await Car.findById(id).lean().exec();

    if (!car){
        return res.status(400).json({ message: 'Car not found'});
    }

    // check for duplicate
    const duplicate = await Car.findOne({"carInfo.car-brand": carInfo["car-brand"], "carInfo.model": carInfo["model"]}).lean().exec();
    // Allow updates to the orginial car
    if (duplicate && duplicate?._id.toString() !== id){
        return res.status(409).json({ message: 'Duplicate car'});
    }

    car.user = user;
    car.carInfo = carInfo;
    car.rented = rented;

    const updatedCar = await car.save()

    res.json({message: '${updatedCar.carInfo} updated successfully'});


})

// description: Delete a car
// route: DELETE /cars
// acess: ?
const deleteCar = asyncHandler(async (req, res) => {
// changingin instances of carID to id

    const {id} = req.body;

    if (!id){
        return res.status(400).json({ message: 'Car ID is required'});
    }

    // const userReservationOnCar = await Car.findOne(user).lean().exec();

    // if (userReservationOnCar){
    //     return res.status(400).json({ message: 'Car is currently under a reservation, cannot delete'});
    // }

    const car = await Car.findByIdAndDelete(id).exec();

    if(!car){
        return res.status(400).json({ message: 'Car not found'});
    }

    res.json({message: '${car.carInfo} deleted successfully'});

})

module.exports = {
    getAllCars,
    createNewCar,
    updateCar,
    deleteCar
}