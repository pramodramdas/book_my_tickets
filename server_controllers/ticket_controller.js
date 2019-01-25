const Ticket = require("../database/models/ticket");
const cinemaHall = require("../database/models/cinema-hall");
const createKeccakHash = require('keccak');
const { getWeb3Obj } = require("../server_utils/web3-util");

const ticketSold = (req, res) => {
    const  { partialMovieHash, fullMovieInfo, movieName, movieTime, location, language, classType, sender } = req.body;

    if(!partialMovieHash || !fullMovieInfo || !movieTime || !location || !language || !classType)
        return res.json({success:false, msg: 'missing parameters'});

    saveTicketInfo(
        '0x'+createKeccakHash('keccak256').update(fullMovieInfo).digest('hex'),
        fullMovieInfo,
        movieName,
        classType,
        movieTime,
        language,
        location,
        sender,
        -1,
        (err, data) => {
            if(err) return res.json({success:false});

            return res.json({success:true});
        }
    )
}

const saveTicketInfo = async (fullTicketId, fullInfo, movieName, classType, movieTime, language, location, owner, pos, callback) => {
    try {
        const cID = fullInfo.split(movieName)[1].split(movieTime)[0];

        const cinemaHallInfo = await cinemaHall.findOne({cID});

        const soldResult = await Ticket.updateOne(
            { fullTicketId },
            {
                $set:{
                    fullTicketId:fullTicketId,
                    fullInfo:fullInfo,
                    class: classType,
                    movieTime:movieTime,
                    movieName:movieName,
                    language:language,
                    location:location,
                    cinemaHallName:cinemaHallInfo.cName,
                    owner:owner,
                    pos:pos,
                    reSale: false
                }
            },
            { upsert:true });

        soldResult ? callback(null, soldResult): callback("not inserted");
    } catch (err) {
        console.log(err);
        callback(err);
    }
}

const setTicketForResale = async (fullTicketId, reSalePosition) => {
    try {
        const soldResult = await Ticket.updateOne(
            { fullTicketId },
            { reSale: true, reSalePosition }
        );
    } catch(err) {
        console.log(err);
    }
}

const buyResaleTicket = async (fullTicketId, pos, owner) => {
    if(fullTicketId && !isNaN(pos) && owner) {
        try {
            const soldResult = await Ticket.updateOne(
                { fullTicketId },
                { pos, owner, reSale:false, reSalePosition:-1 }
            );
            console.log(soldResult);
        } catch(err) {
            console.log(err);
        }
    }
}

const getTicketsByUser = async (req, res) => {
    const userAddress = req.get('useraddress');
    const TICKETS_PER_PAGE = parseInt(process.env.TICKETS_PER_PAGE);
    let { page_no } = req.query;
    let web3 = getWeb3Obj().getWeb3();

    if(!page_no)page_no = 1;

    try {
        if(userAddress && web3 && web3.utils.isAddress(userAddress)) {
            const userTickets = await Ticket.find({owner:userAddress},{_id:0})
                .sort({movieTime:1})
                .skip(TICKETS_PER_PAGE * parseInt(page_no - 1))
                .limit(TICKETS_PER_PAGE);

            const userTicketsCount = await Ticket.find({owner:userAddress}).count();

            return res.json({success:true, tickets:userTickets, userTicketsCount});
        }
        else
            return res.json({success:false, msg:'missing user address or address invalid'});
    } catch(err) {
        console.log(err);
        return res.json({success:false});
    }
}

const getResaleTicketList = async (req, res) => {
    let {language, location, moviename, page_no} = req.headers;

    if(!language || !location || !moviename)
        return res.json({success:false, msg:"missing parameters"});

    if(!page_no)page_no=1;

    const TICKETS_PER_PAGE = parseInt(process.env.TICKETS_PER_PAGE);

    const query = {   
        language, 
        location, 
        movieName:moviename,
        reSale:true, 
        movieTime:{$gt:new Date().getTime()}
    }

    try {
        const tickets = await Ticket.find(query)
            .sort({movieTime:1})
            .skip(TICKETS_PER_PAGE * parseInt(page_no - 1))
            .limit(TICKETS_PER_PAGE);

        const ticketCount = await Ticket.find(query).count();

        res.json({success:true, tickets, ticketCount});
    } catch (error) {
        console.log(error);
        res.json({success:false, tickets:[]});
    }
}

module.exports = {
    ticketSold,
    saveTicketInfo,
    getTicketsByUser,
    setTicketForResale,
    getResaleTicketList,
    buyResaleTicket
}