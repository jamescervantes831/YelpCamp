const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path')
const Campground = require('./model/campground')
const Review = require('./model/review')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const {campgroundSchema, reviewSchema} = require('./schema')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',()=>{
    console.log("database connected")
})

const app = express()

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

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

app.get('/', async (req, res) =>{
    res.render('home')
})

app.get('/campground',catchAsync( async (req, res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))
app.get('/campground/new', (req, res) => {
    res.render('campgrounds/new');
})

//PICK UP FROM HERE 2/8/2021
app.get('/campground/:id', catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    const reviews = campground.reviews;
    console.log('this is campground: '+ campground)
    console.log('this is reviews: '+ reviews)
    res.render('campgrounds/show', { campground, reviews })
}))
///////////////////////////////////////////////////

app.get('/campground/:id/edit', catchAsync( async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
}))
app.post('/campground', validateCampground , catchAsync(async (req, res, next) => {
    //if(!req.body.campground) throw new ExpressError('invalid Campground data', 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campground/${campground._id}`)
}))

//PICK UP FROM HERE 2/8/2021
app.post('/campground/:id/review', validateReview ,catchAsync(async (req, res, next) =>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review)
    campground.reviews.push(review);
    console.log(campground)
    console.log(review)
    await review.save();
    await campground.save();
    res.redirect(`/campground/${campground._id}`)
}))
///////////////////////////////////////////////////
app.put('/campground/:id', validateCampground ,catchAsync(  async (req, res) => {  
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, { ...req.body.campground }, options.new = true);
    res.redirect(`/campground/${id}`)
    /** THE BELOW IS A LONGER SCRIPT FOR A ASYNC/AWAIT FUNCTION
     ** ALSO ALOWS US TO DEBUG WIHT CATCH().
     ** BUT AN ASYNC IS A PROMISE, & IN SOME CASES ALLOWES
     ** US TO DO MORE WITH LESS.
    Campground.findByIdAndUpdate(id, {
        title: title,
        location: location
    }).then(result => {
        res.redirect(`/campground/${id}`)
    }).catch(err => {
        console.log(err)
        res.send(err)
    })
    */
}))
app.delete('/campground/:id', catchAsync( async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground')
}))
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
app.listen(3000, () => {
    console.log('serving on port 3000')
})