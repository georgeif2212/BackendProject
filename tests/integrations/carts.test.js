import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Testing carts router", function () {
  before(async function () {
    this.cartToDelete;
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

  it("POST: Should create a new cart", async function () {
    const { statusCode, ok, _body } = await requester.post("/api/carts");
    expect(statusCode).to.be.equal(201);
    expect(ok).to.be.ok;
    expect(_body).to.be.has.property("_id");
    expect(_body).to.be.has.property("products");
    expect(_body.products).to.be.an("array");
    this.cartToDelete = _body;
  });

  it("GET: Should get a cart by identifier", async function () {
    const { statusCode, ok, _body } = await requester.get(
      `/api/carts/${this.cartToDelete._id}`
    );
    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.ok;
    expect(_body).to.be.has.property("id");
    expect(_body).to.be.has.property("products");
    expect(_body.products).to.be.an("array");
  });

  it("POST: Should add to cartId the quantity of productId", async function () {
    const quantity = {
      quantity: 3,
    };
    const { statusCode, ok, _body } = await requester
      .post(
        `/api/carts/${this.cartToDelete._id}/products/65ea77e1346a5813231a8a62`
      )
      .send(quantity)
      .set("Cookie", [`${this.cookie.key}=${this.cookie.value}`]);

    console.log(statusCode, ok, _body);
    expect(statusCode).to.be.equal(201);
    expect(ok).to.be.ok;
    expect(_body).to.be.has.property("_id");
    expect(_body).to.be.has.property("products");
    expect(_body.products).to.be.an("array");
    _body.products.forEach((element) => {
      expect(element).to.have.property("product", "65ea77e1346a5813231a8a62");
      expect(element).to.have.property("quantity", 3);
    });
  });
});
