import React, { Component } from "react";
import { connect } from "react-redux";
import createKeccakHash from "keccak";
import { Modal, Checkbox, message, DatePicker, Button, Card, Radio, Tag } from "antd";
import { buyTicket, setCurrentLocation, getShows } from "../../actions/movies";
import moment from "moment";

const RadioGroup = Radio.Group;

class Cinemas extends Component {
	
	constructor(props) {
		super(props);
		this.getAllCimemas = this.getAllCimemas.bind(this);
		this.getSeats = this.getSeats.bind(this);
		this.checkedList = {};
	}
	
	state = {
		visible: false,
		seatsIndex: -1,
		cIndex: -1,
		value:1,
		endOfSelectDate: new Date(moment().add(7,'days').unix() * 1000).setHours(0,0,0,0)
	}

	componentWillMount = () => {
		if(this.props.match.params.location)
			this.props.setCurrentLocation(this.props.match.params.location);
	}

	componentDidMount = () => {
		let { movie, match } = this.props;
		if((!movie.shows || (movie.shows && movie.shows.length === 0)) && match.params.movieId)
			this.props.getShows(this.props.match.params.movieId, this.state.endOfSelectDate);
	}

	onChange = (checkedList) => {
		this.setState({value:checkedList.target.value});
		this.checkedList[checkedList.target.id] = checkedList.target.value;
	}

	getSeats() {
		let fullseats = [];

		if(this.state.seatsIndex > -1) {
			let { shows, sold_tickets } = this.props.movie;
			let allIds = (sold_tickets && sold_tickets.length > 0) ? sold_tickets[0].allIds : [];
			let { classType } = shows[this.state.cIndex].show_details[this.state.seatsIndex];
			shows[this.state.cIndex]
			.show_details[this.state.seatsIndex]
			.showInfo.map((s) => {				
				if(s.classType !== classType) return;
				let seats = [];
				seats.push(<Tag color="green">{s.classType}</Tag>);
				const cID = shows[this.state.cIndex]["_id"] //cinemahall
				const location = shows[this.state.cIndex].cinema_hall[0].cLocation; //location
				const language = shows[this.state.cIndex].movie_info[0].language;
				const movieName = shows[this.state.cIndex].movie_info[0].movieName; //moviename
				const movieTime = shows[this.state.cIndex].show_details[this.state.seatsIndex].startTime; //movieTime
				
				for(let i = s.start; i <= s.end; i++) {
					const fullMovieString = movieName + cID + movieTime + location + language + i;
					const fullMovieHash = '0x'+createKeccakHash('keccak256').update(fullMovieString).digest('hex');
					let disabled = false;
					//seatNumber + class
					if(allIds.indexOf(fullMovieHash) > -1) 
						seats.push(<Radio id={i +"-"+ s.classType} value={i +"-"+ s.classType} disabled>{i}</Radio>);// onChange={this.onChange.bind(this)}/>);
					else
						seats.push(<Radio id={i +"-"+ s.classType} value={i +"-"+ s.classType}>{i}</Radio>);// onChange={this.onChange.bind(this)}/>);
					// seats.push(i +"-"+ s.classType);
				}
				
				fullseats = fullseats.concat(seats);
				fullseats.push(<br/>);
				fullseats.push(<br/>);
			});
			
		}
		return fullseats;
		//return <CheckboxGroup options={fullseats} value={this.state.checkedList} onChange={this.onChange} />;
	}

	getAllCimemas() {
		return this.props.movie.shows && this.props.movie.shows.map((cinema, cIndex) => {
			let title = "cinema hall: "+cinema.cinema_hall[0].cName;
			return (
				<div style={{textAlign:"left"}}>
					<Card 
						title={title}
						bordered={false}
					>
						{
							cinema.show_details.map((show, seatsIndex) => {
								
								let startTime = new Date(show.startTime);
								return (
									<Button type="dashed" style={{color:"green"}} onClick={() => {this.setState({seatsIndex,cIndex,visible:true})}}>
										<Tag color="lime">{show.classType}</Tag>{startTime.toDateString()+"   "+ startTime.getHours() + ":" + startTime.getMinutes()}
									</Button>
								);
							})
						}
					</Card>
				</div>
			);
		});
	}

	handleOk(val){
		buyTicket(this.checkedList, this.props.movie, this.state, (tx) => {
			if(tx)message.success("success");
			else message.error("error");
			this.props.getShows(this.props.match.params.movieId, this.state.endOfSelectDate);
			this.checkedList = {};
			this.setState({visible: false});
		});
	}

	handleCancel = () => {
		this.checkedList = {};
		this.setState({visible: false});
	}

	onDateChange = (date, dateString) => {
		this.setState({endOfSelectDate:new Date(moment(date).add(1,'days').unix() * 1000).setHours(0,0,0,0)}, () => {
			this.props.getShows(this.props.match.params.movieId, this.state.endOfSelectDate);
		});
	}
	  
	render() {
		return (
			<div>
				<DatePicker onChange={this.onDateChange} /><br/><br/>
				{this.getAllCimemas()}
				<Modal title="select seatings"
					visible={this.state.visible}
					onOk={this.handleOk.bind(this)}
					onCancel={this.handleCancel}
				>
					{
						this.state.visible ? 
						<RadioGroup onChange={this.onChange} value={this.state.value}>
							{this.getSeats()}
						</RadioGroup>
						: null}
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		movie: state.movies.movie
	}
}

export default connect(mapStateToProps, {getShows, setCurrentLocation})(Cinemas);
