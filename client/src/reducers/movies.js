import { SET_MOVIE_LIST, SET_MOVIE, SET_SHOWS, SET_SOLD_TICKETS, SET_LOCATION } from "../actions/types";

const INITIAL_STATE = {
    movie_list: [],
    movie: {}
}

export default (state = INITIAL_STATE, action = {}) => {
    switch (action.type) {
        case SET_MOVIE_LIST: 
            return {
                ...state,
                movie_list: action.movie_list
            }
        case SET_MOVIE:
            return {
                ...state,
                movie:action.movie
            }
        case SET_SHOWS:
            return  {
                ...state,
                movie: {...state.movie, shows:action.shows}
            }
        case SET_SOLD_TICKETS:
            return {
                ...state,
                movie: {...state.movie, sold_tickets:action.sold_tickets}
            }
        case SET_LOCATION:
            return {
                ...state,
                location: action.location
            }
        default:
            return state;
    }
}