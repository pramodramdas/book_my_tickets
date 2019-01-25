const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    classType: {
        type: String,
        required: true,
        lowercase: true
    },
    start: { 
        type: Number,
        required: true
    },
    end: { 
        type:Number,
        required: true
    }
});

const CinemaHallSchema = new Schema({
    cID: {
        type: String,
        required: true,
        unique: true
    },
    cName: {
        type: String,
        required: true,
        lowercase: true
    },
    cLocation: {
        type: String,
        required: true,
        lowercase: true
    },
    class: [ClassSchema]
});

const CinemaHall = mongoose.model('cinema_halls', CinemaHallSchema);

module.exports = CinemaHall;