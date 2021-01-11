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

app.get('/', (req, res) =>{
    res.render('mock')
})


app.get('/makeCampground', async (req, res) =>{
    const camp = new Campground({
        title: 'New Camp',
        description: 'cheap camping'
    })
    await camp.save()
    res.send(camp)
})

app.listen(3000, () => {
    console.log('serving on port 3000')
})