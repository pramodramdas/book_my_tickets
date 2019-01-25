import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from "react-redux";
//import {Router, browserHistory} from "react-router";
import store from "./utils/store";
import Routes from "./routes";
//import registerServiceWorker from './registerServiceWorker';


//ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
    <Provider store={store}>
        <Routes/>
    </Provider>,
    document.getElementById('root')
);
//registerServiceWorker();
