import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Testing products router", function () {
  it("GET: Should get list of products", async function () {
    const { statusCode, ok, _body } = await requester
        .get('/api/products')
    expect(statusCode).to.be.equal(200)
    expect(ok).to.be.ok;
    expect(_body).to.be.has.property('status', 'success');
    expect(_body).to.be.has.property('payload');
  });
});
