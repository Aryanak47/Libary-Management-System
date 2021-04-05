require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bookRouter = require('./routers/bookRouter')
const mongoose = require('mongoose');



// Middle wears
app.use(express.static(`${__dirname}/public`))
app.use(cors())
app.use(express.json());// error solved with this middlewear




// Connecting database

let connection = process.env.DB.replace('<password>',process.env.DB_PW);
mongoose.connect(connection, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("connected to database !");
})
.catch(er => {
    console.log('error connecting to database !',er);
})


// routers
app.use('/api/books',bookRouter)

// 4) handling other invalid routes
app.all('*', (req, res) => {
    res.status(404).json({
      status: 'fail',
      message: `can't find ${req.originalUrl} on this server`
    });
  });
  

app.listen(3000,() => {
    console.log('listening to port 3000');
})
