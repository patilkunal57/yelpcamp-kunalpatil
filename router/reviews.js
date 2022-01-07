const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/camground');
const Review = require('../models/review');
const { campgroundSchema, reviewSchema} = require('../views/schema');
const ExpressError = require('../utils/ExpressError');

const router = express.Router({mergeParams : true});





const validatereview = (req,res,next) =>{
    const {error }= reviewSchema.validate(req.body);
    
    if(error){
        const msg =error.details.map(el => el.message).join(',');
        throw new ExpressError( msg ,400)
    }else
    {
        next();
    }
};




router.post('/', validatereview ,catchAsync(async( req,res) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))




router.delete ('/:reviewId', catchAsync(async( req, res) =>{
    const {id, reviewId} = req.params;
   await Campground.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});
   await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${ id }`);
}))


module.exports = router;