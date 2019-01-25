const { add_cinema_hall, add_show } = require('../server_controllers/admin_controller');
const { getMovieList, getShows, setMoviePrice, getDropDownList, getCinemaByLocation, getMoviesByFilter } = require('../server_controllers/movie_controller');
const { ticketSold, getTicketsByUser, getResaleTicketList } = require('../server_controllers/ticket_controller');

module.exports = (app) => {
    app.post('/addcinemahall', add_cinema_hall);
    app.post('/addshow', add_show);
    app.get('/getMoviesFiltered', getMovieList);
    app.get('/getShows', getShows);
    app.post('/setMoviePrice', setMoviePrice);
    app.post('/ticketSold', ticketSold);
    app.get('/getTicketsByUser', getTicketsByUser);
    app.get('/getResaleTicketList', getResaleTicketList);
    app.get('/getDropDownList', getDropDownList);
    app.get('/getMoviesByFilter', getMoviesByFilter);
    app.get('/getCinemaByLocation', getCinemaByLocation);
}