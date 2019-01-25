const mongoose = require('mongoose');
const Movie = require('./movie');
const cinemaHall = require('./cinema-hall');
const { getErrorObj } = require('../../server_utils/genric_util');

const Schema = mongoose.Schema;

const ShowsSchema = new Schema({
    showId : {
        type: String,
        required: true
    },
    cID:{type: String, required: true},
    class:{type: String, required: true},
    movieId:{type: String, required: true},
    location:{type: String},
    startTime: {type: Number, required:true},
    endTime: {type: Number, required:true},
    price: {type: Number, required:true}
});

ShowsSchema.pre('save', async function(next){
    let queries = [
        Movie.findOne({movieId:this["movieId"]}),
        cinemaHall.findOne({cID:this["cID"]})
    ];

    let result = await Promise.all(queries);

    if(!result[0] || !result[1]) next(getErrorObj('invalid movieId or cinemahall id'));
    else next();
});

const Shows = mongoose.model('shows', ShowsSchema);

module.exports = Shows;