const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    fullTicketId: { type: String, required:true, index: { unique: true } },
    fullInfo: { type: String },
    language: { type: String, lowercase: true },
    location: { type: String, lowercase: true },
    class: { type: String, lowercase: true },
    movieName: { type: String, lowercase: true },
    movieTime: { type: Number },
    cinemaHallName: { type: String },
    owner: { type: String },
    pos: { type: Number, default: -1 },
    reSale:{ type: Boolean, default: false },
    reSalePosition: { type: Number, default: -1 }
});

const Ticket = mongoose.model('tickets', TicketSchema);

module.exports = Ticket;