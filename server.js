require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const { init_web3 } = require('./server_utils/web3-util.js');
const { solidityEvents } = require('./server_controllers/event_controller');

init_web3();

setTimeout(()=>{solidityEvents()},10000);

mongoose.Promise = Promise;
const app = express();
// console.log(path.join(path.join(__dirname,"client","build")));
// app.use(express.static(__dirname+"/client"+"/build"));

app.use(cors());
//app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

const mongoUrl = process.env.DB_URL ? process.env.DB_URL : 'mongodb://localhost/bookmytickets';

mongoose.connect(mongoUrl, { useNewUrlParser: true });
mongoose.connection
.once('open',() => {
    require('./routes/api-routes')(app);
    app.get("*", (req, res) => {
        console.log(path.join(__dirname,'client','build','index.html'));
        res.sendFile(__dirname+"/client/build/index.html")
    });
})
.on('error', (error) => {
    console.warn('Error', error);
});

app.listen(9090, () => console.log("server up and listening at 9090"));

module.exports = app;