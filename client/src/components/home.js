import React, { Component } from "react";
import FilterSearch from "./common/filter_search";
import MovieList from "./movie/movie_list";

class Home extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<FilterSearch />
				<MovieList />
			</div>
		);
	}
}

export default Home;
