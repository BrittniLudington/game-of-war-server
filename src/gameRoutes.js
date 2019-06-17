const express = require('express');
const client = require('./client');

let gameRoutes = express.Router();


// get current game entry related to user
gameRoutes.get('/games/:user',(req,resApp) =>
{
    let unfilteredName = req.params.user;
    let filteredName = unfilteredName.replace(/[^a-zA-Z0-9_\-]/g, "");
    client.query(`SELECT * from games WHERE gameid = (SELECT gameid FROM files where username = '${filteredName}')`, (err,res) =>
    {
        if(err) throw err;
        resApp.jsonp(res.rows[0]);
    })
})


// get all game entrys
gameRoutes.get('/games',(req,resApp) =>
{
    //client.connect();
    client.query("SELECT * from games;", (err,res) =>
    {
        if(err) throw err;

        resApp.json(res.rows);
    })
})

// update a game entry for a specified user
gameRoutes.put('/games/:user',(req,resApp) =>
{
    let unfilteredName = req.body.username;
    let filteredName = unfilteredName.replace(/[^a-zA-Z0-9_\-]/g, "");
    let round = req.body.round + 1;
    let playerHand = req.body.playerHand.toString();
    let npcHand = req.body.npcHand.toString();
    let deck = req.body.deck.toString();
    client.query(`UPDATE games SET "player-score" = ${req.body.pscore}, "npc-score"=${req.body.nscore},"round-num"=${round}, "player-hand"='{${playerHand}}',"npc-hand"='{${npcHand}}', deck='{${deck}}'
    WHERE gameid = (SELECT gameid from files WHERE username = '${filteredName}')`,(err,res) =>
    {
        if(err) throw err;
        resApp.jsonp("save successful");
    })
})

module.exports = gameRoutes;
