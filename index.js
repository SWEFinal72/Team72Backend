require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const cookieParser = require('cookie-parser');
const {errorHandler} = require('./Middleware/errorHandler');
const {logger,logEvents} = require('./Middleware/logger');
const corsOptions = require('./config/corsOptions');
const path = require('path');
const cors = require('cors');

//const Car = require('./Model/Car');
const PORT = process.env.PORT || 3000;

connectDB();

app.use(logger);

// Handle urlencoded data (built-in middleware)
//app.use(express.urlencoded({ extended: false }));

// Use built-in middleware for handling JSON
app.use(express.json());

app.use(cookieParser());
//sets up cors to only allow requests from the allowedOrigins array
app.use(cors(corsOptions));

// Serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// Get all cars
app.use("/", require("./routes/root.js")); 
app.use("/users", require("./routes/userRoutes.js"));
// this is where the url for cars goes


//Handle 404
app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "public", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ error: "404 Not Found" });
	} else {
		res.type("txt").send("404 Not Found");
	}
});

app.use(errorHandler);

// Connect to MongoDB and start server
mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB.");
	app.listen(PORT, () => console.log(`Server running on port ${PORT}.`));
});

mongoose.connection.on("error", (err) => {
  console.error(err);
  logEvents(`${err.name}: ${err.message}\t${err.syscall}\t${err.hostname}\t${err.code}`, 'mongoerrLog.log')

});

