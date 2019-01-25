const Web3 = require('web3');
//const Web3 = require('../alter/node_modules/web3');
const fs = require('fs');
let web3 = new Web3();

class WebObj {
    constructor(){
        this.contract = {},
        this.healthCare = '';
        this.web3 = new Web3();
        this.address = "";
    }
    
    setProvider(provider){
        //this.web3.setProvider(provider ? provider : new this.web3.providers.HttpProvider(process.env.HTTP_PROVIDER));

        this.web3.setProvider(provider ? provider : new this.web3.providers.WebsocketProvider(process.env.HTTP_PROVIDER));
  
        this.web3.eth.getAccounts((err, accounts)=>{
            if(err)
                console.log(err);
            else
                this.web3.eth.defaultAccount = accounts[0];
        })
    }

    loadContract(){
        let source = fs.readFileSync("./build/contracts/BookMyTickets.json");
        this.contract = JSON.parse(source);
        this.address = process.env.CONTRACT_ADDRESS ? process.env.CONTRACT_ADDRESS : this.contract.networks[process.env.CONTRACT_DEPLOYED_PORT].address;
        let tempContract = new this.web3.eth.Contract(this.contract.abi, this.address);
        console.log('contract at.... '+this.contract.networks[process.env.CONTRACT_DEPLOYED_PORT].address);
        console.log(process.env.CONTRACT_DEPLOYED_PORT);
        this.bookmyticket = tempContract;
        //this.healthCare = tempContract.at(process.env.CONTRACT_ADDRESS ? process.env.CONTRACT_ADDRESS : this.contract.networks[process.env.CONTRACT_DEPLOYED_PORT].address);
    }

    getWeb3(){
        return this.web3;
    }

    getBookMyTicket(){
        return this.bookmyticket;
    }

    getContract(){
        return this.contract;
    }
    
    getContractAddress() {
        return this.address;
    }
}

module.exports = WebObj;