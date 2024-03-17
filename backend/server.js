// server.js

// first we import our dependencies…
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// and create our instances
const app = express();
const router = express.Router();

// const userRouter = require('./routes/user.route.js');
const authRouter = require('./routes/auth.route.js');


// set our port to either a predetermined port number if you have set it up, or 3001
const API_PORT = process.env.API_PORT || 3001;
// now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:3010/test");
var db = mongoose.connection;
db.on('error', () => console.error('Erreur de connexion'));

// now we can set the route path & initialize the API
router.get('/', (req, res) => {
  res.json({ message: 'full stack is too hard ' });
});

router.get('/test', (req, res) => {
  testdb.find().then(users => {
    res.json({'All users': users});
    console.log(users);
  }).catch(err => {
    console.error('Error fetching users:', err);
  });
});



app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));
  
// Use our router configuration when we call /api
app.use('/api', router);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);


app.use((err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({ 
    success: false,
    statusCode,
    message, 
  });
});