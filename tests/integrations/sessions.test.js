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

  it("Should login as user", async function () {
    const userMock = {
      email: this.user.email,
      password: this.user.password,
    };
    const { headers, statusCode, ok } = await requester
      .post("/api/sessions/login")
      .send(userMock)
      .redirects(0);

    expect(statusCode).to.be.equal(302);
    expect(ok).to.be.not.ok;

    const [key, value] = headers["set-cookie"][0].split("=");
    this.cookie.key = key;
    this.cookie.value = value;
  });

  it("Should obtain user's info", async function () {
    const { statusCode, ok, _body } = await requester
      .get("/api/sessions/me")
      .set("Cookie", [`${this.cookie.key}=${this.cookie.value}`]);
    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.ok;
    expect(_body).to.be.has.property("_id");
    expect(_body).to.be.has.property("role");
    expect(_body).to.be.has.property("email", this.user.email);
  });
});
