import {combineReducers} from "redux";
import global_vars from "./global_vars";
import movies from "./movies";

const rootReducer = combineReducers({
    global_vars,
    movies
});

export default rootReducer;