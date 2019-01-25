import React, { Component } from "react";
import { Input, Menu, Dropdown, Icon, Button } from "antd";
import { getMovieList, getDropDownList } from "../../actions/movies";
import { connect } from "react-redux";
import { setCurrentLocation } from "../../actions/movies";

const DEFAULT_LOCATION = 'bangalore';
const DEFAULT_LANGUAGE = 'english';

class FilterSearch extends Component {
    
    constructor(props) {
        super(props);
        this.props.setCurrentLocation(DEFAULT_LOCATION);
        this.getMenus = this.getMenus.bind(this);
    }

    state = {
        movie_name: '',
        page_no:1,
        language: DEFAULT_LANGUAGE,
        location: DEFAULT_LOCATION,
        locations: [],
        languages: []
    };

    componentDidMount() {
        getDropDownList('language', (languages) => {
            if(languages.length > 0)
                this.setState({languages});
        });
        getDropDownList('city', (citys) => {
            if(citys.length > 0)
                this.setState({locations:citys});
        });
        this.props.getMovieList(this);
    }

    selectDropdown(target,item,e) {
        this.setState({[item]:this.state[target][parseInt(e.key)]});
        if(item === 'location') this.props.setCurrentLocation(this.state[target][parseInt(e.key)]);
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

    getPaginatedMovieList = (op, e) => {
        let { page_no } = this.state;

        if(!isNaN(op)) {
            if(page_no + op < 1) page_no = 1;
            else page_no = page_no + op;

            this.setState({page_no}, () => {
                this.props.getMovieList(this);
            });
        }
    }

    render() {
        return (
            <div style={filterStyle}>
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
                <Input  placeholder="movie name" style={{ width: 200 }} value={this.state.movie_name} onChange={(e) => this.setState({movie_name:e.target.value})}/>
                &nbsp;&nbsp;
                <Button type="primary" onClick={this.getPaginatedMovieList.bind(this, 0)}>Search</Button>
                &nbsp;&nbsp;
                <Button onClick={this.getPaginatedMovieList.bind(this, -1)}>PREVIOUS</Button>
                &nbsp;&nbsp;
                <Button onClick={this.getPaginatedMovieList.bind(this, 1)}>NEXT</Button>
            </div>
        );
    }
}
//<input type="submit" value="Search" onClick={this.getPaginatedMovieList.bind(this, 0)}/>
const filterStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding:"20px"
}

export default connect(null,{getMovieList, setCurrentLocation})(FilterSearch);
