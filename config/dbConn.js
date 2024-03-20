const mongoose = require('mongoose');


// change the database URI to your own 
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Database connected')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB;
