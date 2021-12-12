const server = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.should();
chai.use(chaiHttp);

describe("/GET Feed Data", () => {
  it("should return an array of objects", async (done) => {
    this.timeout(0);
    chai
      .request(server)
      .get("/api/feed")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.map((ele) => {
          ele.should.be.an("object");
          if (ele.keys !== undefined) {
            ele.should.have.all.keys(["name", "location", "text"]);
          }
        });
      });
  });
});
