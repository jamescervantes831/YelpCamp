const mongoose = require('mongoose')
const Review = require('./review');
const Schema = mongoose.Schema

const CampgroundsSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description:String,
    location: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

CampgroundsSchema.post('findOneAndDelete', async (doc) => {
    if(doc){
        await Review.remove({ 
            _id: {
                $in: doc.reviews
            }
         })
    }
})

module.exports = mongoose.model('Campground', CampgroundsSchema)