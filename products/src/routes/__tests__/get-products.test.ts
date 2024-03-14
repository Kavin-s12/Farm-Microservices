import request from "supertest";
import { app } from "../../app";

const createProduct = () => {
  return request(app)
    .post("/api/products")
    .set("Cookie", global.signin({ isAdmin: true }))
    .send({});
};

it("Query all the products", async () => {
  await request(app).get("/api/products").send({}).expect(200);
});

it("Query all the products and check products", async () => {
  const productOne = await createProduct();
  const productTwo = await createProduct();
  const productThree = await createProduct();

  const response = await request(app).get("/api/products").send({}).expect(200);
  expect(response.body.products).toHaveLength(3);

  expect(response.body.products[0].id).toEqual(productOne.body.id);
  expect(response.body.products[1].id).toEqual(productTwo.body.id);
  expect(response.body.products[2].id).toEqual(productThree.body.id);
});
