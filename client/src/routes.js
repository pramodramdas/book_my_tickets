import React from 'react';
import { BrowserRouter, Route, Router } from 'react-router-dom';
import axios from "axios";
import store from "./utils/store";
import App from './App';
import history from "./components/common/history";
// const getConfirmation = (message, callback) => {
//     verify_token();
//     callback(true);
// }

// axios.interceptors.response.use(
//     response => {
//         return response;
//     }, error => {
//         if (error.response && error.response.status === 403) {
            
//         }
//     }
// );

const Routes = () => {
    //<BrowserRouter getUserConfirmation={getConfirmation}>
    return (
        <Router history={history}>
            <Route path="/" component={App} />
        </Router>
    );
};

export default Routes;