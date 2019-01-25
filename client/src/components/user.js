import React, { Component } from "react";
import { Input, Button } from 'antd';
import { getTicketsByUser } from "../actions/tickets";
import { getBalance, withdraw } from "../utils/eth_util";
import Tickets from "./movie/tickets";

class User extends Component {

    state = {
        tickets:[],
        userTicketsCount:0,
        getEthers:0,
        balance: 0
    }

    constructor(props) {
        super(props);
        this.ticketForSale = this.ticketForSale.bind(this);
        this.getBalance = getBalance.bind(this);
    }

  componentDidMount = async () => {
    this.ticketForSale(1);
    setTimeout(() => {
      this.getBalance((err, balance) => {
        if(!err)
          this.setState({balance:balance, getEthers:balance});
      });
    }, 500);
  }

  ticketForSale(page_no) {
    getTicketsByUser(page_no, (data, userTicketsCount) => {
        this.setState({tickets:data, userTicketsCount});
    });
  }

  onTextChange(target, e) {
    if(e && e.target) this.setState({[target]:e.target.value});
  }

  withdraw() {
    if(this.state.getEthers && parseFloat(this.state.getEthers) > 0) {
      withdraw(this.state.getEthers, () => {
        this.getBalance((err, balance) => {
          if(!err)
            this.setState({balance: balance, getEthers:balance});
        });
      });
    }
  }

  render() {
    const { tickets, userTicketsCount } = this.state;
    return (
      <div>
        <Input placeholder="eth" style={{ width: 200 }} value={this.state.getEthers} onChange={this.onTextChange.bind(this, "getEthers")}/>
        <h3>Balance: {this.state.balance} ETH</h3>
        <Button 
            type="primary"
            onClick={this.withdraw.bind(this)}
        >withdraw</Button>
        <Tickets tickets={tickets} ticketCount={userTicketsCount} ticketForSale={this.ticketForSale}/>
      </div>
    );
  }
}

export default User;
