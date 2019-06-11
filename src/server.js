
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {NODE_ENV,DATABASE_URL, PORT} = require('./config');
const {Client} = require('pg');
const parser = require('body-parser');
//const sqlinjection = require('sql-injection');


const app = express();
//app.use(sqlinjection);
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

app.post('/test',(req,res)=>{
    res.send(200);
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
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
    next();
   // res.status(500).json(response);
})


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
    client.query(`SELECT * from files WHERE username = '${req.params.user}'`,(err,res) =>
    {
        if(err) throw err;
        resApp.jsonp(res.rows);
    })
})

app.post('/files',(req,resApp) =>
{
    client.query(`SELECT MAX(gameid) FROM files`, (err,resOne) =>
    {
        console.log(err, resOne);
        if(err) throw err;
        let id = resOne.rows[0].max + 1;
        client.query(`INSERT INTO files values('${req.body.username}',NOW(),0,0,'0%',${id}, NOW());`,(err,res) =>
        {
            if(err) 
                {
                    console.log('Oh dear',err.stack);
                    throw err;
                }
                const newDeck = [1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10,1,2,3,4,5,6,7,8,9,10];
            client.query(`INSERT INTO games values(${id},0,0,0,'{0,0,0,0,0}','{0,0,0,0,0}','{${newDeck}}')`,(errOne,resOne) =>
            {
                if(errOne) throw errOne;
                resApp.jsonp("Success");
              /*  let deckTable = req.body.username + "table";
                client.query(`CREATE TABLE ${deckTable} AS TABLE deckoriginal;`,(errTwo,result) =>
                {
                    if(errTwo) throw errTwo;
                    console.log("CREATED TABLE");
                    resApp.jsonp("Success");
                })
                */
            })
            

        })

    })
})

app.put('/files/:user',(req,resApp) =>
{
   // if(!req.body.didWin)
   // {
        client.query(`SELECT * from files where username ='${req.body.username}';`,(err, resOne) =>
        {
            if(err) throw err;
            let totalGames = resOne.rows[0]['total-games'] + 1;
            let totalWins = resOne.rows[0]['total-wins'];
            if(req.body.didWin)
                totalWins++;
            let winlose = Math.floor(totalWins / totalGames * 100);
            winlose = winlose.toString() + "%";
            client.query(`UPDATE files SET "total-games" = ${totalGames}, "total-wins" = ${totalWins}, "win-lose" = '${winlose}' where username = '${req.body.username}'`, (errTwo,resTwo) =>
            {
                if(errTwo) throw errTwo;
                resApp.jsonp("success");
            })

        })
   // }
    //client.query(`UPDATE files SET `)

})


app.delete('/user/:name',(req,resApp) =>
{
    let deckTable = req.params.name + "table";
    //console.log(req.params);
    // first delete deck and game
    client.query(`DELETE from games where gameid = (SELECT gameid from files where username = '${req.params.name}')`,(err) => 
    {
        if(err) throw err;
        client.query(`DELETE from files where username = '${req.params.name}'`,(errTwo) => 
        {
            if(errTwo) throw errTwo;
            resApp.jsonp("deleted");
        });
    
    });
     
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

    let round = req.body.round + 1;
    let playerHand = req.body.playerHand.toString();
    let npcHand = req.body.npcHand.toString();
    let deck = req.body.deck.toString();
    client.query(`UPDATE games SET "player-score" = ${req.body.pscore}, "npc-score"=${req.body.nscore},"round-num"=${round}, "player-hand"='{${playerHand}}',"npc-hand"='{${npcHand}}', deck='{${deck}}'
    WHERE gameid = (SELECT gameid from files WHERE username = '${req.body.username}')`,(err,res) =>
    {
        if(err) throw err;
        resApp.jsonp("save successful");
    })
})




app.listen(PORT, () =>
{
    console.log("listening to port " + PORT);
})
