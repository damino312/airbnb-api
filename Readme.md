#Airbnb API

About the application:
  Airbnb is an online platform that allows people to rent out their properties or spare rooms to guests. It serves as a marketplace that connects hosts who have accommodations to offer with travelers seeking a place to stay. Users can browse through a wide range of listings, including apartments, houses, vacation rentals, and unique accommodations around the world. Airbnb provides a platform for hosts to showcase their properties and manage bookings, while travelers can search for accommodations based on location, price, amenities, and other preferences. It has become popular for offering a variety of lodging options beyond traditional hotels, making it possible for travelers to experience more local and unique stays during their trips.

Front-end https://github.com/damino312/aribnb-front

The tools: Node.js, Express.js, MongoDB, Mongoose, jsonwebtoken, Multer, bcryptjs,
 cookie-parser, cors, dotenv, image-downloader, multer, nodemon, serve-static

This is the backend repository for the Airbnb project. It provides the server-side functionality and APIs for the Airbnb application.

Prerequisites
Before getting started, ensure that you have the following installed:

Getting Started
To run the project locally, follow the steps below:

1 Clone the repository:
Copy code
git clone https://github.com/damino312/airbnb-api.git
2 Navigate to the project directory:
Copy code
cd airbnb-api
3 Install the dependencies:
Copy code
npm install

Configure the project:
1 Update the necessary configuration values in the .env file.
Example of .env:
MONGO_URL = mongodb://127.0.0.1:27017/airbnb
jwtSecret = sdafadfgjiaFDJA/;dfAJNKD;Nask

2 Specify in the corsMiddleWare.js a link to your front-end in "origin".

2 Start the server:
nodemon index.js
