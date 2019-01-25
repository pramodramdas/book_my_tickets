const { getWeb3Obj } = require("../server_utils/web3-util");
const { saveTicketInfo, setTicketForResale, buyResaleTicket } = require("../server_controllers/ticket_controller");
const createKeccakHash = require('keccak');

const solidityEvents = () => {
    let bookmytickets = getWeb3Obj().getBookMyTicket();
    let ticketBookedEvent = bookmytickets.events.allEvents((error, result) => {
        console.log('inside events');
        if(!error && result.returnValues) {
            console.log(result);
            setTimeout(() => {
                if(result.event === 'TicketBooked')
                    ticketBooked(result);
                else if(result.event === 'ResaleTicket')
                    resaleTicket(result);
                else if(result.event === 'ResaleTicketSold')
                    resaleTicketSold(result);
            }, 3000);
        }
        else
            console.log(error);
    });
}

const ticketBooked = (result) => {
    const { ticketHash, fullInfo, movieName, language, location, movieTime, sender, tpos } = result.returnValues;
    const classType = result.returnValues.class;

    saveTicketInfo(
        '0x'+createKeccakHash('keccak256').update(fullInfo).digest('hex'),
        fullInfo,
        movieName,
        classType,
        movieTime,
        language,
        location,
        sender,
        parseInt(tpos),
        (err, data) => {}
    );
}

const resaleTicket = (result) => {
    const { fullTicketHash, reSalePosition } = result.returnValues;
    setTicketForResale(fullTicketHash, reSalePosition);
}

const resaleTicketSold = (result) => {
    const { fullTicketHash, tpos, sender } = result.returnValues;
    buyResaleTicket(fullTicketHash, tpos, sender);
}

module.exports = {
    solidityEvents
} 