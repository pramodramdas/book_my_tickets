import React, { Component } from "react";
import { Switch, Route, Prompt } from 'react-router-dom';
import truffleContract from "truffle-contract";
import { connect } from "react-redux";
import axios from "axios";
import BookMyTickets from "./contracts/BookMyTickets.json";
//import BookMyTickets from "./contracts/BookMyTicketsExper.json";
import getWeb3 from "./utils/getWeb3";
import { setGlobalData } from './actions/global_vars';
import Home from "./components/home";
import Movie from "./components/movie/movie";
import Cinemas from "./components/movie/cinemas";
import Admin from "./components/admin";
import User from "./components/user";
import ReSale from "./components/movie/resale";
import { Button } from "antd";

import "./App.css";
import "./antd.css";

const nav_buttons = ['/resale', '/profile', '/home'];

class App extends Component {
  state = { web3: null, accounts: null, contract: null, buttonsToShow: [] };

  componentWillMount = () => {
    const { location, history } = this.props;
    
    if(location.pathname === '/')
      history.push('/home');
  }

  componentDidMount = async () => {
    try {
      const { history } = this.props;
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(BookMyTickets);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();
      
      //set Default account
      web3.eth.defaultAccount = accounts[0];
      axios.defaults.headers.common["useraddress"] = accounts[0];
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
      this.props.setGlobalData({web3: web3, contract: instance});

      
      history.listen((location) => {
        let buttonsToShow = nav_buttons.slice(0);
        const pathIndex = nav_buttons.indexOf(location.pathname);
        if(pathIndex < 0) this.setState({buttonsToShow: nav_buttons});
        else  {
          buttonsToShow.splice(pathIndex, 1);
          this.setState({buttonsToShow});
        }
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  renderNavigation() {
    const { history } = this.props;

    return this.state.buttonsToShow.map((path) => {
        return <Button onClick={() => { history.push(path); }}>{path.substring(1)}</Button>
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <h1>Contract loaded</h1>
        {this.renderNavigation.bind(this)()}
        <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path="/movie/:movieId?/:location?" component={Movie} />
            <Route exact path="/cinemas/:movieId?/:location?" component={Cinemas} />
            <Route exact path="/admin" component={Admin} />
            <Route exact path="/profile" component={User} />
            <Route exact path="/resale" component={ReSale} />
        </Switch>
      </div>
    );
  }
}
const actionCreators = {
  setGlobalData
};

export default connect(null, actionCreators)(App);
//export default App;
