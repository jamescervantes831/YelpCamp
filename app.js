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
app.post('/campground', (req, res) => {
    const title = req.body.campground.title
    const location = req.body.campground.location
    Campground.insertMany({
        title: title,
        location: location
    }).then(result =>{
        res.redirect('/campground')
    }).catch(err => {
        console.log(err)
        res.send(err)
    })
})
app.listen(3000, () => {
    console.log('serving on port 3000')
})