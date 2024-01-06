const express = require('express')
const app = express();
const mongoose = require('mongoose');
const PORT = 5000;
const {MONGOBD_URL} = require('./config')
const axios = require('axios');

mongoose.connect(MONGOBD_URL);
mongoose.connection.on('connected', () => {
    console.log("Database Connected");
});
mongoose.connection.on('error', (error) => {
    console.log("Error while connecting to database");
});
// Define a Mongoose model
const User = mongoose.model('User', {
    name: String,
    username: String,
    email: String,
  });
  
  // Route to fetch data from JSONPlaceholder API and store it in MongoDB
  app.get('/fetch-and-store', async (req, res) => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/users');
      const users = response.data;
  
      // Store users in MongoDB
      await User.insertMany(users);
  
      res.json({ message: 'Data fetched and stored successfully' });
    } catch (error) {
      console.error('Error fetching and storing data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.get('/get-users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users from MongoDB:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  // Route to get a user by ID from MongoDB
app.get('/get-user/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      console.error('Error fetching user from MongoDB:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


app.listen(PORT, () => {
    console.log("Server Started");
})

