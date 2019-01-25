import axios from "axios";
import createKeccakHash from "keccak";
import server_config from "../config/config";
import store from "../utils/store";
import { message } from 'antd';

export const getTicketsByUser = async (page_no, callback) => {
    let url = server_config["server"]+"/getTicketsByUser";
    url = url + "?page_no="+page_no;
    
    const userTickets = await axios.get(url);
    if(userTickets && userTickets.data) {
        callback(userTickets.data.tickets, userTickets.data.userTicketsCount);
    }
    else callback([]);
}

export const reSaleTicket = async (fullTicketId, callback) => {
    let { contract, web3 } = store.getState().global_vars;

    if(contract && fullTicketId) {
        try {
            const resultTx = await contract.markTicketForSale
                .sendTransaction(fullTicketId, {"from":web3.eth.defaultAccount, gas: 6000000});
            console.log(resultTx);
            callback(null, resultTx);
        } catch(err) {
            console.log(err);
            callback("error")
        }
    }
}

export const getResaleTicketList = async ({language, location, movieName}, page_no, callback) => {
    try {
        if(language && location && movieName) {
            let headers = {headers:{language, location, movieName, page_no}};
            const resale_tickets = await axios.get(server_config["server"]+"/getResaleTicketList", headers)
            if(resale_tickets && resale_tickets.data) {
                const { tickets, ticketCount } = resale_tickets.data;
                callback(null, tickets, ticketCount);
            }
            else
                callback([]);
        }
    } catch(err) {
        console.log(err);
        callback([]);
    }
}

export const buyResaleTicket = async (fullTicketId, movieName, language, location, reSalePosition) => {
    let { contract, web3 } = store.getState().global_vars;
    if(fullTicketId && movieName && language && location && !isNaN(reSalePosition)) {
        try {
            const ticketInfo = await contract.ticketToCustomer.call(fullTicketId);

            if(!ticketInfo || !ticketInfo.price || !ticketInfo.price.toString())
                return;
            
            let price = parseInt(ticketInfo.price.toString());

            const movieLangHash = createKeccakHash('keccak256').update(movieName+language).digest('hex');
            const locationHash = createKeccakHash('keccak256').update(location).digest('hex');
            const resultTx = await contract.buyResaleTicket
                .sendTransaction('0x'+movieLangHash, '0x'+locationHash, reSalePosition, {"from":web3.eth.defaultAccount, gas: 6000000, value:price});
            console.log(resultTx);
            message.success("transaction successfull");
        } catch(err) {
            console.log(err);
            message.error("transaction unsuccessfull");
        }
    }
}