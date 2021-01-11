const mongoose = require('mongoose');
const campground = require('../model/campground');
const cities = require('./cities')
const { descriptors, places } = require('./seedhelpers');

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

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () =>{
    await campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const camp = new campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save()
    }
}
seedDB().then( () =>{
    mongoose.connection.close();
});