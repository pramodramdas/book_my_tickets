const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
    movieId: { type: String, required:true, unique:true },
    movieName: { type: String, lowercase: true},
    language: { type: String, lowercase: true},
    genre: { type: String, lowercase: true },
    votes: { type: Number },
    year: { type: Number },
    synopsis: { type: String }
});

MovieSchema.pre('save', async function(next) { 
    let result = await MovieSchema.findOne({movieName:this["movieName"], language:this["language"]});
    if(result) next(new Error('movie already exist'));
    else next();
});

const Movie = mongoose.model('movies', MovieSchema);

module.exports = Movie;