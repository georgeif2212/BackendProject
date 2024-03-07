import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("Testing products router", function () {
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
      .send(productMock);
    expect(statusCode).to.be.equal(201);
    expect(ok).to.be.ok;
    expect(_body).to.be.has.property("_id");
    expect(_body.owner).to.be.has.property("first_name");
  });
});
