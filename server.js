const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = process.env.PORT || 3001;  // Updated port to 3001 to match form.js

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const mongoURI = 'mongodb://localhost:27017/cafewhisk';
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect()
  .then(() => {
    console.log('Connected to MongoDB');

    app.post('/api/submitReservation', async (req, res) => {  // Updated endpoint to /api/submitReservation
      try {
        const { name, email, phoneNumber, table, numberOfPeople, houseNumber, streetName, area, city, state, pincode, cardNumber } = req.body;
        const db = client.db('cafewisk');
        const reservationsCollection = db.collection('reservations');  // Updated collection name to reservations

        await reservationsCollection.insertOne({ 
          name, 
          email, 
          phoneNumber, 
          table, 
          numberOfPeople, 
          houseNumber, 
          streetName, 
          area, 
          city, 
          state, 
          pincode, 
          cardNumber 
        });

        res.status(201).json({ message: 'Reservation submitted successfully!' });
      } catch (error) {
        console.error('Error during reservation:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    app.get('/api/hello', (req, res) => {
      res.json({ message: 'Hello, world!' });
    });

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });