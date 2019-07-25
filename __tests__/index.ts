import request from "supertest";
import app from "../src/app";
import mongoose from "mongoose";

describe("API Routes", () => {
  afterAll(async () => mongoose.connection.close());
  test("GET / returns welcome onboard", async () => {
    return await request(app)
      .get("/")
      .expect(res => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toContain("welcome");
      });
  });
  test("GET /wrongUrl should return invalid path", async () => {
    return await request(app)
      .get("/wrongUrl")
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toContain("invalid path");
      });
  });
});
