const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { dbName: 'Recipe' })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

// Models
require('./Category');
require('./Recipe');


