import React, { Component } from "react";
import { connect } from "react-redux";
import { Select, List, Button, Tag } from "antd";
import { getDropDownList, getShowsByCID } from "../actions/movies";
import { getMoviesByLanguageYear, getCinemaByLocation } from "../actions/admin";
import MoviePrice from "./others/movie_price";

const Option = Select.Option;
const  MAX_YEAR = new Date().getFullYear();
const MIN_YEAR = MAX_YEAR - 10;

class Admin extends Component {

    state = {
        movies:[],
        cinemas:[],
        languages:[],
        showsInfo: "",
        years:[],
        citys:[],
        city:"",
        language:"",
        movie:"",
        cinema:"",
        year:MAX_YEAR
    }

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.getMenus = this.getMenus.bind(this);
        this.getShowsByCID = this.getShowsByCID.bind(this);
    }

    componentDidMount() {
        let years = []; 
        for(let i = MAX_YEAR; i >= MIN_YEAR; i--) 
            years.push(i);

        this.setState({years});

        getDropDownList('language', (languages) => {
            if(languages.length > 0)
                this.setState({languages, language:languages[0]});
        });
        getDropDownList('city', (citys) => {
            if(citys.length > 0)
                this.setState({citys, city:citys[0]});
        });
    }

    onTextChange = (key, eve) => {
        eve.preventDefault();
        if(eve && eve.target)
            this.setState({[key]: eve.target.value.trim()});
    }

    handleChange(key, value) {
        this.setState({[key]: value}, () => {
            let { year, language, city } = this.state;
            if((key === "year" || key === "language") && this.state.year && this.state.language) {
                getMoviesByLanguageYear(language, year, (movies) => {
                    this.setState({movies});
                });
            }
            if(key === "city") {
                getCinemaByLocation(city, (cinemas) => {
                    this.setState({cinemas});
                });
            }
        });
    }

    getMenus(target, item){
        return (
            <div>
                <Button type="dashed" style={{borderColor:"#a0d911"}}><font color="#722ed1">{item}</font></Button>
                <Select defaultValue={this.state[item]} style={{ width: 120 }} style={{ width: 120 }} onChange={this.handleChange.bind(this, item)}>
                    {
                        this.state[target].map((value) => {
                            return <Option value={value}>{value}</Option>
                        })
                    }
                </Select>
            </div>
        )
    }

    getObjectMenus(target, item, id, name) {
        return (
            <div>
                <Button type="dashed" style={{borderColor:"#a0d911"}}><font color="#722ed1">{item}</font></Button>
                <Select defaultValue={this.state[item]} style={{ width: 120 }} style={{ width: 120 }} onChange={this.handleChange.bind(this, item)}>
                    {
                        this.state[target].map((obj) => {
                            return <Option value={obj[id]}>{obj[name]}</Option>
                        })
                    }
                </Select>
            </div>
        )
    }

    getShowInfo() {
        let { showsInfo } = this.state;
        let header, data = [];

        // if(!showsInfo) return null;

        let { movie_info, cinema_hall, show_details } = showsInfo;

        if(movie_info && cinema_hall)
            header = <div style={{textAlign:"left"}}>
                    <Tag color="cyan">MovieId:</Tag><font color="#722ed1">{movie_info.movieId}</font><br/>
                    <Tag color="cyan">MovieName:</Tag><font color="#722ed1">{movie_info.movieName}</font><br/>
                    <Tag color="cyan">Year:</Tag><font color="#722ed1">{movie_info.year}</font><br/>
                    <Tag color="cyan">cinemaId:</Tag><font color="#722ed1">{cinema_hall.cID}</font><br/>
                    <Tag color="cyan">ciname hall:</Tag><font color="#722ed1">{cinema_hall.cName}</font><br/>
                    <Tag color="cyan">city:</Tag><font color="#722ed1">{cinema_hall.cLocation}</font><br/>
                    <Tag color="cyan">class:</Tag>{cinema_hall.class.map((c) => { return <font color="#722ed1">{c.classType} </font>; })}
                </div>;
        else header = <h3>Shows</h3>;

        if(show_details)
            data = show_details.map((show) => {
                let startTime = new Date(show.startTime);
                let endTime = new Date(show.endTime);
                new Date().toTimeString().split(" ")
                return "start: "+startTime.toDateString()+" "+startTime.toTimeString().split(" ")[0]+
                    " end: "+endTime.toDateString()+" "+endTime.toTimeString().split(" ")[0]
            })

        return (
            <List
                size="small"
                header={<div>{header}</div>}
                bordered
                style={{ height:"500px"}}
                dataSource={data}
                renderItem={item => (<List.Item>{item}</List.Item>)}
            />
        );
    }

    sortByStartTime(a, b) {
        return a.startTime - b.startTime;
    }

    getShowsByCID() {
        let { movie, cinema, city } = this.state;
        getShowsByCID(movie, cinema, city, (data) => {
            let showsInfo = {};
            if(data[0]) {
                if(data[0].cinema_hall && data[0].cinema_hall[0])
                    showsInfo.cinema_hall = data[0].cinema_hall[0];
                if(data[0].movie_info && data[0].movie_info[0])
                    showsInfo.movie_info = data[0].movie_info[0];
                if(data[0].show_details)
                    showsInfo.show_details = data[0].show_details.sort(this.sortByStartTime);
                this.setState({showsInfo});    
            }
        });
    }

    render() {
        return (
            <div style={{...boxStyle}}>
                <div style={{...filterStyle, justifyContent:"space-between", paddingLeft:"10px", paddingRight:"10px", paddingBottom:"10px" }}>
                    {this.getMenus("languages", "language")}
                    {this.getMenus("years", "year")}
                    {this.getObjectMenus("movies", "movie", "movieId", "movieName")}
                    {this.getMenus("citys", "city")}
                    {this.getObjectMenus("cinemas", "cinema", "cID", "cName")}
                    <Button type="primary" onClick={()=>{this.getShowsByCID()}}>Search</Button>
                </div>
                <div style={{...filterStyle, marginTop:"50px", width:"100%"}}>
                    <div style={{width:"70%"}}>{this.getShowInfo()}</div>
                    <div style={{width:"30%"}}><MoviePrice/></div>
                </div>
            </div>
        );
    }
}

const filterStyle = {
    display: "flex",
    flexDirection: "row"
}

const boxStyle = {
    display: "flex",
    flexDirection: "column"
}

const mapStateToProps = (state) => {
    return {
        global_vars: state.global_vars
    }
}

export default connect(mapStateToProps, {})(Admin);