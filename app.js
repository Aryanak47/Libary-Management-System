require('dotenv').config();
const express = require('express');

const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
const AppError = require('./utils/AppError');
const errorController = require('./controllers/errorController');
const bookRouter = require('./routers/bookRouter');
const userRouter = require('./routers/userRouter');
const viewRouter = require('./routers/viewRouter');
const reserveRouter = require('./routers/reserveRouter');

app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);
// Middle wears
app.use(express.static(`${__dirname}/public`));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Connecting database

const connection = process.env.DB.replace('<password>', process.env.DB_PW);
mongoose
  .connect(connection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to database !');
  })
  .catch((er) => {
    console.log('error connecting to database !', er);
  });

// routers
app.use('/', viewRouter);
app.use('/api/books', bookRouter);
app.use('/api/users', userRouter);
app.use('/api/reserve', reserveRouter);

// 4) handling other invalid routes
app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server`, '404'));
});

// error handler middlewear
app.use(errorController);

app.listen(8000, () => {
  console.log('listening to port 8000');
});
