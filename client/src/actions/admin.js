import axios from "axios";
import server_config from "../config/config";
import moment from "moment";
import { message } from 'antd';

export async function setMoviePrice() {
    let { sMovieId, sCID, sMovieStartTime, sMovieEndTime, sClass, sPrice } = this.state;

    if(sMovieId && sCID && sMovieStartTime && sMovieEndTime && sClass && sPrice) {
        try {
            let response = await axios
            .post(server_config["server"]+"/setMoviePrice", { 
                sMovieId, 
                sCID, 
                sMovieStartTime: moment(sMovieStartTime).unix() * 1000, 
                sMovieEndTime: moment(sMovieEndTime).unix() * 1000, 
                sClass, 
                sPrice 
            });
            if(response && response.data && response.data.success)
                message.success("show added successfully");
            else
                message.error("show add unsuccessfull"); 
        } catch(error) {
            console.log(error);
            message.error("show add unsuccessfull");
        }
    }
}

export async function getMoviesByLanguageYear(language, year, callback) {
    if(!language || !year) 
        callback([]);
    else {
        try {
            let response = await axios.get(server_config["server"]+"/getMoviesByFilter?language="+language+"&year="+year);
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

export async function getCinemaByLocation(location, callback) {
    if(!location) 
        callback([]);
    else {
        try {
            let response = await axios.get(server_config["server"]+"/getCinemaByLocation?location="+location);
            if(response && response.data && response.data.success)
                callback(response.data["cinemas"]);
            else
                callback([]);
        } catch(err) {
            console.log(err);
            callback([]);
        }
    }
}