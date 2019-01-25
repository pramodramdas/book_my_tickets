import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Card, Icon, Button, Spin } from 'antd';
import { getShows, getMoviesByMovieId, setCurrentLocation } from "../../actions/movies";
import history from "../common/history";

const { Content } = Layout;

class Movie extends Component {

	constructor(props) {
		super(props);
	}

	state = {
		movie:{},
		coverVisible: false,
		avatarVisible: false
	}

	componentWillMount = () => {
		if(this.props.match.params.location)
			this.props.setCurrentLocation(this.props.match.params.location);
	}

	componentDidMount = async () => {
		let { movieId } = this.props.movie;
		
		if(!movieId && this.props.match.params.movieId) {
			movieId = this.props.match.params.movieId;
			getMoviesByMovieId(movieId, (movie) => {
				if(movie[0])
					this.setState({movie:movie[0]});
			});
		}
		else this.setState({movie: this.props.movie});
		
		this.props.getShows(movieId);
	};

	handleImageLoaded = (key) => {
		this.setState({[key]:true});
	}

  	render() {
		let { movieId, movieName, language, year, votes, genre, synopsis} = this.state.movie//this.props.movie;
		let { coverVisible, avatarVisible } = this.state;
		let { location } = this.props.match.params;
		let avitarUrl = "https://loremflickr.com/400/400/"+movieName+"/all";
		let coverUrl = "https://loremflickr.com/"+window.screen.width+"/400/"+movieName+"/all";

		return (
			<div style={movieStyle}>
				<div style={{width:"100%", height:"30%"}}>
					<img src={coverUrl} onLoad={this.handleImageLoaded.bind(this, "coverVisible")}/>
					{ !coverVisible ? <Spin style={{width:"100%", height:"100%"}} size="large" /> : null}
				</div>
				<div style={{height:"70%"}}>
					<Layout style={{display:"flex", flexDirection:"row"}}>
						<div style={{width:"30%", marginTop:"-180px", marginLeft:"33px"}}>
							<img src={avitarUrl} onLoad={this.handleImageLoaded.bind(this, "avatarVisible")} />
							{ !avatarVisible ? <Spin style={{width:"100%", height:"100%"}} size="large" /> : null}
						</div>
						<div style={{width:"65%", textAlign:"left"}}>
							<Content>
									<Card
										title={<h2>{movieName}</h2>}
										style={{ width: "100%" }}
									>
										<h4>language : {language}</h4>
										<h4>year : {year}</h4>
										<h4>genre : {genre}</h4>
										<h4>synopsis : {synopsis}</h4>
										<Icon type="heart" theme="outlined" style={{color:"red", fontSize:"20px"}} /> {votes}% <br/><br/><br/>
										<Button type="primary" onClick={()=>{history.push('/cinemas/'+movieId+'/'+location);}}>Book</Button>
									</Card>
							</Content>
						</div>
					</Layout>
				</div>
			</div>
		);
  	}
}

const movieStyle = {
	display: "flex",
	flexDirection: "column"
}

const mapStateToProps = (state) => {
	return {
		movie: state.movies.movie
	}
}

export default connect(mapStateToProps, {getShows, setCurrentLocation})(Movie);
