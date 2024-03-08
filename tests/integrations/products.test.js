import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Testing products router", function () {
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

  it("GET: Should get list of products", async function () {
    const { statusCode, ok, _body } = await requester.get("/api/products");
    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.ok;
    expect(_body).to.be.has.property("status", "success");
    expect(_body).to.be.has.property("payload");
  });

  it("POST: Should create a new product", async function () {
    const productMock = {
      title: "Microondas Panasonic",
      description:
        "Microondas con capacidad de 1.2 cu. ft. y múltiples ajustes de cocción para una fácil preparación de alimentos.",
      price: 1599,
      thumbnail:
        "https://www.costco.com.mx/medias/sys_master/products/h47/h1d/11023491596318.jpg",
      code: `PAN${Date.now() / 1000}`,
      stock: 11,
      category: "cocina",
      owner: "653a45ff59dcb07a93afk68b",
    };

    const { statusCode, ok, _body } = await requester
      .post("/api/products")
      .send(productMock)
      .set("Cookie", [`${this.cookie.key}=${this.cookie.value}`]);

    expect(statusCode).to.be.equal(201);
    expect(ok).to.be.ok;
    expect(_body).to.be.has.property("_id");
    expect(_body).to.be.has.property("owner");
  });

  it("GET: Should get a product by identifier", async function () {
    const id = "65ea77e0346a5813231a8a5e";
    const { statusCode, ok, _body } = await requester.get(
      `/api/products/${id}`
    );
    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.ok;
    expect(_body).to.be.has.property("_id");
    expect(_body).to.be.has.property("title");
    expect(_body).to.be.has.property("description");
    expect(_body).to.be.has.property("price");
    expect(_body).to.be.has.property("thumbnail");
    expect(_body).to.be.has.property("code");
    expect(_body).to.be.has.property("stock");
    expect(_body).to.be.has.property("category");
    expect(_body).to.be.has.property("owner");
  });

  it("PUT: Should update a product by identifier", async function () {
    const productMock = {
      title: "Secadora de Ropa Whirlpool",
      description:
        "Secadora de ropa de carga frontal con capacidad de 7.4 cu. ft. y múltiples programas de secado.",
      price: 3499.5,
      thumbnail: "https://ss634.liverpool.com.mx/xl/1090644161.jpg",
      code: `WHIRL${Date.now() / 1000}`,
      stock: 9,
      category: "lavanderia",
    };
    const { _body: product } = await requester
      .post("/api/products")
      .send(productMock)
      .set("Cookie", [`${this.cookie.key}=${this.cookie.value}`]);
    const { statusCode, ok, _body } = await requester
      .put(`/api/products/${product._id}`)
      .send({ price: 2000 });
    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.ok;
    expect(_body).to.has.property("status", "success");
    expect(_body).to.has.property(
      "message",
      "The resource has been updated succesfully"
    );
  });

  it("DELETE: Should delete a product by identifier", async function () {
    const productMock = {
      title: "Licuadora Oster",
      description:
        "Licuadora de alto rendimiento con cuchillas de acero inoxidable y jarra de vidrio resistente.",
      price: 800,
      thumbnail:
        "https://m.media-amazon.com/images/I/51X0jzGB9NL._AC_UF894,1000_QL80_.jpg",
      code: `OST${Date.now() / 1000}`,
      stock: 16,
      category: "cocina",
    };

    const { _body: product } = await requester
      .post("/api/products")
      .send(productMock)
      .set("Cookie", [`${this.cookie.key}=${this.cookie.value}`]);

    const { statusCode, ok, _body } = await requester
      .delete(`/api/products/${product._id}`)
      .set("Cookie", [`${this.cookie.key}=${this.cookie.value}`]);

    expect(statusCode).to.be.equal(200);
    expect(ok).to.be.ok;
    expect(_body).to.has.property("status", "success");
    expect(_body).to.has.property(
      "message",
      "The resource has been deleted succesfully"
    );
  });
});
