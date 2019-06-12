const {Client} = require('pg');
const {DATABASE_URL} = require('../config');

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

module.exports = client;