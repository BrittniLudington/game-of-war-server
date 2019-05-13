require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {NODE_ENV,DATABASE_URL} = require('./config');
const {Client} = require('pg');
const parser = require('body-parser');


const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());
app.use(parser.json());

const client = new Client({
    connectionString: DATABASE_URL,
    ssl: true
})
client.connect((err) =>
{
    if(err)
    {
        console.log(err);
    }
});

app.get('/', (req,res) =>
{
    res.send('files for users, games for games');
})

app.get('/files',(req,resApp) =>
{
    //client.connect();
    client.query("SELECT * from files;", (err,res) =>
    {
        if(err) throw err;
        for(let row of res.rows)
        {
            console.log(JSON.stringify(row));
        }
        resApp.json(res.rows);
    })
})

app.post('/files',(req,resApp) =>
{
    client.query(`INSERT INTO files values(${req.body.username},${req.body.date},0,0,0%,null)`,(err,res) =>
    {
        if(err) 
            {
                console.log(err.stack);
                throw err;
            }
        
    });
})



app.get('/games',(req,resApp) =>
{
    //client.connect();
    client.query("SELECT * from games;", (err,res) =>
    {
        if(err) throw err;
        for(let row of res.rows)
        {
            console.log(JSON.stringify(row));
        }
        resApp.json(res.rows);
    })
})

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

module.exports = app;
