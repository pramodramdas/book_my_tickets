const Shows = require('../database/models/shows');
const CinemaHall = require('../database/models/cinema-hall');
const { hasArrayObjectsDuplicate, getErrorObj } = require('../server_utils/genric_util');

const add_cinema_hall = async (req, res) => {
    const  { cID, cName, cLocation, classObj } = req.body;
    
    if(!cID || !cName || !cLocation)
        return res.json({success:false, msg:"missing fields"});

    try {
        //check for duplicate seating class
        if(hasArrayObjectsDuplicate(classObj, 'classType')) throw getErrorObj('duplicate class type');
        
        const cinemaHall = new CinemaHall({cID, cName, cLocation, class: classObj});
        const result = await cinemaHall.save();
        res.json({success:true, msg:"cinema hall added"});
        // console.log(result);
    }
    catch(e) {
        console.log(e);
        res.json({success:false, msg:(e.name || "error")});
    }
}

const add_show = async (req, res) => {
    const  { showId, cID, movieId, startTime, endTime, price } = req.body;
    
    if(!cID || !showId)
        return res.json({success:false, msg:"missing fields"});

    try { 
        const shows = new Shows({showId, cID, movieId, startTime, endTime, price});
        const result = await shows.save();
        res.json({success:true, msg:"show added"});
        // console.log(result);
    }
    catch(e) {
        console.log(e);
        res.json({success:false, msg:(e.name || "error")});
    }
}

module.exports = {
    add_cinema_hall,
    add_show
}