import React, { Component } from "react";
import { getResaleTicketList, buyResaleTicket } from "../../actions/tickets";
import { Card, message, Input, Pagination, Button, Dropdown, Menu, Icon } from 'antd';
import { getDropDownList } from "../../actions/movies";

class ReSale extends Component {

  state = {
    language: '',
    location: '',
    locations: [],
    languages: [],
    movieName: '',
    tickets: [],
    ticketCount: 0,
    page_no: 1
  }

  constructor(props) {
    super(props);
    this.getMenus = this.getMenus.bind(this);
    this.displayResaleTickets = this.displayResaleTickets.bind(this);
  }

  componentDidMount() {
    getDropDownList('language', (languages) => {
        if(languages.length > 0)
            this.setState({languages, language:languages[0]});
    });
    getDropDownList('city', (citys) => {
        if(citys.length > 0)
            this.setState({locations:citys, location:citys[0]});
    });
  }

  getResaleTicketList(page_no) {
    getResaleTicketList(this.state, page_no, (err, data, ticketCount) => {
      if(!err) 
        this.setState({tickets:data, ticketCount});
      else message.error("error while fetch");
    });
  }

  selectDropdown(target,item,e) {
      this.setState({[item]:this.state[target][parseInt(e.key)]});
  }

  getMenus(target, item){
      return (
          <Menu onClick={this.selectDropdown.bind(this, target, item)}>
              {
                  this.state[target].map((value, i) => {
                      return (<Menu.Item key={i}>{value}</Menu.Item>)
                  })
              }
          </Menu>
      );
  }
  displayResaleTickets() {
    return this.state.tickets.map((ticket, i) => {
      let { movieName, fullTicketId, language, cinemaHallName, location, reSalePosition } = ticket;
      let startTime = new Date(ticket.movieTime);
      
      return (
        <Card
            title={ticket.movieName}
        >
            <p>TicketId: {fullTicketId}</p>
            <p>Class Type: {ticket.class}</p>
            <p>Language: {language}</p>
            <p>cinemaHallName: {cinemaHallName}</p>
            <p>Location: {location}</p>
            <p>Time: {startTime.toDateString()+"   "+ startTime.getHours() + ":" + startTime.getMinutes()}</p>
            {
                ticket.reSale ? 
                <Button 
                    type="primary" 
                    value="Buy"
                    onClick={() => {
                      buyResaleTicket(fullTicketId, movieName, language, location, reSalePosition)
                    }}
                >Buy</Button> :
                null
            }
        </Card>
      );
    });
  }

  onTextChange(target, e) {
    if(e && e.target) this.setState({[target]:e.target.value});
  }

  render() {
    let  { movieName, language, location, ticketCount } = this.state;
    return (
      <div>
        <h1>Resale</h1>
        <Dropdown overlay={this.getMenus('locations', 'location')}>
            <a className="ant-dropdown-link">
                {this.state.location} <Icon type="down" />
            </a>
        </Dropdown>&nbsp;&nbsp;&nbsp;&nbsp;
        <Dropdown overlay={this.getMenus('languages', 'language')}>
            <a className="ant-dropdown-link">
                {this.state.language} <Icon type="down" />
            </a>
        </Dropdown>&nbsp;&nbsp;&nbsp;&nbsp;
        <Input placeholder="movie name" style={{ width: 200 }} value={movieName} onChange={this.onTextChange.bind(this, "movieName")}/>
        <Button type="primary" onClick={this.getResaleTicketList.bind(this, 1)}>Search</Button>
        <div style={{ background: '#fcffe6', padding: '30px' }}>
            {this.displayResaleTickets()}
            <Pagination defaultCurrent={1} defaultPageSize={5} total={ticketCount} onChange={this.getResaleTicketList.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default ReSale;
