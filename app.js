const express = require('express');
const dotenv = require("dotenv")
dotenv.config()
require("./db/mongoose")
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/EventRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());


// Routes
app.use('/auth', authRoutes);  // Signup & Login
app.use('/events', eventRoutes);  // Protected events

app.get('/', (req, res) => {
  res.send('Event System API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});