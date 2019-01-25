import store from "../utils/store";

export const checkTicket = async (position, callback) => {
    const { contract, web3 } = store.getState().global_vars;
    try {
        const ticketInfo = await contract.customerToTickets.call(web3.eth.defaultAccount, position)
        if(ticketInfo) callback(null, ticketInfo);
        else callback("error");
    } catch (error) {
        console.log(error);
        callback("error");
    }
}

export const getBalance = async (callback) => {
    const { contract, web3 } = store.getState().global_vars;
    try {
        const balance = await contract.balances.call(web3.eth.defaultAccount)
        if(balance) callback(null, web3.utils.fromWei(balance.toString(), 'ether'));
        else callback("error");
    } catch (error) {
        console.log(error);
        callback("error");
    }
}

export const withdraw = async (value, callback) => {
    const { contract, web3 } = store.getState().global_vars;
    try {
        const withdrawTx = await contract.withdraw.sendTransaction(web3.utils.toWei(value), {"from":web3.eth.defaultAccount, gas: 6000000})
        if(withdrawTx) callback(null, withdrawTx);
        else callback("error");
    } catch (error) {
        console.log(error);
        callback("error");
    }
}