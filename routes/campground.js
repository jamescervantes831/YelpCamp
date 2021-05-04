const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../model/campground')
const { campgroundSchema } = require('../schema')
const { isLoggedIn } = require('../middleware')

const validateCampground = (req, res, next) =>{
    console.log(req.body.campground)
    const { error } = campgroundSchema.validate(req.body)
    if(error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400)
    }else{
        next();
    }
}

router.get('/',catchAsync( async (req, res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', isLoggedIn ,(req, res) => {
    res.render('campgrounds/new');
})

router.get('/:id',catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error', 'Campground does not exist!')
        return res.redirect('/campground')
    }
    const reviews = campground.reviews;
    res.render('campgrounds/show', { campground, reviews })
}))

router.get('/:id/edit', catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Campground does not exist!')
        return res.redirect('/campground')
    }
    res.render('campgrounds/edit', { campground })
}))

router.post('/', isLoggedIn, validateCampground , catchAsync(async (req, res, next) => {
    //if(!req.body.campground) throw new ExpressError('invalid Campground data', 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campground/${campground._id}`)
}))

router.put('/:id', isLoggedIn, validateCampground ,catchAsync(  async (req, res) => {  
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campground/${campground._id}`)
}))
router.delete('/:id', isLoggedIn, catchAsync( async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campground')
}))

module.exports = router;