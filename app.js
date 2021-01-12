const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path')
const Campground = require('./model/campground')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',()=>{
    console.log("database connected")
})

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.get('/', async (req, res) =>{
    res.render('home')
})

app.get('/campground', async (req, res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})
app.get('/campground/new', (req, res) => {
    res.render('campgrounds/new');
})
app.get('/campground/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground })
})
app.get('/campground/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
})
app.post('/campground', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campground/${campground._id}`)
})
app.put('/campground/:id', async (req, res) => {  
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
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
})
app.delete('/campground/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground')
})
app.listen(3000, () => {
    console.log('serving on port 3000')
})