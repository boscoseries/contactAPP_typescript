import request from "supertest";
import app from "../src/app";

describe("API Routes", () => {
  test("/ returns welcome onboard", () => {
    return request(app)
      .get("/")
      .expect(200, { message: "welcome onboard" });
  });
});
