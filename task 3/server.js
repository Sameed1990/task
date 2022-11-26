if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');


/*  ---------------------------------------------  */
/*                     MongoDB                     */
/*  ---------------------------------------------  */
const mongoose = require('mongoose');
mongoose.connect(process.env.db_url)
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => {
    console.log('Connected to MongoDB')
    // console.log('process.env.DATABASE_URL ' + process.env.DATABASE_URL)
})





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());
app.use(cookieParser());


const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

app.post('/checkout2', (req, res) => {
    console.log("00000000000");
    return res.json({ a: req.body })
})



app.listen(3000, () => {
    console.log("Servewr is running");
})