const chai = require("chai");
const chaiHttp = require("chai-http");
let app = require("../src/server");

chai.use(chaiHttp);
chai.should();

describe("files endpoints",()=>
{
    describe("GET",()=>
    {
        it("get all files",(done)=>
        {
            chai.request(app).get('/')
            .end((err,res)=>
            {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            })
        });

        it("get file by username",(done)=>
        {
            chai.request(app).get('/files/:user').send("click")
            .end((err,res)=>
            {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            })
        })
    })

    describe("POST/PUT/DELETE",()=>
    {
        it("post new file by username",(done)=>
        {
            chai.request(app).post('/files').set('content-type','application/json').send({"username":"NewUser"})
            .end((err,res)=>
            {
                res.should.have.status(200);
                done();
            })
        })

        it("puts new data into a file. If the file does not exist, it should not crash",(done)=>
        {
            chai.request(app).put('/files/:user').set('content-type','application/json').send({"username":"click","didwin":true})
            .end((err,res)=>
            {
                res.should.have.status(200);
                done();
            })
        })

        it("deletes a file by username",(done)=>
        {
            chai.request(app).delete('/files/:name').send("click")
            .end((err,res)=>
            {
                res.should.have.status(200);
                done();
            })
        })
    });
});