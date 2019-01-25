import axios from "axios";
import createKeccakHash from "keccak";
import { SET_MOVIE_LIST, SET_MOVIE, SET_SHOWS, SET_SOLD_TICKETS, SET_LOCATION } from "./types";
import server_config from "../config/config";
import history from "../components/common/history";
import store from "../utils/store";

function setMovieList(content) {
    return {
        type: SET_MOVIE_LIST,
        movie_list: content
    }
}

function setMovie(content) {
    return {
        type: SET_MOVIE,
        movie: content
    }
}

function setShows(content) {
    return {
        type: SET_SHOWS,
        shows: content
    }
}

function setSoldShows(content) {
    return {
        type: SET_SOLD_TICKETS,
        sold_tickets: content
    }
}

function setLocation(content) {
    return {
        type: SET_LOCATION,
        location: content
    }
}

export const getMovieList = (that) => {
    let { movie_name, language, location, page_no } = that.state;
    let url = server_config["server"]+"/getMoviesFiltered?location="+location;
    if(movie_name) url = url + '&movieName='+movie_name.toLowerCase();
    if(language) url = url + '&language='+language;

    url = url + '&page_no='+page_no;

    return (dispatch) => {
        axios.get(url).then(response => {
    	    if(response.status === 200 && response.data && response.data.success){
                dispatch(setMovieList(response.data.result));
                if(response.data.result.length === 0 && page_no > 1)
                    that.setState({page_no: page_no - 1});
            }
        });
    }
}

export const setCurrentMovie = (movie) => {
    let { location } = store.getState().movies;
    let { movieId } = movie;
    return (dispatch) => {
        dispatch(setMovie(movie));
        history.push("/movie/"+movieId+"/"+location);
    }
}

export const setCurrentLocation = (city) => {
    return (dispatch) => {
        dispatch(setLocation(city));
    }
}

export const getDropDownList = (type, callback) => {
    axios.get(server_config["server"]+"/getDropDownList?type="+type).then(response => { 
        if(response.data && response.data.success && response.data.result[0]&& response.data.result[0][type])
            callback(response.data.result[0][type])
        else
            callback([])
    }).catch((err) => {
        console.log(err);
        callback([])
    });
}

export const getShows = (movieId, endOfSelectDate) => {
    let { location } = store.getState().movies;
    let url = server_config["server"]+"/getShows?location="+location+"&movieId="+movieId+"&endDate="+endOfSelectDate;

    return (dispatch) => {
        axios.get(url).then(response => {
    	    if(response.status === 200 && response.data && response.data.success){
                dispatch(setShows(response.data.result.showResult));
                dispatch(setSoldShows(response.data.result.ticketsSold));
            }
        });
    }
}

export const getShowsByCID = (movieId, cID, location, callback) => {
    let url = server_config["server"]+"/getShows?location="+location+"&movieId="+movieId+"&cID="+cID;
    axios.get(url).then(response => { 
        if(response && response.data && response.data.success)
            callback(response.data.result.showResult);
        else
            callback([]);
    }).catch((err) =>{
        console.log(err);
        callback([]);
    });
}

export const buyTicket = async (checkList, movieData, localState, callback) => {
    let movieInfo = movieData.shows[localState.cIndex];
    let seats = Object.keys(checkList);
    let seatsToBook;
    let { contract, web3 } = store.getState().global_vars;
    //TODO: first map price for each class in shows table
    if(checkList[seats[0]]) //currently only checking for single seat booking
        seatsToBook = seats[0].split("-");
    const cID = movieInfo["_id"] //cinemahall
    const location = movieInfo.cinema_hall[0].cLocation; //location
    const seatNo = seatsToBook[0]; //seatNo
    const classType = seatsToBook[1]; //class
    const language = movieData.language || movieData.shows[0].movie_info[0].language; //language
    const movieName = movieData.movieName || movieData.shows[0].movie_info[0].movieName; //moviename
    const movieTime = movieInfo.show_details[localState.seatsIndex].startTime; //movieTime

    //moviename+cinemalHall+time+location+language hash
    //class hash
    if(contract) {
        try {
            const partialMovieInfo = movieName + cID + movieTime + location + language;
            const fullMovieInfo = movieName + cID + movieTime + location + language + seatNo;
            const partialMovieHash = createKeccakHash('keccak256').update(partialMovieInfo).digest('hex');
            const resultTx = await contract.buyTicket
            .sendTransaction('0x'+partialMovieHash, fullMovieInfo, movieName, language, location, classType, movieTime, {"from":web3.eth.defaultAccount, gas: 6000000, "value":price});
            console.log(resultTx);
            const soldResponse = axios.post(
                server_config["server"]+"/ticketSold", 
                {
                    partialMovieHash,
                    fullMovieInfo,
                    movieName,
                    movieTime,
                    location,
                    language,
                    classType,
                    sender:web3.eth.defaultAccount
                }
            );
            callback(resultTx);
        } catch(err) {
            console.log(err);
            callback(false);
        }
    }
}

export async function getMoviesByMovieId(movieId, callback) {
    if(!movieId) 
        callback([]);
    else {
        try {
            let response = await axios.get(server_config["server"]+"/getMoviesByFilter?movieId="+movieId);
            if(response && response.data && response.data.success)
                callback(response.data["movies"]);
            else
                callback([]);
        } catch(err) {
            console.log(err);
            callback([]);
        }
    }
}