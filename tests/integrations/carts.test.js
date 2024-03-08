import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Testing carts router", function () {
  before(async function () {
    this.cookie = {};
    const user = {
      email: "jinfante2212@gmail.com",
      password: "ola1234",
    };

    const { headers, statusCode, ok } = await requester
      .post("/api/sessions/login")
      .send(user)
      .redirects(0);

    expect(statusCode).to.be.equal(302);
    expect(ok).to.be.not.ok;

    const [key, value] = headers["set-cookie"][0].split("=");
    this.cookie.key = key;
    this.cookie.value = value;
  });

  it("GET: Should get list of carts", async function () {
    const { statusCode, ok, _body } = await requester.get("/api/carts");
    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.ok;
    expect(_body).to.be.has.property("status", "success");
    expect(_body).to.be.has.property("payload");
    expect(Array.isArray(_body.payload)).to.be.equal(true);
    expect(_body.payload).to.be.an("array");
    _body.payload.forEach((element) => {
      expect(element).to.have.property("products");
    });
  });

});
