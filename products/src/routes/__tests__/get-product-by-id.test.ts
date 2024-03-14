import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("Query product by ID which does not exists", async () => {
  const id = new mongoose.Types.ObjectId();
  await request(app).get(`/api/products/${id}`).send({}).expect(404);
});

it("Query product by ID", async () => {
  const { body: createdProduct } = await request(app)
    .post("/api/products")
    .set("Cookie", global.signin({ isAdmin: true }))
    .send({});

  await request(app)
    .get(`/api/products/${createdProduct.id}`)
    .send({})
    .expect(200);
});
