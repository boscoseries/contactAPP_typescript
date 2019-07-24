import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";

describe("API Routes", () => {
  afterAll(async () => mongoose.connection.close());
  test("GET / returns welcome onboard", async done => {
    return await request(app)
      .get("/")
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toContain("welcome");
        done();
      });
  });
});
