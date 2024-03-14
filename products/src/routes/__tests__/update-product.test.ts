import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

const createProduct = (user: string[]) => {
  return request(app).post("/api/products").set("Cookie", user).send({});
};

const payload = {
  name: "test name",
  image: "",
  description: "test description",
  category: "test category",
  brand: "test brand",
};

it("Product ID not found", async () => {
  await request(app)
    .put(`/api/products/${new mongoose.Types.ObjectId()}`)
    .set("Cookie", global.signin({ isAdmin: true }))
    .send(payload)
    .expect(404);
});

it("Update a sample product fails without admin access", async () => {
  const user = global.signin({ isAdmin: true });
  const { body: product } = await createProduct(user);

  await request(app)
    .put(`/api/products/${product.id}`)
    .set("Cookie", global.signin())
    .send(payload)
    .expect(401);

  const response = await request(app)
    .get(`/api/products/${product.id}`)
    .expect(200);

  expect(response.body.name).toEqual("sample name");
  expect(response.body.description).toEqual("sample description");
  expect(response.body.category).toEqual("sample category");
  expect(response.body.brand).toEqual("sample brand");
});

it("Update a sample product fails by different user", async () => {
  const userOne = global.signin({ isAdmin: true });
  const userTwo = global.signin({ isAdmin: true });

  const { body: product } = await createProduct(userOne);

  await request(app)
    .put(`/api/products/${product.id}`)
    .set("Cookie", userTwo)
    .send(payload)
    .expect(401);

  const response = await request(app)
    .get(`/api/products/${product.id}`)
    .expect(200);

  expect(response.body.name).toEqual("sample name");
  expect(response.body.description).toEqual("sample description");
  expect(response.body.category).toEqual("sample category");
  expect(response.body.brand).toEqual("sample brand");
});

it("Update a sample product", async () => {
  const user = global.signin({ isAdmin: true });
  const { body: product } = await createProduct(user);

  const response = await request(app)
    .put(`/api/products/${product.id}`)
    .set("Cookie", user)
    .send(payload)
    .expect(200);

  expect(response.body.name).toEqual("test name");
  expect(response.body.description).toEqual("test description");
  expect(response.body.category).toEqual("test category");
  expect(response.body.brand).toEqual("test brand");
  expect(response.body.user).toBeDefined();
});

//publisher checks

it("Update a sample product without price and countInStock - No events published", async () => {
  const user = global.signin({ isAdmin: true });
  const { body: product } = await createProduct(user);

  const { body: updatedProduct } = await request(app)
    .put(`/api/products/${product.id}`)
    .set("Cookie", user)
    .send(payload)
    .expect(200);

  expect(updatedProduct.name).toEqual("test name");
  expect(updatedProduct.description).toEqual("test description");
  expect(updatedProduct.category).toEqual("test category");
  expect(updatedProduct.brand).toEqual("test brand");
  expect(updatedProduct.user).toBeDefined();

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
});

it("Update a sample product with price or countInStock - Events published for create and update", async () => {
  const user = global.signin({ isAdmin: true });
  const { body: product } = await createProduct(user);

  const { body: updatedProduct } = await request(app)
    .put(`/api/products/${product.id}`)
    .set("Cookie", user)
    .send({ price: 100 })
    .expect(200);

  expect(updatedProduct.price).toEqual(100);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
