
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {NODE_ENV, PORT} = require('../config');
const parser = require('body-parser');
let client = require('./client');
let fileRoutes = require('./fileRoutes');
let gameRoutes = require('./gameRoutes');
//const sqlinjection = require('sql-injection');


const app = express();
app.use(cors());

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(parser.json());


app.use(function errorHandler(error,req,res,next)
{
    let response;
    if(NODE_ENV === 'production')
    {
        response = {error: {message: 'server error'}}
    }
    else
    {
        console.error(error);
        response = {message: error.message, error};
    }
    res.status(500).json(response);
})

app.use('/',fileRoutes);
app.use('/',gameRoutes);

// basic endpoint to test if the server is up
app.get('/', (req,res) =>
{
    res.send('files for users, games for games');
})


app.listen(PORT, () =>
{
    console.log("listening to port " + PORT);
})

module.exports = app;