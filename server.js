
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {NODE_ENV,DATABASE_URL, PORT} = require('./config');
const {Client} = require('pg');
const parser = require('body-parser');


const app = express();
app.use(cors());

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(parser.json());

const client = new Client({
    connectionString: DATABASE_URL,
    ssl:true
})
client.connect((err) =>
{
    if(err)
    {
        console.log("AAAAAAAAAAAAAAAAAAAAAA");
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

        resApp.json(res.rows);
    })
})

app.get('/files/:user',(req,resApp) =>
{
    client.query(`SELECT * from files WHERE username = '${req.name}'`,(err,res) =>
    {
        if(err) throw err;
        resApp.jsonp(res.rows);
    })
})

app.post('/files',(req,resApp) =>
{
    client.query(`SELECT MAX(gameid) FROM files`, (err,resOne) =>
    {
        if(err) throw err;
        let id = resOne.rows[0].max + 1;
        client.query(`INSERT INTO files values('${req.body.username}',NOW(),0,0,'0%',${id});`,(err,res) =>
        {
            if(err) 
                {
                    console.log('HI',err.stack);
                    throw err;
                }
            
        })
        client.query(`INSERT INTO games values(${id},0,0,0)`)
        let deckTable = req.body.username + "table";
        client.query(`CREATE TABLE ${deckTable} AS TABLE deckoriginal;`,(err,result) =>
        {
            if(err) throw err;
        })
    })
   
})

app.put('/files/:user',(req,resApp) =>
{
    console.log(req.body,"HI");
    if(!req.body.didWin)
    {
        
    }
    //client.query(`UPDATE files SET `)

})


app.delete('/user/:name',(req,resApp) =>
{
    let deckTable = req.params.name + "table";
    //console.log(req.params);
    // first delete deck and game
    client.query(`DELETE from games where gameid = (SELECT gameid from files where username = '${req.params.name}')`,(err) => {if(err) throw err;});
    client.query(`DROP TABLE IF EXISTS ${deckTable}`,(err) => {if(err) throw err;});
    client.query(`DELETE from files where username = '${req.params.name}'`,(err) => {if(err) throw err;});
    
})

app.get('/games/:user',(req,resApp) =>
{
    client.query(`SELECT * from games WHERE gameid = (SELECT gameid FROM files where username = '${req.params.user}')`, (err,res) =>
    {
        if(err) throw err;
        resApp.jsonp(res.rows[0]);
    })
})



app.get('/games',(req,resApp) =>
{
    //client.connect();
    client.query("SELECT * from games;", (err,res) =>
    {
        if(err) throw err;

        resApp.json(res.rows);
    })
})

app.put('/games/:user',(req,resApp) =>
{
    console.log(req.body);
    client.query(`UPDATE games SET "player-score" = ${req.body.pscore}, "npc-score"=${req.body.nscore},"round-num"=${req.body.round}
    WHERE gameid = (SELECT gameid from files WHERE username = '${req.body.username}')`,(err,res) =>
    {
        if(err) throw err;

        console.log("SAVE SUCCESSFUL");
    })
})


app.get('/deck/:user',(req,resApp) =>
{
    let deckTable = req.params.user + "table";
    client.query(`SELECT * FROM ${deckTable}`, (err,res) =>
    {
        if(err) throw err;
        resApp.jsonp(res.rows);
    });

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


app.listen(PORT, () =>
{
    console.log("listening to port " + PORT);
})
