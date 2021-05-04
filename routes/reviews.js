const express = require('express')
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../model/review')
const { reviewSchema } = require('../schema')
const Campground = require('../model/campground')
const { isLoggedIn } = require('../middleware')

const validateReview = (req, res, next) => {
    console.log(req.body.review)
    const { error } = reviewSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

router.post('/', isLoggedIn,validateReview ,catchAsync(async (req, res, next) =>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campground/${campground._id}`)
}))

router.delete('/:reviewId/', isLoggedIn, catchAsync( async(req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId } } )
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted review!')
    res.redirect(`/campground/${id}`);
}))

module.exports = router;