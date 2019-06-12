const express = require('express');
const client = require('./client');

let routerFiles = express.Router();

routerFiles.use(function(req,res,next)
{
    console.log("connecting file routes...");
    next();
});

// returns all file entrys in database.
routerFiles.get('/files',(req,resApp) =>
{
    client.query("SELECT * from files;", (err,res) =>
    {
        if(err) throw err;

        resApp.json(res.rows);
    })
})

// returns file entry specified by username in url
routerFiles.get('/files/:user',(req,resApp) =>
{
    client.query(`SELECT * from files WHERE username = '${req.params.user}'`,(err,res) =>
    {
        if(err) throw err;
        resApp.jsonp(res.rows);
    })
})

// creates a new file entry and game entry for said file using username
routerFiles.post('/files',(req,resApp) =>
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

            })
            

        })

    })
})

// updates stats in a file entry by username
routerFiles.put('/files/:user',(req,resApp) =>
{

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
})

// deletes a file entry and its respective game entry
routerFiles.delete('/files/:name',(req,resApp) =>
{
    let deckTable = req.params.name + "table";
    //  delete deck and game
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

module.exports = routerFiles;