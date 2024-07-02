const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/PIMSdb', {
  
})
    .then(() => console.log('You have been connected to PIMS Database'))
    .catch(err => console.log('Something went wrong when connecting to the database ', err));
    