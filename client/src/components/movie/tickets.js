import React, { Component } from "react";
import { Card, message, Button, Pagination } from 'antd';
import { reSaleTicket } from "../../actions/tickets";
import { checkTicket } from "../../utils/eth_util";

class Tickets extends Component {

    constructor(props) {
        super(props);
        this.displayTickets = this.displayTickets.bind(this);
    }

    state = {
        page_no: 1
    }

    reSaleTicket(fullTicketId, index) {
        reSaleTicket(fullTicketId, (err, data) => {
            if(err) {
                message.error("resale unsucessful");
            }
            else {
                message.success("resale successful");
                this.props.ticketForSale(this.state.page_no);
            }
        })
    }

    displayTickets() {
        if(!this.props.tickets)return null;

        return this.props.tickets.map((ticket, i) =>{
            let isValid = true;
            checkTicket(ticket.pos, (err, hash) => {
                if(!err && hash !== ticket.fullTicketId) isValid = false;
            });
            let startTime = new Date(ticket.movieTime);

            return (
                <Card
                    title={ticket.movieName}
                >   
                    <p>TicketId: {ticket.fullTicketId}</p>
                    <p>Class Type: {ticket.class}</p>
                    <p>Language: {ticket.language}</p>
                    <p>cinemaHallName: {ticket.cinemaHallName}</p>
                    <p>Location: {ticket.location}</p>
                    <p>Time: {startTime.toDateString()+"   "+ startTime.getHours() + ":" + startTime.getMinutes()}</p>
                    {
                        (isValid && ticket.reSale === false) ? 
                        <Button 
                            type="primary" 
                            onClick={() => {this.reSaleTicket(ticket.fullTicketId, i)}}
                        >Resale</Button> :
                        null
                    }
                </Card>
            )
        })
    };

    pageChange = (page_no, b) => {
        this.setState({page_no}, () => {
            this.props.ticketForSale(this.state.page_no);
        });
    }

    render() {
        let  { ticketCount } = this.props;

        return (
            <div style={{ background: '#fcffe6', padding: '30px' }}>
                {this.displayTickets()}
                <Pagination defaultCurrent={1} defaultPageSize={5} total={ticketCount} onChange={this.pageChange}/>
            </div>
        );
    }
}

export default Tickets;
