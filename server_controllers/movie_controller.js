const createKeccakHash = require('keccak');
const shortid = require('shortid');
const CinemaHalls = require("../database/models/cinema-hall");
const Shows = require("../database/models/shows");
const Ticket = require("../database/models/ticket");
const Movie = require("../database/models/movie");
const LocLang = require("../database/models/loclang");
const getMoviesByFilters = require("../database/queries/get_movies_filtered.json");
const getShowsForMovie = require("../database/queries/get_shows");
const { getWeb3Obj } = require("../server_utils/web3-util");

var Tx = require('ethereumjs-tx');

const getDropDownList = async (req, res) => {
    const { type } = req.query;

    try {
        if(!type)
            return res.json({success:false, msg:"missing parameters"});
        
        let result = await LocLang.find({}, {[type]:1,_id:0});

        res.json({success:true, result});
    } catch(err) {
        console.log(err);
        res.json({success:false});
    }
}

const getMoviesByFilter = async (req, res) => {
    let { language, year, movieId } = req.query;
    let query = {};

    try {
        if(language)
            query.language = language;
        if(year)
            query.year = parseInt(year);
        if(movieId)
            query.movieId = movieId;

        if(Object.keys(query).length < 1)
            return res.json({success:false, msg:"missing parameters"});

        let movies = await Movie.find(query, {_id:0});

        return res.json({success:true, movies});
    } catch(err) {
        console.log(err);
        return res.json({success:false, msg:"something went wrong"});
    }
}

const getMovieList = async (req, res) => {
    const { movieName, language, location, page_no } = req.query;
    const MOVIES_PER_PAGE = parseInt(process.env.MOVIES_PER_PAGE);
    let query = JSON.parse(JSON.stringify(getMoviesByFilters));

    if(location)
        query[0]["$match"]["cLocation"] = location; 
    else
        return res.json({success:false, msg:"location mandatory"});
    // get only movie having shows time greater than current time
    query[1]["$lookup"]["pipeline"][0]["$match"]["$expr"]["$and"][1]["$gte"][1] = 11; 
    
    if(movieName || language) {
        let filters = { "$match": { } };
        if(movieName)
            filters["$match"]["movieName"] = movieName;
        if(language)
            filters["$match"]["language"] = language;
        
        query[8] = filters;
    }

    if(page_no && parseInt(page_no)) {
        query.push({"$skip": MOVIES_PER_PAGE * parseInt(page_no - 1)});
        query.push({"$limit": MOVIES_PER_PAGE});
    }

    let result = await CinemaHalls.aggregate(query);

    res.json({success:true, result});
}

const getCinemaByLocation = async (req, res) => {
    let { location } = req.query;
    
    try {
        if(!location)
            return res.json({success:false, msg:"missing parameters"});

        let cinemas = await CinemaHalls.find({cLocation:location}, {_id:0});

        return res.json({success:true, cinemas});
    } catch(err) {
        console.log(err);
        return res.json({success:false, msg:"something went wrong"});
    }
}

const getShows = async (req, res) => {
    const { movieId, location, cID, endDate } = req.query;
    let query = JSON.parse(JSON.stringify(getShowsForMovie));

    if(!movieId || !location)
        res.json({success:false, mgs:"missing parameters"});

    if(cID)
        query[0]["$match"]["cID"] = cID;
    if(location)
        query[0]["$match"]["location"] = location;
    if(endDate)
        query[0]["$match"]["startTime"]["$lt"] = parseInt(endDate);

    query[0]["$match"]["movieId"] = movieId;
    query[0]["$match"]["startTime"]["$gte"] = new Date().getTime()//11;
    //query[2]["$lookup"]["pipeline"][0]["$match"]["$expr"]["$and"][0]["$eq"][0] = location;
    query[3]["$addFields"]["movieId"] = movieId;

    let showResult = await Shows.aggregate(query);
    let allShows = [];
    let movieString = '';

    if(showResult.length === 0 && cID) {
        let cinema_hall = await CinemaHalls.findOne({cID});
        let movieInfo = await Movie.findOne({movieId});
        showResult[0] = {
            cinema_hall:[cinema_hall],
            movie_info:[movieInfo]
        }
    }
    else {
        showResult.map((show) => {
            let cinemaId = show.cinema_hall[0].cID;;
            let classObj = show.cinema_hall[0].class;
            let movieObj = show.movie_info[0];

            show.show_details.map((s) => {
                let startTime = s.startTime;
                s.showInfo = [];
                classObj.map((c) => {
                    let movieHashes = [];
                    for(let i = c.start; i <= c.end; i++) {
                        movieString = movieObj.movieName + cinemaId + startTime + location + movieObj.language + i;
                        // console.log(movieString);
                        movieHashes.push('0x'+createKeccakHash('keccak256').update(movieString).digest('hex')); 
                    }
                    s.showInfo.push(Object.assign({}, c, {movieHashes}));
                    allShows = allShows.concat(movieHashes);
                });
            });
        });
    }

    let ticketQuery = [
        {$match: {"fullTicketId" : {$in:allShows} } },
        {$group:{"_id":"$movieName", "allIds":{$push:"$fullTicketId"} }}
    ]
    //let ticketsSold = await Ticket.find({fullTicketId: { $in: allShows } },{fullTicketId:1, _id:0});
    let ticketsSold = await Ticket.aggregate(ticketQuery);

    res.json({success:true, result: {showResult, ticketsSold}});
}

const signTransactionManually = (bookmytickets, web3, contractAddress, partialMovieHash, classHash, price) => {
    return new Promise(async (resolve, reject) => {
        try {
            const account = process.env.OWNER_ACCOUNT_PUBLIC;
            const key = new Buffer(process.env.OWNER_ACCOUNT_PRIVATE, 'hex');
            console.log("*******");
            console.log(account);
            console.log(process.env.OWNER_ACCOUNT_PRIVATE);
            const dataTx = bookmytickets.methods.setMoviePrice('0x'+partialMovieHash, '0x'+classHash, price).encodeABI();            
            //const gasPricep = web3.utils.toHex(1000000000)//await web3.eth.getGasPrice();
            const gasPrice = await web3.eth.getGasPrice(); 
            const gasLimitHex = web3.utils.toHex(6000000);
            const  nounce = await web3.eth.getTransactionCount(account);
            console.log(nounce);
            console.log(gasPrice);
            console.log(contractAddress);
            var rawTx = {
                to: contractAddress,
                nonce: '0x' + nounce.toString(16),
                //gasPrice: gasPricep,
                gasPrice: web3.utils.toHex(gasPrice),
                gasLimit: gasLimitHex,
                data:dataTx,
                from: account
            }
          
            var tx = new Tx(rawTx);
            tx.sign(key);
            
            var serializedTx = tx.serialize();

            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), (err, data) => {
                if(err) {
                    console.log(err);
                    reject(err);
                } 
                console.log(data)
            }).on('receipt', (receipt) => {
                //console.log(receipt);
                resolve(receipt);
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}

const setMoviePrice = async (req, res) => {
    const { sMovieId, sCID, sMovieStartTime, sMovieEndTime, sClass, sPrice } = req.body;

    if(!sMovieId || !sCID || !sMovieStartTime || !sMovieEndTime || !sClass || !sPrice)
        return res.json({success:false, msg:"missing parameters"});
    
    try { 
        const startTime = parseInt(sMovieStartTime);
        const endTime = parseInt(sMovieEndTime);
        const price = parseInt(sPrice);
        let queries = [
            Movie.findOne({"movieId": sMovieId}), 
            CinemaHalls.findOne({"cID":sCID, "class.classType": sClass}),
            Shows.findOne(
                {
                    "cID":sCID, 
                    "movieId":sMovieId, 
                    "class":sClass,
                    "$or":[
                        {"$and":[{"startTime":{"$lte":startTime}},{"endTime":{"$gte":startTime}}]},
                        {"$and":[{"startTime":{"$gte":endTime}},{"endTime":{"$lte":endTime}}]}
                    ]
                }
            )
        ];

        let movieCinemaResult = await Promise.all(queries);

        if(!movieCinemaResult[0] || !movieCinemaResult[1])
            return res.json({success:false, msg:"missing cinemahall, class or movieId"});
        if(movieCinemaResult[2])
            return res.json({success:false, msg:"time interval for show already exist"});

        let moviePriceTx;
        const bookmytickets = getWeb3Obj().getBookMyTicket();
        const web3 = getWeb3Obj().getWeb3();
        const contractAddress = getWeb3Obj().getContractAddress();
        const { movieName, language } = movieCinemaResult[0];
        const { cID, cLocation } = movieCinemaResult[1];
        const partialMovieInfo = movieName + cID + startTime + cLocation + language;
        const partialMovieHash = createKeccakHash('keccak256').update(partialMovieInfo).digest('hex');
        const classHash = createKeccakHash('keccak256').update(sClass).digest('hex');
        
        console.log('0x'+partialMovieHash, '0x'+classHash, price)

        if(process.env.DEPLOY_NETWORK === "ganache")
            moviePriceTx = await bookmytickets.methods
                .setMoviePrice('0x'+partialMovieHash, '0x'+classHash, price).send({"from":web3.eth.defaultAccount, gas:6000000});
        else
            moviePriceTx = await signTransactionManually(bookmytickets, web3, contractAddress, partialMovieHash, classHash, price);

        console.log(moviePriceTx);

        const showResult = await Shows.findOneAndUpdate(
            {
                cID:sCID, 
                movieId:sMovieId,
                startTime:parseInt(sMovieStartTime), 
                endTime:parseInt(sMovieEndTime),
                class:sClass
            },
            {
                showId:shortid.generate(), 
                cID:sCID,
                class:sClass, 
                movieId:sMovieId,
                location:cLocation,
                startTime,
                endTime,
                price
            }, 
            { upsert:true }
        );
        res.json({success:true});
    } catch (err) {
        console.log(err);
        res.json({success:false});
    }
}

module.exports = {
    getMovieList,
    getMoviesByFilter,
    getCinemaByLocation,
    getShows,
    getDropDownList,
    setMoviePrice
}