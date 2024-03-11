import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Sessions testing", function () {
  before(function () {
    this.cookie = {};
    this.user = {
      email: `prueba${Date.now() / 1000}@gmail.com`,
      password: "ola1234",
    };
  });
  it("Should register a new user", async function () {
    const userMock = {
      first_name: "Prueba",
      last_name: `${Date.now() / 1000}`,
      email: this.user.email,
      password: this.user.password,
      age: 21,
    };
    const { statusCode, ok } = await requester
      .post("/api/sessions/register")
      .send(userMock);
    expect(statusCode).to.be.equal(302);
    expect(ok).to.be.not.ok;
  });
});
