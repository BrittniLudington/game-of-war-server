const chai = require("chai");
const chaiHttp = require("chai-http");
let app = require("../src/server");

chai.use(chaiHttp);
chai.should();

describe("game endpoints",()=>
{
    describe("GET",()=>
    {
        it("get all game entries",(done)=>
        {
            chai.request(app).get("/games")
            .end((err,res)=>
            {
                res.should.have.status(200);
                res.body.should.be.a("array");
                done();
            })
        })

        it("get game by username",(done)=>
        {
            chai.request(app).get("/games/:user").send("click")
            .end((err,res)=>
            {
                res.should.have.status(200);
                done();
            })
        })
    })

    describe("PUT",()=>
    {
        it("put info into a game entry by username",(done)=>
        {
            chai.request(app).put("/games/:user").set('content-type','application/json').send(
                {"username":"click",
                "round":1,
                "playerHand":[0,1,2,3,4],
                "npcHand":[4,5,6,7,8],
                "deck":[2,5,2,1,8,3],
                "pscore":5,
                "nscore":0})
                .end((err,res)=>
                {
                    res.should.have.status(200);
                    done();
                })
        })
    })
})