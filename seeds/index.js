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
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/542704',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur mattis vulputate enim ut laoreet. Nunc pharetra mi sed aliquet rhoncus. Aenean lobortis ipsum arcu, vel ullamcorper ex porta a. Nam faucibus turpis ut dictum rutrum. Pellentesque accumsan massa quis arcu imperdiet, in maximus nisl mollis.',
            price: price
        })
        await camp.save()
    }
}
seedDB().then( () =>{
    mongoose.connection.close();
});