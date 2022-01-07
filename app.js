const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodoverride = require('method-override');
const Joi = require('joi');
const Campground = require('./models/camground');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema} = require('./views/schema');
const catchAsync = require('./utils/catchAsync');
const { writer } = require('repl');
const ExpressError = require('./utils/ExpressError');
const { string } = require('joi');
const review = require('./models/review');
const campgrounds = require('./router/campgrounds');
const reviews = require('./router/reviews')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();





app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))


app.use(express.urlencoded({ extended: true }))
app.use(methodoverride('_method'))


app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/review', reviews)



app.get('/',(req,res) =>{
   res.render('home')
   
})




app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})



app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err })
})
app.listen(3000,() =>
{
    console.log('serving on port 3000')
})
