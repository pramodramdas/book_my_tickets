import React, { Component } from "react";
import { connect } from "react-redux";
import { Card } from "antd";
import { setCurrentMovie } from "../../actions/movies";

class MovieList extends Component {

	constructor(props) {
		super(props);
		this.clickAction = this.clickAction.bind(this);
	}

	clickAction(movie) {
		this.props.setCurrentMovie(movie);
	}

	render() {
		return (
			<div>
				<Card style={movieStyle}>
					{
						this.props.movie_list.map((movie, i) => {
							let image_url = "https://loremflickr.com/800/240/"+movie.movieName+"/all?lock="+i+"";

							return(
								<Card
									title={movie.movieName}
									style={{ width: "100%" }}
									onClick={()=>{this.clickAction(movie)}}
									cover={<img alt="example" src={image_url} />}
								>
									<h3>{movie.language}</h3>
								</Card>
							) 
						})
					}
				</Card>
			</div>
		);
	}
}

const movieStyle = {
	"display": "flex",
	"flexDirection": "row",
	"justifyContent": "center"
}

const mapStateToProps = (state) => {
    return {
        movie_list: state.movies.movie_list
    }
}
//export default MovieList;
export default connect(mapStateToProps,{setCurrentMovie})(MovieList)